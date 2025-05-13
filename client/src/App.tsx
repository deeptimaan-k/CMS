import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';

// Lazy-loaded pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Customers = lazy(() => import('./pages/Customers'));
const CustomerDetail = lazy(() => import('./pages/CustomerDetail'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Segments = lazy(() => import('./pages/Segments'));
const SegmentDetail = lazy(() => import('./pages/SegmentDetail'));
const CreateSegment = lazy(() => import('./pages/segments/CreateSegment'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const CreateCampaign = lazy(() => import('./pages/campaigns/CreateCampaign'));
const CampaignDetail = lazy(() => import('./pages/CampaignDetail'));
const CampaignDelivery = lazy(() => import('./components/campaigns/CampaignDelivery'));
const CommunicationLogs = lazy(() => import('./pages/CommunicationLogs'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const App = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="segments">
            <Route index element={<Segments />} />
            <Route path="new" element={<CreateSegment />} />
            <Route path=":id" element={<SegmentDetail />} />
          </Route>
          <Route path="campaigns">
            <Route index element={<Campaigns />} />
            <Route path="new" element={<CreateCampaign />} />
            <Route path=":id" element={<CampaignDetail />} />
            <Route path=":id/delivery" element={<CampaignDelivery />} />
          </Route>
          <Route path="communication-logs" element={<CommunicationLogs />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;