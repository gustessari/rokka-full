import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import vaultRoutes from './routes/vaultRoutes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);

const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    app.listen(PORT, () => console.log(`Rokka API running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
