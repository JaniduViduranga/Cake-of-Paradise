import Gallery from '../models/Gallery.js';

// Default gallery items if database is freshly started
const DEFAULT_GALLERY_SEEDS = [
  {
    title: 'Vintage Heart Lace',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&auto=format&fit=crop',
    category: 'Birthday Cakes',
    description: 'Delicate piping and vintage buttercream lace finish',
    tags: ['Vintage', 'Buttercream', 'Lace'],
    isFeatured: true,
  },
  {
    title: 'Elegant White Tiered',
    image: 'https://images.unsplash.com/photo-1549040132-3922d9d16562?w=600&auto=format&fit=crop',
    category: 'Wedding Cakes',
    description: '3-tier white fondant with fresh floral arrangement',
    tags: ['Wedding', 'Floral', 'Tiered'],
    isFeatured: true,
  },
  {
    title: 'Wonderland Book Stack',
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&auto=format&fit=crop',
    category: 'Standard Cakes',
    description: 'Hand-sculpted fondant books with edible gold paint',
    tags: ['Sculpted', 'Standard', 'Book'],
    isFeatured: false,
  },
  {
    title: 'Pastel Macaroon Stack',
    image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&auto=format&fit=crop',
    category: 'Cupcakes',
    description: 'Assorted pastel cupcakes topped with macarons',
    tags: ['Cupcakes', 'Macarons', 'Pastel'],
    isFeatured: true,
  },
];

export async function getAllGallery(req, res) {
  try {
    const { category, featured } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = new RegExp(category, 'i');
    }
    if (featured === 'true') {
      filter.isFeatured = true;
    }

    let items = await Gallery.find(filter).sort({ createdAt: -1 });

    // Seed defaults if totally empty
    if ((!items || items.length === 0) && !category && !featured) {
      try {
        await Gallery.insertMany(DEFAULT_GALLERY_SEEDS);
        items = await Gallery.find().sort({ createdAt: -1 });
      } catch (seedErr) {
        console.warn('Could not auto-seed gallery:', seedErr.message);
        items = DEFAULT_GALLERY_SEEDS;
      }
    }

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
      items,
    });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching gallery items.',
      data: DEFAULT_GALLERY_SEEDS,
    });
  }
}

export async function createGalleryItem(req, res) {
  try {
    const { title, image, category, description, tags, isFeatured } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Cake title is required.' });
    }
    if (!image) {
      return res.status(400).json({ success: false, message: 'Cake image is required.' });
    }

    // Process tags
    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const newItem = await Gallery.create({
      title: title.trim(),
      image,
      category: category || 'Standard Cakes',
      description: (description || '').trim(),
      tags: parsedTags,
      isFeatured: Boolean(isFeatured),
    });

    res.status(201).json({
      success: true,
      message: 'Cake photo published to gallery successfully!',
      data: newItem,
      item: newItem,
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error saving gallery item.',
    });
  }
}

export async function updateGalleryItem(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const updated = await Gallery.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully!',
      data: updated,
      item: updated,
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating gallery item.',
    });
  }
}

export async function deleteGalleryItem(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Gallery.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Cake design removed from gallery successfully.',
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting gallery item.',
    });
  }
}

