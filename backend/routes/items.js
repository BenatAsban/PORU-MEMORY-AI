import express from 'express';
import auth from '../middleware/auth.js';
import { addItem, getItems, updateItem, deleteItem, upload } from '../controllers/itemController.js';

const router = express.Router();

router.post('/add', auth, upload.single('image'), addItem);
router.get('/', auth, getItems);
router.put('/:id', auth, upload.single('image'), updateItem);
router.delete('/:id', auth, deleteItem);

export default router;