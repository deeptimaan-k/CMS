import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  BarChart2, 
  Send,
  MessageSquare,
  Settings,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ mobile = false, onClose }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Segments', path: '/segments', icon: BarChart2 },
    { name: 'Campaigns', path: '/campaigns', icon: Send },
    { name: 'Communication Logs', path: '/communication-logs', icon: MessageSquare },
  ];
  
  const NavLink = ({ item }: { item: { name: string; path: string; icon: any } }) => {
    const active = isActive(item.path);
    const Icon = item.icon;
    
    return (
      <Link
        to={item.path}
        className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
          active
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon className={`mr-3 h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-500'}`} />
        {item.name}
      </Link>
    );
  };
  
  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white">
     
      <div className="flex h-16 flex-shrink-0 items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-primary-600">CRM Hub</span>
        </Link>
        {mobile && onClose && (
          <button
            type="button"
            className="rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      
      
      {user && (
        <div className="border-b border-gray-200 px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary-100">
                  <span className="text-sm font-medium text-primary-700">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {user.name}
              </p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      )}
      

      <nav className="mt-2 flex-1 space-y-1 px-2">
        {navigation.map((item) => (
          <NavLink key={item.name} item={item} />
        ))}
      </nav>
      
     
      <div className="border-t border-gray-200 p-4">
        <Link
          to="/profile"
          className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <Settings className="mr-3 h-5 w-5 text-gray-500" />
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;