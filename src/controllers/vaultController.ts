import { Request, Response } from 'express';
import VaultItem from '../models/VaultItem';

export async function saveVaultItem(req: Request, res: Response) {
  const { type, encryptedData } = req.body;
  const item = new VaultItem({
    userId: req.user._id,
    type,
    encryptedData
  });
  await item.save();
  res.status(201).json({ message: 'Item saved' });
}

export async function getVaultItems(req: Request, res: Response) {
  const items = await VaultItem.find({ userId: req.user._id });
  res.json(items);
}
