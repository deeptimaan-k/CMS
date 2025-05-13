import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, User, Calendar, DollarSign } from 'lucide-react';
import axios from 'axios';
import { API_URL, formatCurrency, formatDate } from '../utils/constants';

interface Order {
  _id: string;
  order_id: string;
  customer_id: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  date: string;
  createdAt: string;
}

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders/${id}`);
        setOrder(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
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

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Order not found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/orders"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Order #{order.order_id}
            </h1>
            <button className="btn btn-primary">Update Status</button>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Order Information</h2>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm">
                    <Package className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Order ID: {order.order_id}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Amount: {formatCurrency(order.amount)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Order Date: {formatDate(order.date)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500">Customer Information</h2>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <Link
                      to={`/customers/${order.customer_id._id}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {order.customer_id.name}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;