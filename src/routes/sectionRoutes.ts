import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createSection, getSections, updateSection, deleteSection } from '../controllers/sectionController.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/', createSection);
router.get('/', getSections);
router.put('/:id', updateSection);
router.delete('/:id', deleteSection);

export default router;
