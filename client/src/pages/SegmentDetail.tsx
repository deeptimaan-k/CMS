import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Send } from 'lucide-react';
import axios from 'axios';
import { API_URL, formatDate } from '../utils/constants';
import SegmentBuilder from '../components/segments/SegmentBuilder';

interface Segment {
  _id: string;
  name: string;
  description: string;
  conditions: any;
  conditionLogic: 'AND' | 'OR';
  estimatedCount: number;
  createdAt: string;
}

const SegmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [segment, setSegment] = useState<Segment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    const fetchSegment = async () => {
      try {
        const response = await axios.get(`${API_URL}/segments/${id}`);
        setSegment(response.data);
        setFormData({
          name: response.data.name,
          description: response.data.description,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch segment details');
      } finally {
        setLoading(false);
      }
    };

    fetchSegment();
  }, [id]);

  const handleUpdate = async (segmentData: any) => {
    try {
      const response = await axios.put(`${API_URL}/segments/${id}`, {
        ...formData,
        conditions: segmentData,
      });
      setSegment(response.data);
      setEditing(false);
    }
    catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update segment');
    }
  };

  const handleCreateCampaign = () => {
    navigate('/campaigns/new', { state: { segment } });
  };

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

  if (!segment) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Segment not found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/segments"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Segments
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="text-2xl font-semibold text-gray-900 border-b border-gray-300 focus:border-primary-500 focus:ring-0"
                />
              ) : (
                <h1 className="text-2xl font-semibold text-gray-900">{segment.name}</h1>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditing(!editing)}
                className="btn btn-outline"
              >
                {editing ? 'Cancel' : 'Edit Segment'}
              </button>
              <button
                onClick={handleCreateCampaign}
                className="btn btn-primary flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Create Campaign
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-900">Segment Details</h2>
                {editing ? (
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    rows={3}
                  />
                ) : (
                  <p className="mt-2 text-sm text-gray-600">{segment.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Created on {formatDate(segment.createdAt)}</p>
                  <p className="text-sm text-gray-500">
                    Current audience size: <span className="font-semibold">{segment.estimatedCount}</span> customers
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Segment Rules</h2>
              <SegmentBuilder
                onSubmit={handleUpdate}
                disabled={!editing}
                showSubmitButton={editing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentDetail;