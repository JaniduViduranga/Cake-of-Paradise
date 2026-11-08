import Gallery from '../models/Gallery.js';
import { cloudinary } from '../config/cloudinary.js';

/**
 * Normalizes input category to match Mongoose schema enum:
 * ['Standard', 'Birthday', 'Wedding Cake', 'Cupcake', 'Custom']
 */
const normalizeCategory = (cat) => {
  if (!cat) return 'Standard';
  const lower = cat.trim().toLowerCase();
  if (lower.includes('wedding')) return 'Wedding Cake';
  if (lower.includes('birthday')) return 'Birthday';
  if (lower.includes('cupcake')) return 'Cupcake';
  if (lower.includes('custom')) return 'Custom';
  if (lower.includes('standard')) return 'Standard';
  const valid = ['Standard', 'Birthday', 'Wedding Cake', 'Cupcake', 'Custom'];
  const match = valid.find((v) => v.toLowerCase() === lower);
  return match || 'Standard';
};

/**
 * Uploads a single image to Cloudinary via Multer and creates MongoDB Gallery record.
 * POST /api/gallery/upload
 */
export async function uploadGalleryImage(req, res) {
  try {
    let imageUrl = req.file?.path || req.file?.secure_url || req.file?.url;
    let publicId = req.file?.filename || req.file?.public_id;

    // Fallback if imageUrl is provided directly
    if (!imageUrl && req.body.imageUrl) {
      imageUrl = req.body.imageUrl.trim();
      publicId = `external_${Date.now()}`;
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded. Please attach an image file.',
      });
    }

    const { title, category, description, tags, isFeatured } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Image title is required.',
      });
    }

    if (!publicId) {
      publicId = `gallery_${Date.now()}`;
    }

    // Process tags
    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof tags === 'string' && tags.trim()) {
      parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const newImage = await Gallery.create({
      title: title.trim(),
      category: normalizeCategory(category),
      description: (description || '').trim(),
      tags: parsedTags,
      isFeatured: isFeatured === true || isFeatured === 'true',
      imageUrl,
      publicId,
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded to Cloudinary and saved to gallery!',
      image: newImage,
      data: newImage,
    });
  } catch (error) {
    console.error('[GalleryController] Error uploading gallery image:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while uploading gallery image.',
    });
  }
}

/**
 * Retrieves paginated gallery images from MongoDB, optionally filtered by category.
 * Sorted descending by createdAt (latest first).
 * GET /api/gallery?page=1&limit=8&category=Wedding
 */
export async function getGallery(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 12);
    const { category } = req.query;

    const filter = {};
    if (category && category !== 'All') {
      const lower = category.trim().toLowerCase();
      if (lower.includes('wedding')) {
        filter.category = new RegExp('^(Wedding Cake|Wedding)$', 'i');
      } else if (lower.includes('cupcake')) {
        filter.category = new RegExp('^(Cupcake|Cupcakes)$', 'i');
      } else if (lower.includes('standard')) {
        filter.category = new RegExp('^(Standard|Standard Cakes)$', 'i');
      } else {
        filter.category = new RegExp(`^${category}$`, 'i');
      }
    }

    const totalImages = await Gallery.countDocuments(filter);
    const totalPages = Math.ceil(totalImages / limit) || 1;
    const skip = (page - 1) * limit;

    const images = await Gallery.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      images,
      data: images, // backward compatibility
      items: images, // backward compatibility
      currentPage: page,
      totalPages,
      totalImages,
      count: images.length,
    });
  } catch (error) {
    console.error('[GalleryController] Error fetching gallery:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching gallery images.',
    });
  }
}

/**
 * Retrieves random gallery images for the Home Page hero slider.
 * Uses MongoDB $sample aggregation to pick random images from uploaded gallery items.
 * GET /api/gallery/random?count=6
 */
export async function getRandomGalleryImages(req, res) {
  try {
    const count = Math.max(1, parseInt(req.query.count || req.query.limit, 10) || 6);

    const randomDocs = await Gallery.aggregate([
      { $sample: { size: count } },
    ]);

    const normalized = randomDocs.map((doc) => ({
      _id: doc._id,
      id: doc._id,
      title: doc.title,
      category: doc.category,
      imageUrl: doc.imageUrl,
      image: doc.imageUrl,
      description: doc.description || '',
      tags: doc.tags || [],
      isFeatured: doc.isFeatured || false,
      createdAt: doc.createdAt,
    }));

    res.status(200).json({
      success: true,
      images: normalized,
      data: normalized,
      count: normalized.length,
    });
  } catch (error) {
    console.error('[GalleryController] Error fetching random gallery:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching random gallery images.',
      images: [],
    });
  }
}

/**
 * Updates a gallery image record in MongoDB (e.g. toggle isFeatured, title, description, category, tags).
 * PATCH /api/gallery/:id
 */
export async function updateGalleryImage(req, res) {
  try {
    const { id } = req.params;
    const { title, category, description, tags, isFeatured } = req.body;

    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Image not found.',
      });
    }

    if (title !== undefined) item.title = title.trim();
    if (category !== undefined) item.category = normalizeCategory(category);
    if (description !== undefined) item.description = description.trim();
    if (isFeatured !== undefined) item.isFeatured = isFeatured === true || isFeatured === 'true';
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        item.tags = tags.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof tags === 'string') {
        item.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully.',
      image: item,
      data: item,
    });
  } catch (error) {
    console.error('[GalleryController] Error updating gallery item:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating gallery item.',
    });
  }
}

/**
 * Deletes an image document from MongoDB and destroys its physical asset on Cloudinary.
 * DELETE /api/gallery/:id
 */
export async function deleteGalleryImage(req, res) {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Image not found.',
      });
    }

    // Delete physical asset from Cloudinary
    if (item.publicId) {
      try {
        await cloudinary.uploader.destroy(item.publicId);
      } catch (cloudErr) {
        console.warn(`[GalleryController] Cloudinary asset destruction failed for ${item.publicId}:`, cloudErr.message);
      }
    }

    // Delete document from MongoDB
    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('[GalleryController] Error deleting gallery image:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting gallery image.',
    });
  }
}

// Backward-compatibility aliases
export const createGalleryItem = uploadGalleryImage;
export const getAllGallery = getGallery;
export const updateGalleryItem = updateGalleryImage;
export const deleteGalleryItem = deleteGalleryImage;
