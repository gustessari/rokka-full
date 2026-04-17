import { Request, Response } from 'express';
import VaultItem from '../models/VaultItem.js';
import User from '../models/User.js';

export async function saveVaultItem(req: Request, res: Response) {
  const { sectionId, type, encryptedData } = req.body;
  if (!sectionId || !type || !encryptedData) {
    return res.status(400).json({ error: 'sectionId, type, and encryptedData are required' });
  }

  const sizeBytes = Buffer.byteLength(encryptedData, 'utf8');
  const user = await User.findById(req.user!._id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.storageUsedBytes + sizeBytes > user.storageLimitBytes) {
    return res.status(413).json({ error: 'Storage limit exceeded' });
  }

  const item = await VaultItem.create({
    userId: req.user!._id,
    sectionId,
    type,
    encryptedData,
    sizeBytes,
  });

  user.storageUsedBytes += sizeBytes;
  await user.save();

  res.status(201).json(item);
}

export async function getVaultItems(req: Request, res: Response) {
  const { sectionId } = req.query;
  const filter: Record<string, unknown> = { userId: req.user!._id };
  if (sectionId) filter.sectionId = sectionId;

  const items = await VaultItem.find(filter).sort({ createdAt: -1 });
  res.json(items);
}

export async function deleteVaultItem(req: Request, res: Response) {
  const { id } = req.params;
  const item = await VaultItem.findOne({ _id: id, userId: req.user!._id });
  if (!item) return res.status(404).json({ error: 'Item not found' });

  await VaultItem.deleteOne({ _id: id });
  await User.findByIdAndUpdate(req.user!._id, { $inc: { storageUsedBytes: -item.sizeBytes } });
  res.json({ message: 'Item deleted' });
}

export async function updateVaultItem(req: Request, res: Response) {
  const { id } = req.params;
  const { encryptedData, type, sectionId } = req.body;
  const update: Record<string, unknown> = {};
  if (encryptedData) update.encryptedData = encryptedData;
  if (type) update.type = type;
  if (sectionId) update.sectionId = sectionId;

  if (encryptedData) {
    const oldItem = await VaultItem.findOne({ _id: id, userId: req.user!._id });
    if (!oldItem) return res.status(404).json({ error: 'Item not found' });
    const newSize = Buffer.byteLength(encryptedData, 'utf8');
    const sizeDiff = newSize - oldItem.sizeBytes;
    update.sizeBytes = newSize;
    await User.findByIdAndUpdate(req.user!._id, { $inc: { storageUsedBytes: sizeDiff } });
  }

  const item = await VaultItem.findOneAndUpdate(
    { _id: id, userId: req.user!._id },
    update,
    { new: true }
  );
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
}

export async function bulkUpdateItems(req: Request, res: Response) {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items array is required' });

  const ops = items.map((item: { _id: string; encryptedData: string; sizeBytes?: number }) =>
    VaultItem.findOneAndUpdate(
      { _id: item._id, userId: req.user!._id },
      { encryptedData: item.encryptedData, sizeBytes: item.sizeBytes || Buffer.byteLength(item.encryptedData, 'utf8') },
      { new: true }
    )
  );
  await Promise.all(ops);
  res.json({ message: 'Bulk update complete' });
}
