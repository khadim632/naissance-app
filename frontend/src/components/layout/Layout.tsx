// Dans Layout.tsx
import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Users, 
  Baby, 
  HeartPulse, 
  CheckSquare, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  Home,
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

const Layout: React.FC = () => {
  const { authState, logout } = useAuth();
  const { user } = authState;
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const notifications = [
    {
      id: 1,
      message: 'Nouvelle déclaration de naissance reçue',
      time: '1 heure',
      read: false
    },
    {
      id: 2,
      message: 'Déclaration de naissance #BD123 validée',
      time: '3 heures',
      read: false
    },
    {
      id: 3,
      message: 'Déclaration de décès #DD456 nécessite une révision',
      time: '1 jour',
      read: true
    }
  ];

  // CORRECTION : Ajout du préfixe /app pour tous les liens
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/app/dashboard', // Corrigé : ajout de /app
      icon: Home,
      roles: [UserRole.hopital, UserRole.mairie, UserRole.admin, UserRole.superadmin]
    },
    {
      name: 'Statistiques',
      href: '/app/statistics', // Corrigé : ajout de /app
      icon: BarChart3,
      roles: [UserRole.hopital, UserRole.mairie, UserRole.admin, UserRole.superadmin]
    },
    {
      name: 'Déclarations de naissance',
      href: '/app/births', // Corrigé : ajout de /app
      icon: Baby,
      roles: [UserRole.hopital]
    },
    {
      name: 'Déclarations de décès',
      href: '/app/deaths', // Corrigé : ajout de /app
      icon: HeartPulse,
      roles: [UserRole.hopital]
    },
    {
      name: 'Validations',
      href: '/app/validations', // Corrigé : ajout de /app
      icon: CheckSquare,
      roles: [UserRole.mairie]
    },
    {
      name: 'Gestion des utilisateurs',
      href: '/app/users', // Corrigé : ajout de /app
      icon: Users,
      roles: [UserRole.admin, UserRole.superadmin]
    }
  ];

  const visibleItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center h-16 px-4 bg-blue-700">
        <h1 className="text-xl font-bold text-white">DeclaraSen</h1>
      </div>
      <div className="px-4 py-2 bg-blue-600">
        <p className="text-xs text-blue-200">{user?.organization}</p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActiveLink = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                isActiveLink
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} className="mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-blue-700">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-blue-200 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-blue-100 rounded-lg hover:bg-blue-700 hover:text-white transition-colors"
        >
          <LogOut size={18} className="mr-3" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 bg-blue-600">
          <SidebarContent />
        </div>
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-64 h-full bg-blue-600">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 ml-4 lg:hidden">DeclaraSen</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
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
                      onClick={() => setShowNotifications(false)}
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
                          <p className="text-xs text-gray-500 mt-1">Il y a {notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500 text-sm">
                        Aucune notification
                      </div>
                    )}
                  </div>
                  <div className="p-2 text-center border-t border-gray-100">
                    <button className="text-xs text-blue-600 hover:text-blue-800">
                      Marquer tout comme lu
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;