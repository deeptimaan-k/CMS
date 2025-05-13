import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageSquare, Clock, Tag } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

interface CampaignInsightsProps {
  campaignId: string;
}

interface InsightData {
  summary: string;
  suggestions: string[];
  tags: string[];
  nextBestTime: string;
}

const CampaignInsights = ({ campaignId }: CampaignInsightsProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<InsightData | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.post(`${API_URL}/ai/analyze/${campaignId}`);
        setInsights(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-error-600 text-sm">
        {error}
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      
      <div className="bg-primary-50 rounded-lg p-4">
        <div className="flex items-start">
          <Brain className="h-5 w-5 text-primary-600 mt-1 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-primary-900">Performance Summary</h3>
            <p className="mt-1 text-sm text-primary-700">{insights.summary}</p>
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Message Suggestions</h3>
        </div>
        <div className="space-y-3">
          {insights.suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="text-sm text-gray-600 bg-gray-50 rounded p-3"
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Tag className="h-4 w-4 text-gray-400" />
        <div className="flex flex-wrap gap-2">
          {insights.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      
      <div className="flex items-center text-sm text-gray-600">
        <Clock className="h-4 w-4 text-gray-400 mr-2" />
        <span>Recommended next send time: {insights.nextBestTime}</span>
      </div>
    </motion.div>
  );
};

export default CampaignInsights;