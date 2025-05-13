import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Mail, MessageSquare, Bell, Share2, ArrowUp, ArrowDown } from 'lucide-react';
import axios from 'axios';
import { API_URL, formatDate } from '../utils/constants';

interface Campaign {
  _id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'social';
  status: string;
  metrics: {
    sent: number;
    delivered: number;
    failed: number;
  };
  segment: {
    estimatedCount: number;
  };
  createdAt: string;
}

interface SortConfig {
  key: keyof Campaign | 'metrics.sent' | 'metrics.failed';
  direction: 'asc' | 'desc';
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

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'createdAt',
    direction: 'desc',
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(`${API_URL}/campaigns`);
        setCampaigns(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    
    if (sortConfig.key.includes('.')) {
      const [key1, key2] = sortConfig.key.split('.');
      return (
        ((a as any)[key1][key2] - (b as any)[key1][key2]) * direction
      );
    }
    
    if (sortConfig.key === 'createdAt') {
      return (
        (new Date(a[sortConfig.key]).getTime() -
          new Date(b[sortConfig.key]).getTime()) * direction
      );
    }
    
    return (
      String(a[sortConfig.key as keyof Campaign])
        .localeCompare(String(b[sortConfig.key as keyof Campaign])) * direction
    );
  });

  const filteredCampaigns = sortedCampaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SortIcon = ({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) => (
    <span className="ml-1 inline-block">
      {direction === 'asc' ? (
        <ArrowUp className={`h-4 w-4 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
      ) : (
        <ArrowDown className={`h-4 w-4 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
      )}
    </span>
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Campaign History</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage your marketing campaigns
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/campaigns/new"
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-error-50 p-4 text-sm text-error-700">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mt-3 sm:mt-0">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Filter className="mr-2 h-4 w-4 text-gray-500" />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Campaign
                    <SortIcon 
                      active={sortConfig.key === 'name'} 
                      direction={sortConfig.direction} 
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                  onClick={() => handleSort('metrics.sent')}
                >
                  <div className="flex items-center">
                    Delivery Stats
                    <SortIcon 
                      active={sortConfig.key === 'metrics.sent'} 
                      direction={sortConfig.direction} 
                    />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Created
                    <SortIcon 
                      active={sortConfig.key === 'createdAt'} 
                      direction={sortConfig.direction} 
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading campaigns...
                  </td>
                </tr>
              ) : filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No campaigns found
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => {
                  const TypeIcon = getTypeIcon(campaign.type);
                  return (
                    <motion.tr
                      key={campaign._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <TypeIcon className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-500 capitalize">
                            {campaign.type}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          campaign.status === 'sent' 
                            ? 'bg-green-100 text-green-800'
                            : campaign.status === 'sending'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {campaign.metrics.delivered} delivered
                          {campaign.metrics.failed > 0 && (
                            <span className="text-error-600 ml-2">
                              ({campaign.metrics.failed} failed)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(campaign.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <Link
                          to={`/campaigns/${campaign._id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;