import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShoppingCart, 
  BarChart2, 
  Send, 
  TrendingUp, 
  TrendingDown,
  Bell,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import { API_URL, formatCurrency, formatDate } from '../utils/constants';

interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  activeSegments: number;
  activeCampaigns: number;
}

interface RecentActivity {
  _id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeSegments: 0,
    activeCampaigns: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // For demo purposes, we'll simulate data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalCustomers: 256,
        totalOrders: 1248,
        totalRevenue: 85420.75,
        activeSegments: 12,
        activeCampaigns: 8,
      });
      setLoading(false);
    }, 1000);
  }, []);
  
  // Demo recent activities
  const recentActivities = [
    { 
      _id: '1', 
      type: 'customer', 
      title: 'New customer registered', 
      description: 'Jane Cooper (jane@example.com) created an account',
      createdAt: new Date(Date.now() - 12 * 60000).toISOString()
    },
    { 
      _id: '2', 
      type: 'order', 
      title: 'New order placed', 
      description: 'Order #ORD-5523 for $129.99',
      createdAt: new Date(Date.now() - 45 * 60000).toISOString()
    },
    { 
      _id: '3', 
      type: 'campaign', 
      title: 'Campaign completed', 
      description: 'Summer Sale campaign ended with 24% open rate',
      createdAt: new Date(Date.now() - 3 * 3600000).toISOString()
    },
    { 
      _id: '4', 
      type: 'segment', 
      title: 'Segment updated', 
      description: 'High Value Customers segment criteria modified',
      createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
    },
  ];
  
  // Stats cards configuration
  const statsCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-primary-500',
      change: '+12%',
      trend: 'up',
      path: '/customers',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-secondary-500',
      change: '+8%',
      trend: 'up',
      path: '/orders',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: 'bg-accent-500',
      change: '+15%',
      trend: 'up',
      path: '/orders',
    },
    {
      title: 'Active Segments',
      value: stats.activeSegments,
      icon: BarChart2,
      color: 'bg-success-500',
      change: '+4',
      trend: 'up',
      path: '/segments',
    },
    {
      title: 'Active Campaigns',
      value: stats.activeCampaigns,
      icon: Send,
      color: 'bg-warning-500',
      change: '-1',
      trend: 'down',
      path: '/campaigns',
    },
  ];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  
  // Activity icon mapping
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'customer':
        return <Users className="h-5 w-5 text-primary-500" />;
      case 'order':
        return <ShoppingCart className="h-5 w-5 text-secondary-500" />;
      case 'segment':
        return <BarChart2 className="h-5 w-5 text-success-500" />;
      case 'campaign':
        return <Send className="h-5 w-5 text-warning-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="mt-4 flex space-x-3 sm:mt-0">
          <button className="btn btn-outline">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </button>
          <button className="btn btn-primary">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Reports
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg bg-gray-200 p-6"
            ></div>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {statsCards.map((card, index) => (
            <motion.div
              key={index}
              className="overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md"
              variants={item}
            >
              <Link to={card.path} className="block h-full p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`rounded-lg ${card.color} p-2 text-white`}
                  >
                    <card.icon className="h-5 w-5" />
                  </div>
                  <div
                    className={`flex items-center space-x-1 text-sm ${
                      card.trend === 'up' ? 'text-success-600' : 'text-error-600'
                    }`}
                  >
                    <span>{card.change}</span>
                    {card.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{card.value}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <Link to="/" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity._id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="rounded-full bg-gray-100 p-2">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {formatDate(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Campaign Performance */}
        <motion.div
          className="rounded-lg bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Campaign Performance</h2>
            <Link to="/campaigns" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Summer Newsletter</h3>
                <span className="rounded-full bg-success-100 px-2 py-1 text-xs text-success-800">
                  Active
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">Sent to 1,245 recipients</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-500">Open Rate</p>
                  <p className="text-base font-semibold text-gray-900">32.4%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Click Rate</p>
                  <p className="text-base font-semibold text-gray-900">12.8%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Conversion</p>
                  <p className="text-base font-semibold text-gray-900">3.2%</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">New Product Launch</h3>
                <span className="rounded-full bg-warning-100 px-2 py-1 text-xs text-warning-800">
                  Scheduled
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">Targeting 846 recipients</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-500">Scheduled</p>
                  <p className="text-base font-semibold text-gray-900">Tomorrow</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Segment</p>
                  <p className="text-base font-semibold text-gray-900">High Value</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-base font-semibold text-gray-900">Email</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;