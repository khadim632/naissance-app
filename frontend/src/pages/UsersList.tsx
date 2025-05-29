import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2,
  AlertCircle 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import userService, { UserResponse, CreateUserData } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

type UserRole = 'hopital' | 'mairie' | 'admin' | 'superadmin';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: CreateUserData) => Promise<void>;
  user?: UserResponse | null;
  isEditing?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user, isEditing = false }) => {
  const [formData, setFormData] = useState<CreateUserData>({
    nom: '',
    email: '',
    motDePasse: '',
    role: 'hopital'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        nom: user.nom,
        email: user.email,
        motDePasse: '',
        role: user.role as UserRole
      });
    } else {
      setFormData({
        nom: '',
        email: '',
        motDePasse: '',
        role: 'hopital'
      });
    }
  }, [user, isEditing]);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.email || (!isEditing && !formData.motDePasse)) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch {
      // L'erreur est déjà gérée dans le composant parent
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isEditing ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe *'}
            </label>
            <input
              type="password"
              value={formData.motDePasse}
              onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!isEditing}
              placeholder={isEditing ? 'Laisser vide pour conserver le mot de passe actuel' : ''}
            />
            {!isEditing && (
              <p className="text-xs text-gray-500 mt-1">
                Minimum 8 caractères, 1 majuscule et 1 chiffre
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="hopital">Hôpital</option>
              <option value="mairie">Mairie</option>
              <option value="admin">Administrateur</option>
              <option value="superadmin">Super Administrateur</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Enregistrement...' : (isEditing ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UsersList: React.FC = () => {
  const { authState } = useAuth();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Filtrage par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par rôle
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await userService.createUser(userData);
      toast.success('Utilisateur créé avec succès');
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création');
      throw error;
    }
  };

  const handleEditUser = async (userData: CreateUserData) => {
    if (!selectedUser) return;
    
    try {
      // Ne pas envoyer le mot de passe s'il est vide
      const updateData: Partial<CreateUserData> = {
        nom: userData.nom,
        email: userData.email,
        role: userData.role
      };
      
      if (userData.motDePasse) {
        updateData.motDePasse = userData.motDePasse;
      }

      await userService.updateUser(selectedUser._id, updateData);
      toast.success('Utilisateur modifié avec succès');
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la modification');
      throw error;
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`)) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      toast.success('Utilisateur supprimé avec succès');
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    }
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserResponse) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'mairie': return 'bg-green-100 text-green-800';
      case 'hopital': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin': return 'Super Admin';
      case 'admin': return 'Administrateur';
      case 'mairie': return 'Mairie';
      case 'hopital': return 'Hôpital';
      default: return role;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Users className="mr-3" size={28} />
            Gestion des utilisateurs
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les comptes utilisateurs du système
          </p>
        </div>
        
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <UserPlus size={18} className="mr-2" />
          Nouvel utilisateur
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Tous les rôles</option>
              <option value="hopital">Hôpital</option>
              <option value="mairie">Mairie</option>
              <option value="admin">Administrateur</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {user.nom.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.nom}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Modifier"
                      >
                        <Edit3 size={16} />
                      </button>
                      {user._id !== authState.user?._id && (
                        <button
                          onClick={() => handleDeleteUser(user._id, user.nom)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          <div className="text-sm text-gray-500">Total utilisateurs</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.role === 'hopital').length}
          </div>
          <div className="text-sm text-gray-500">Hôpitaux</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.role === 'mairie').length}
          </div>
          <div className="text-sm text-gray-500">Mairies</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-red-600">
            {users.filter(u => u.role === 'admin' || u.role === 'superadmin').length}
          </div>
          <div className="text-sm text-gray-500">Administrateurs</div>
        </div>
      </div>

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={isEditing ? handleEditUser : handleCreateUser}
        user={selectedUser}
        isEditing={isEditing}
      />
    </div>
  );
};

export default UsersList;