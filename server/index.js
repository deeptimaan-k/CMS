import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from './config/db.js';


dotenv.config();

const app = express();


const connectWithRetry = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to connect to MongoDB. Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import segmentRoutes from './routes/segmentRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';


app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/delivery', deliveryRoutes);


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});