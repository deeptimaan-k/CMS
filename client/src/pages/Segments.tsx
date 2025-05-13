import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

interface Segment {
  _id: string;
  name: string;
  estimatedCount: number;
  conditions: any[];
  createdAt: string;
}

const Segments = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = await axios.get(`${API_URL}/segments`);
        setSegments(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch segments');
      } finally {
        setLoading(false);
      }
    };

    fetchSegments();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Segments</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage customer segments
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/segments/new"
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Segment
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
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Search segments..."
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
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading segments...
                  </td>
                </tr>
              ) : segments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No segments found
                  </td>
                </tr>
              ) : (
                segments.map((segment) => (
                  <tr key={segment._id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {segment.name}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {segment.estimatedCount} customers
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(segment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        to={`/segments/${segment._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Segments;