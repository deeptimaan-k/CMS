import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { API_URL, formatCurrency } from '../utils/constants';

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
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // First check existing orders
        const existingResponse = await axios.get(`${API_URL}/orders`);
        
        // If we already have orders, just display them
        if (existingResponse.data.length > 0) {
          setOrders(existingResponse.data);
          setLoading(false);
          return;
        }

        // Only fetch and add dummy orders if we don't have any
        const dummyResponse = await axios.get('https://dummyjson.com/carts?limit=5');
        const dummyCarts = dummyResponse.data.carts;

        // Get existing customers
        const customersResponse = await axios.get(`${API_URL}/customers`);
        const customers = customersResponse.data;

        if (customers.length === 0) {
          throw new Error('No customers found. Please add customers first.');
        }

        // Add dummy orders one by one
        for (const cart of dummyCarts) {
          try {
            const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
            const orderData = {
              order_id: `ORD-${Math.floor(Math.random() * 10000)}`,
              customer_id: randomCustomer._id,
              amount: cart.total,
              date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            };

            await axios.post(`${API_URL}/orders`, orderData);
          } catch (err: any) {
            console.error(`Failed to add order`, err);
          }
        }

        // Fetch final list of orders
        const response = await axios.get(`${API_URL}/orders`);
        setOrders(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and track customer orders
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/orders/new"
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Order
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
                placeholder="Search orders..."
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
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {order.order_id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {order.customer_id.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </Link>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;