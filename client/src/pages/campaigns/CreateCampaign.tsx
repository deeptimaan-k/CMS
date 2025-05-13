import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Users } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../utils/constants';
import SegmentBuilder from '../../components/segments/SegmentBuilder';

interface CampaignFormData {
  name: string;
  description: string;
  type: 'email' | 'sms' | 'push' | 'social';
  content: {
    subject?: string;
    body: string;
  };
}

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audienceSize, setAudienceSize] = useState<number | null>(null);
  const [segmentRules, setSegmentRules] = useState<any>(null);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    type: 'email',
    content: {
      subject: '',
      body: '',
    },
  });

  const handleSegmentUpdate = async (segment: any) => {
    try {
      const response = await axios.post(`${API_URL}/segments/preview`, {
        conditions: segment,
      });
      setAudienceSize(response.data.count);
      setSegmentRules(segment);
    } catch (err) {
      console.error('Failed to preview audience:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!segmentRules) {
      setError('Please define segment rules');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First create the segment
      const segmentResponse = await axios.post(`${API_URL}/segments`, {
        name: `${formData.name} Segment`,
        description: `Segment for campaign: ${formData.name}`,
        conditions: segmentRules,
      });

      // Then create the campaign
      const campaignResponse = await axios.post(`${API_URL}/campaigns`, {
        ...formData,
        segment: segmentResponse.data._id,
      });

      navigate(`/campaigns/${campaignResponse.data._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Campaign</h1>
          <p className="mt-1 text-sm text-gray-600">
            Define your campaign details and target audience
          </p>
        </div>
        {audienceSize !== null && (
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            Estimated audience: <span className="font-semibold ml-1">{audienceSize}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error-50 text-error-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Campaign Details</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Campaign Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Campaign Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  type: e.target.value as CampaignFormData['type']
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                required
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="push">Push Notification</option>
                <option value="social">Social Media</option>
              </select>
            </div>

            {formData.type === 'email' && (
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject Line
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.content.subject}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    content: { ...prev.content, subject: e.target.value }
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                Message Content
              </label>
              <textarea
                id="body"
                value={formData.content.body}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  content: { ...prev.content, body: e.target.value }
                }))}
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Target Audience</h2>
          <SegmentBuilder 
            onSubmit={() => {}} 
            onUpdate={handleSegmentUpdate}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2"
            disabled={loading || !segmentRules}
          >
            <Save className="h-4 w-4" />
            {loading ? 'Creating Campaign...' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;