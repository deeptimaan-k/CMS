import { useState } from 'react';
import { Send, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

interface CampaignDeliveryProps {
  campaignId: string;
  onDeliveryComplete?: () => void;
}

const CampaignDelivery = ({ campaignId, onDeliveryComplete }: CampaignDeliveryProps) => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryStats, setDeliveryStats] = useState<{
    messageCount?: number;
    sent?: number;
    failed?: number;
  }>({});

  const handleSend = async () => {
    try {
      setSending(true);
      setError(null);

      const response = await axios.post(`${API_URL}/campaigns/${campaignId}/send`);
      setDeliveryStats({ messageCount: response.data.messageCount });

      // Poll for delivery status updates
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(`${API_URL}/campaigns/${campaignId}`);
          const campaign = statusResponse.data;

          if (campaign.status === 'sent') {
            clearInterval(pollInterval);
            setDeliveryStats({
              messageCount: campaign.metrics.sent,
              sent: campaign.metrics.delivered,
              failed: campaign.metrics.bounced,
            });
            onDeliveryComplete?.();
          }
        } catch (err) {
          console.error('Failed to fetch delivery status:', err);
        }
      }, 2000);

      // Clear interval after 30 seconds to prevent infinite polling
      setTimeout(() => clearInterval(pollInterval), 30000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send campaign');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            {error}
          </div>
        </div>
      )}

      {deliveryStats.messageCount ? (
        <div className="rounded-md bg-gray-50 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Delivery Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                Sent Successfully
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {deliveryStats.sent || 0}
              </div>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <XCircle className="h-4 w-4 text-red-500 mr-1" />
                Failed
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {deliveryStats.failed || 0}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleSend}
          disabled={sending}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4 mr-2" />
          {sending ? 'Sending Campaign...' : 'Send Campaign'}
        </button>
      )}
    </div>
  );
};

export default CampaignDelivery;