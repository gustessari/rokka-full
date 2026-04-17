import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  storageLimitBytes: number;
  storageUsedBytes: number;
  vaultKeyVerifier: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  storageLimitBytes: { type: Number, default: 50 * 1024 * 1024 },
  storageUsedBytes: { type: Number, default: 0 },
  vaultKeyVerifier: { type: String, default: '' },
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
