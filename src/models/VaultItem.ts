import mongoose, { Document, Schema } from 'mongoose';

export interface IVaultItem extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  encryptedData: string;
  createdAt: Date;
}

const VaultItemSchema = new Schema<IVaultItem>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  encryptedData: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IVaultItem>('VaultItem', VaultItemSchema);
