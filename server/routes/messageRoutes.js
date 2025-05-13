import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This would typically have message-specific endpoints
// For now, we're handling messages through the campaign controller

export default router;