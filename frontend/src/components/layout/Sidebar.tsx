import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BabyIcon, 
  HeartPulse, 
  ClipboardCheck, 
  Users, 
  BarChart4, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

const Sidebar: React.FC = () => {
  const { authState, logout } = useAuth();
  const location = useLocation();
  const { user } = authState;

  if (!user) return null;

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">DeclaraSen</h1>
        <p className="text-sm text-gray-500">{user.organization}</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          <Link 
            to="/dashboard" 
            className={`flex items-center px-3 py-2 text-sm rounded-md group ${
              isActiveRoute('/dashboard') 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <LayoutDashboard className="mr-3 h-5 w-5 flex-shrink-0" />
            <span>Dashboard</span>
          </Link>

          {user.role === UserRole.HOSPITAL && (
            <>
              <Link 
                to="/births" 
                className={`flex items-center px-3 py-2 text-sm rounded-md group ${
                  isActiveRoute('/births') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <BabyIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span>Birth Declarations</span>
              </Link>

              <Link 
                to="/deaths" 
                className={`flex items-center px-3 py-2 text-sm rounded-md group ${
                  isActiveRoute('/deaths') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <HeartPulse className="mr-3 h-5 w-5 flex-shrink-0" />
                <span>Death Declarations</span>
              </Link>
            </>
          )}

          {user.role === UserRole.MUNICIPALITY && (
            <Link 
              to="/validations" 
              className={`flex items-center px-3 py-2 text-sm rounded-md group ${
                isActiveRoute('/validations') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              <ClipboardCheck className="mr-3 h-5 w-5 flex-shrink-0" />
              <span>Validations</span>
            </Link>
          )}

          {user.role === UserRole.ADMIN && (
            <>
              <Link 
                to="/users" 
                className={`flex items-center px-3 py-2 text-sm rounded-md group ${
                  isActiveRoute('/users') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <Users className="mr-3 h-5 w-5 flex-shrink-0" />
                <span>User Management</span>
              </Link>

              <Link 
                to="/statistics" 
                className={`flex items-center px-3 py-2 text-sm rounded-md group ${
                  isActiveRoute('/statistics') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <BarChart4 className="mr-3 h-5 w-5 flex-shrink-0" />
                <span>System Statistics</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-red-50 hover:text-red-700 w-full"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;