import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;
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
  res.json({ token });
}
