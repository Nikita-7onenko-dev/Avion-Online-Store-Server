import express from 'express';
import multer from 'multer';
import productController from '../controllers/ProductController.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
})

router.post('/', upload.single('image'), productController.create)
router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.put('/:id', upload.single('image'), productController.update);
router.delete('/:id', productController.delete);

export default router;