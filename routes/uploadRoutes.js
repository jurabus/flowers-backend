import express from 'express';
import { uploadImage, deleteByUrl } from '../controllers/uploadController.js';
const router = express.Router();

router.post('/', upload.single('image'), uploadImage);
router.delete('/', deleteByUrl);

export default router;
