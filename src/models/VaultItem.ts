import mongoose, { Document, Schema } from 'mongoose';

export interface IVaultItem extends Document {
  userId: mongoose.Types.ObjectId;
  sectionId: mongoose.Types.ObjectId;
  type: string;
  encryptedData: string;
  sizeBytes: number;
  createdAt: Date;
}

const VaultItemSchema = new Schema<IVaultItem>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  type: { type: String, required: true, enum: ['link', 'password', 'text', 'image', 'video', 'file'] },
  encryptedData: { type: String, required: true },
  sizeBytes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

VaultItemSchema.index({ userId: 1, sectionId: 1 });

export default mongoose.model<IVaultItem>('VaultItem', VaultItemSchema);
