import { Request, Response } from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    await User.create({ email, passwordHash });
    res.status(201).json({ message: 'User created' });
  } catch {
    res.status(400).json({ error: 'User already exists' });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
  res.json({ token, user: { email: user.email, storageLimitBytes: user.storageLimitBytes, storageUsedBytes: user.storageUsedBytes } });
}

export async function getMe(req: Request, res: Response) {
  const user = await User.findById(req.user!._id).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

export async function setVaultKeyVerifier(req: Request, res: Response) {
  const { verifier } = req.body;
  if (!verifier) return res.status(400).json({ error: 'verifier is required' });
  await User.findByIdAndUpdate(req.user!._id, { vaultKeyVerifier: verifier });
  res.json({ message: 'Vault key verifier saved' });
}

export async function getVaultKeyVerifier(req: Request, res: Response) {
  const user = await User.findById(req.user!._id).select('vaultKeyVerifier');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ verifier: user.vaultKeyVerifier || '' });
}
