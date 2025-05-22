import React, { useState } from 'react';
import { Menu, Bell, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';


interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { authState } = useAuth();
  const { user } = authState;
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Sample notifications for demo purposes
  const notifications = [
    {
      id: 1,
      message: 'New birth declaration received',
      time: '1 hour ago',
      read: false
    },
    {
      id: 2,
      message: 'Birth declaration #BD123 validated',
      time: '3 hours ago',
      read: false
    },
    {
      id: 3,
      message: 'Death declaration #DD456 requires review',
      time: '1 day ago',
      read: true
    }
  ];

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={toggleNotifications}
            className="text-gray-500 hover:text-gray-700 focus:outline-none relative"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {notifications.filter(n => !n.read).length}
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-sm font-semibold">Notifications</h3>
                <button 
                  onClick={toggleNotifications}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${
                        notification.read ? 'bg-white' : 'bg-blue-50'
                      }`}
                    >
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    No notifications
                  </div>
                )}
              </div>
              <div className="p-2 text-center border-t border-gray-100">
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;