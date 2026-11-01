import { Router } from 'express';
import {
  getAllGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';

const router = Router();

router.get('/', getAllGallery);
router.post('/', createGalleryItem);
router.patch('/:id', updateGalleryItem);
router.put('/:id', updateGalleryItem);
router.delete('/:id', deleteGalleryItem);

export default router;

