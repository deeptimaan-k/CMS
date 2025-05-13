import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { API_URL, formatCurrency } from '../utils/constants';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  total_spend: number;
  visits: number;
  last_active_date: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        
        const existingResponse = await axios.get(`${API_URL}/customers`);
        
        
        if (existingResponse.data.length > 0) {
          setCustomers(existingResponse.data);
          setLoading(false);
          return;
        }

      
        const dummyResponse = await axios.get('https://dummyjson.com/users?limit=10');
        const dummyUsers = dummyResponse.data.users;

       
        for (const user of dummyUsers) {
          try {
            const customerData = {
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              phone: user.phone,
              total_spend: Math.floor(Math.random() * 10000),
              visits: Math.floor(Math.random() * 50),
            };

            await axios.post(`${API_URL}/customers`, customerData);
          } catch (err: any) {
           
            if (err.response?.status !== 400) {
              console.error(`Failed to add customer: ${user.email}`, err);
            }
          }
        }

      
        const response = await axios.get(`${API_URL}/customers`);
        setCustomers(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and analyze your customer base
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/customers/new"
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
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
                placeholder="Search customers..."
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
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total Spent
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
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <motion.tr
                    key={customer._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                            <span className="font-medium text-primary-600">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{customer.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {customer.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatCurrency(customer.total_spend)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        to={`/customers/${customer._id}`}
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

export default Customers;