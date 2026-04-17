import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { saveVaultItem, getVaultItems, deleteVaultItem, updateVaultItem, bulkUpdateItems } from '../controllers/vaultController.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/save', saveVaultItem);
router.get('/all', getVaultItems);
router.put('/:id', updateVaultItem);
router.delete('/:id', deleteVaultItem);
router.post('/bulk-update', bulkUpdateItems);

export default router;
