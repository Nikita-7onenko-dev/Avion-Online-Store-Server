import express from 'express';
import multer from 'multer';
import ProductController from '../controllers/ProductController.js';

const router = express.Router();

const upload = multer({
  dest: 'temp/'
})

router.post('/', upload.single('image'),ProductController.create)
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getOne);
router.put('/:id', upload.single('image'), ProductController.update);
router.delete('/:id', ProductController.delete);

export default router;