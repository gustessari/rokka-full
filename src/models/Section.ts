import mongoose, { Document, Schema } from 'mongoose';

export interface ISection extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  icon: string;
  order: number;
  createdAt: Date;
}

const SectionSchema = new Schema<ISection>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  icon: { type: String, default: '📁' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

SectionSchema.index({ userId: 1, order: 1 });

export default mongoose.model<ISection>('Section', SectionSchema);
