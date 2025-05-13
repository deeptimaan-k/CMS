import express from 'express';
import {
  getCampaigns,
  getCampaignById,
  createCampaign,
  sendCampaign,
} from '../controllers/campaignController.js';
import { analyzeCampaign } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCampaigns)
  .post(protect, createCampaign);

router.route('/:id')
  .get(protect, getCampaignById);

router.route('/:id/send')
  .post(protect, sendCampaign);

router.route('/:campaignId/insights')
  .get(protect, analyzeCampaign);

export default router;