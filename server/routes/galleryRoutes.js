import { Router } from 'express';
import { upload } from '../config/cloudinary.js';
import {
  uploadGalleryImage,
  getGallery,
  getRandomGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
} from '../controllers/galleryController.js';

const router = Router();

// Middleware to safely handle Multer & Cloudinary upload errors as JSON
const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('[GalleryUpload] Multer/Cloudinary upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Image upload failed. Please verify the image file format and size.',
      });
    }
    next();
  });
};

// Upload image to Cloudinary and save to MongoDB
router.post('/upload', handleUpload, uploadGalleryImage);
router.post('/', handleUpload, uploadGalleryImage);

// Random gallery images for Home Page Hero Slider
router.get('/random', getRandomGalleryImages);

// Fetch paginated gallery images (e.g. GET /api/gallery?limit=8 for latest 8)
router.get('/', getGallery);

// Update gallery image (e.g. toggle isFeatured, title, description, category, tags)
router.patch('/:id', updateGalleryImage);
router.put('/:id', updateGalleryImage);

// Delete image from MongoDB and Cloudinary
router.delete('/:id', deleteGalleryImage);

export default router;
