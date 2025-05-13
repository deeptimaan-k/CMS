import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SegmentBuilder from '../../components/segments/SegmentBuilder';
import { API_URL } from '../../utils/constants';

const CreateSegment = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (segmentData: any) => {
    try {
      const response = await axios.post(`${API_URL}/segments`, {
        name: 'New Segment',
        conditions: segmentData,
      });

      if (response.data) {
        navigate('/segments');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create segment');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Create New Segment
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-error-50 text-error-700 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <SegmentBuilder onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateSegment;