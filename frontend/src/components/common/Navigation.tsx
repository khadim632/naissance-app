import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Baby, 
  HeartPulse, 
  CheckCircle, 
  Users, 
  BarChart3,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { authState } = useAuth();
  const { user } = authState;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
      isActive
        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  // Navigation items avec préfixe /app pour tous les liens
  const navigationItems = [
    // Dashboard - accessible à tous
    {
      name: 'Dashboard',
      href: '/app/dashboard',
      icon: Home,
      roles: ['hopital', 'mairie', 'admin', 'superadmin']
    },
    
    // Statistiques - accessible à tous
    {
      name: 'Statistiques',
      href: '/app/statistics',
      icon: BarChart3,
      roles: ['hopital', 'mairie', 'admin', 'superadmin']
    },

    // Routes spécifiques aux hôpitaux
    {
      name: 'Déclarations de Naissance',
      href: '/app/births',
      icon: Baby,
      roles: ['hopital']
    },
    {
      name: 'Nouvelle Naissance',
      href: '/app/births/new',
      icon: PlusCircle,
      roles: ['hopital']
    },
    {
      name: 'Déclarations de Décès',
      href: '/app/deaths',
      icon: HeartPulse,
      roles: ['hopital']
    },
    {
      name: 'Nouveau Décès',
      href: '/app/deaths/new',
      icon: PlusCircle,
      roles: ['hopital']
    },

    // Routes spécifiques aux mairies
    {
      name: 'Validations',
      href: '/app/validations',
      icon: CheckCircle,
      roles: ['mairie']
    },

    // Routes admin/superadmin
    {
      name: 'Gestion Utilisateurs',
      href: '/app/users',
      icon: Users,
      roles: ['admin', 'superadmin']
    }
  ];

  // Filtrer les éléments de navigation selon le rôle de l'utilisateur
  const allowedItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <nav className="mt-5 px-2">
      <div className="space-y-1">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={navLinkClass}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;