import express from 'express';
import { register, login, getMe, setVaultKeyVerifier, getVaultKeyVerifier } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/vault-key-verifier', authMiddleware, setVaultKeyVerifier);
router.get('/vault-key-verifier', authMiddleware, getVaultKeyVerifier);

export default router;
