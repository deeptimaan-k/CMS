import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
      <div className="flex flex-1 items-center justify-between px-4">
       
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </button>
        
       
        <div className="hidden md:flex md:w-full md:max-w-xs">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
       
        <div className="flex items-center">
         
          <button
            type="button"
            className="ml-3 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>
          
      
          <div className="relative ml-3">
            <div>
              <button
                type="button"
                className="flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="sr-only">Open user menu</span>
                {user?.picture ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.picture}
                    alt={user.name}
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                    <span className="text-sm font-medium text-primary-700">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </button>
            </div>
            
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div 
                  className="block px-4 py-2 text-sm text-gray-700"
                >
                  Signed in as <span className="font-medium">{user?.name}</span>
                </div>
                <hr />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;