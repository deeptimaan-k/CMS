import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Users, Mail, MessageSquare, Bell, Share2 } from 'lucide-react';
import axios from 'axios';
import { API_URL, formatDate } from '../utils/constants';
import CampaignInsights from '../components/campaigns/CampaignInsights';
import CampaignDelivery from '../components/campaigns/CampaignDelivery';

interface Campaign {
  _id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'push' | 'social';
  status: string;
  content: {
    subject?: string;
    body: string;
    mediaUrl?: string;
  };
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    conversions: number;
  };
  segment: {
    _id: string;
    name: string;
    estimatedCount: number;
  };
  createdAt: string;
}

const getTypeIcon = (type: Campaign['type']) => {
  switch (type) {
    case 'email':
      return Mail;
    case 'sms':
      return MessageSquare;
    case 'push':
      return Bell;
    case 'social':
      return Share2;
    default:
      return Mail;
  }
};

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaign = async () => {
    try {
      const response = await axios.get(`${API_URL}/campaigns/${id}`);
      setCampaign(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch campaign details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-error-50 text-error-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Campaign not found</div>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(campaign.type);

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/campaigns"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Campaigns
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TypeIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h1 className="text-2xl font-semibold text-gray-900">{campaign.name}</h1>
            </div>
            {campaign.status === 'draft' && (
              <div className="flex items-center space-x-2">
                <CampaignDelivery 
                  campaignId={campaign._id} 
                  onDeliveryComplete={fetchCampaign}
                />
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Campaign Details</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="text-sm text-gray-900">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          campaign.status === 'sent' 
                            ? 'bg-green-100 text-green-800'
                            : campaign.status === 'sending'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Type</dt>
                      <dd className="text-sm text-gray-900 capitalize">{campaign.type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="text-sm text-gray-900">{formatDate(campaign.createdAt)}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Target Audience</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {campaign.segment.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {campaign.segment.estimatedCount} recipients
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Content</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  {campaign.content.subject && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Subject</h3>
                      <p className="text-sm text-gray-900">{campaign.content.subject}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Message</h3>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{campaign.content.body}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Campaign Insights</h2>
              {campaign.status === 'sent' ? (
                <CampaignInsights campaignId={campaign._id} />
              ) : (
                <div className="text-sm text-gray-500 italic">
                  Insights will be available after the campaign is sent.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;