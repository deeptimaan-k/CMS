import express from 'express';
import { analyzeCampaign } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze/:campaignId', protect, analyzeCampaign);

export default router;