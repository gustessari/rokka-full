import { Request, Response } from 'express';
import Section from '../models/Section.js';
import VaultItem from '../models/VaultItem.js';

export async function createSection(req: Request, res: Response) {
  const { name, icon } = req.body;
  if (!name) return res.status(400).json({ error: 'Section name is required' });

  const count = await Section.countDocuments({ userId: req.user!._id });
  const section = await Section.create({
    userId: req.user!._id,
    name,
    icon: icon || '📁',
    order: count,
  });
  res.status(201).json(section);
}

export async function getSections(req: Request, res: Response) {
  const sections = await Section.find({ userId: req.user!._id }).sort({ order: 1 });
  res.json(sections);
}

export async function updateSection(req: Request, res: Response) {
  const { id } = req.params;
  const { name, icon, order } = req.body;
  const section = await Section.findOneAndUpdate(
    { _id: id, userId: req.user!._id },
    { ...(name && { name }), ...(icon && { icon }), ...(order !== undefined && { order }) },
    { new: true }
  );
  if (!section) return res.status(404).json({ error: 'Section not found' });
  res.json(section);
}

export async function deleteSection(req: Request, res: Response) {
  const { id } = req.params;
  const section = await Section.findOneAndDelete({ _id: id, userId: req.user!._id });
  if (!section) return res.status(404).json({ error: 'Section not found' });
  await VaultItem.deleteMany({ sectionId: id, userId: req.user!._id });
  res.json({ message: 'Section and its items deleted' });
}
