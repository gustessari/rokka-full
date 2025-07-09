import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { saveVaultItem, getVaultItems } from '../controllers/vaultController';

const router = express.Router();
router.use(authMiddleware);

router.post('/save', saveVaultItem);
router.get('/all', getVaultItems);

export default router;
