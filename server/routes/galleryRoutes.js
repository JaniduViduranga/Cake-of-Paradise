import { Router } from 'express';
import {
  getAllGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public: View gallery creations
router.get('/', getAllGallery);

// Admin Protected: Upload, update, and remove gallery creations
router.post('/', protect, authorizeAdmin, createGalleryItem);
router.patch('/:id', protect, authorizeAdmin, updateGalleryItem);
router.put('/:id', protect, authorizeAdmin, updateGalleryItem);
router.delete('/:id', protect, authorizeAdmin, deleteGalleryItem);

export default router;
