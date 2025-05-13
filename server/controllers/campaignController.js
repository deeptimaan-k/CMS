import expressAsyncHandler from 'express-async-handler';
import Campaign from '../models/campaignModel.js';
import Segment from '../models/segmentModel.js';
import Customer from '../models/customerModel.js';
import Message from '../models/messageModel.js';
import CommunicationLog from '../models/communicationLogModel.js';


const getCampaigns = expressAsyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ user: req.user._id })
    .populate('segment', 'name estimatedCount')
    .sort({ createdAt: -1 });
  res.json(campaigns);
});


const getCampaignById = expressAsyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate('segment', 'name description conditions conditionLogic estimatedCount');

  if (campaign && campaign.user.equals(req.user._id)) {
    res.json(campaign);
  } else {
    res.status(404);
    throw new Error('Campaign not found');
  }
});


const createCampaign = expressAsyncHandler(async (req, res) => {
  const { name, description, type, segment: segmentId, content, schedule } = req.body;


  const segment = await Segment.findById(segmentId);
  if (!segment || !segment.user.equals(req.user._id)) {
    res.status(404);
    throw new Error('Segment not found');
  }

  const campaign = await Campaign.create({
    user: req.user._id,
    name,
    description,
    type,
    segment: segmentId,
    content,
    schedule,
  });

  if (campaign) {
    res.status(201).json(campaign);
  } else {
    res.status(400);
    throw new Error('Invalid campaign data');
  }
});


const sendCampaign = expressAsyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign || !campaign.user.equals(req.user._id)) {
    res.status(404);
    throw new Error('Campaign not found');
  }


  const segment = await Segment.findById(campaign.segment);
  if (!segment) {
    res.status(404);
    throw new Error('Segment not found');
  }


  const customers = await Customer.find({
    user: req.user._id,

  });

  if (customers.length === 0) {
    res.status(400);
    throw new Error('No customers in segment');
  }


  campaign.status = 'sending';
  await campaign.save();

  let sentCount = 0;
  let failedCount = 0;


  for (const customer of customers) {
    try {
      const personalizedMessage = campaign.content.body.replace(
        '{{firstName}}',
        customer.name.split(' ')[0]
      );

      const message = await Message.create({
        user: req.user._id,
        campaign: campaign._id,
        customer: customer._id,
        type: campaign.type,
        content: {
          subject: campaign.content.subject,
          body: personalizedMessage,
          mediaUrl: campaign.content.mediaUrl,
        },
        status: 'queued',
      });

      const success = Math.random() < 0.9;
      const status = success ? 'SENT' : 'FAILED';
      const failureReason = success ? null : 'Simulation: Delivery failed';

    
      await CommunicationLog.create({
        user: req.user._id,
        customer: customer._id,
        segment: segment._id,
        status,
        failureReason,
        metadata: { 
          message: personalizedMessage,
          campaignId: campaign._id,
          messageId: message._id
        },
      });

      message.status = success ? 'delivered' : 'failed';
      message.deliveredAt = success ? new Date() : undefined;
      message.failedReason = failureReason;
      await message.save();

      if (success) {
        sentCount++;
      } else {
        failedCount++;
      }
    } catch (error) {
      console.error(`Failed to send message to customer ${customer._id}:`, error);
      failedCount++;
    }
  }

  campaign.metrics.sent = sentCount;
  campaign.metrics.delivered = sentCount;
  campaign.metrics.failed = failedCount;
  campaign.status = 'sent';
  await campaign.save();

  res.json({
    message: `Campaign delivered to ${customers.length} customers`,
    messageCount: customers.length,
    sent: sentCount,
    failed: failedCount,
  });
});

export { 
  getCampaigns, 
  getCampaignById, 
  createCampaign,
  sendCampaign
};