import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, DollarSign, Activity } from 'lucide-react';
import axios from 'axios';
import { API_URL, formatCurrency, formatDate } from '../utils/constants';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  total_spend: number;
  visits: number;
  last_active_date: string;
  createdAt: string;
}

const CustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`${API_URL}/customers/${id}`);
        setCustomer(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch customer details');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
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

  if (!customer) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Customer not found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/customers"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Customers
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">{customer.name}</h1>
            <button className="btn btn-primary">Edit Customer</button>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Contact Information</h2>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <a href={`mailto:${customer.email}`} className="text-primary-600 hover:text-primary-700">
                      {customer.email}
                    </a>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <a href={`tel:${customer.phone}`} className="text-primary-600 hover:text-primary-700">
                        {customer.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500">Customer Since</h2>
                <div className="mt-2 flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  {formatDate(customer.createdAt)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Customer Metrics</h2>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-500">Total Spent</span>
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                      {formatCurrency(customer.total_spend)}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-500">Total Visits</span>
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                      {customer.visits}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500">Last Active</h2>
                <div className="mt-2 flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  {formatDate(customer.last_active_date)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;