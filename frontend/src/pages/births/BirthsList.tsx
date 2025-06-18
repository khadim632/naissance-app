import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Download } from 'lucide-react';
import { BirthDeclaration, DeclarationStatus } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { birthService } from '../../services/birthService';

const BirthsList: React.FC = () => {
  const [birthDeclarations, setBirthDeclarations] = useState<BirthDeclaration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeclarationStatus | 'all'>('all');

  useEffect(() => {
    const fetchBirthDeclarations = async () => {
      setIsLoading(true);
      try {
        const response = await birthService.getAll();
        setBirthDeclarations(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching birth declarations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBirthDeclarations();
  }, []);

  const filteredDeclarations = birthDeclarations.filter((declaration) => {
    const matchesSearch =
      declaration.prenomBebe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.nomBebe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.mairieDestinataire.nom.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || declaration.statutValidation === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    alert('Export functionality will be implemented with backend integration');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Déclarations de Naissance</h1>
          <p className="text-gray-600">Gérer et suivre toutes les déclarations de naissance</p>
        </div>
        <div className="mt-4 md:mt-0">
          {/* CORRECTION: Changement du lien de /births/new vers /app/births/new */}
          <Link to="/app/births/new">
            <Button variant="primary" icon={<Plus size={16} />}>
              Nouvelle Déclaration
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom, ID, ou municipalité..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0 flex space-x-3">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as DeclarationStatus | 'all')}
              >
                <option value="all">Tous les statuts</option>
                <option value={DeclarationStatus.en_attente}>En attente</option>
                <option value={DeclarationStatus.validée}>Validée</option>
                <option value={DeclarationStatus.refusée}>Rejetée</option>
              </select>
              <Button variant="outline" icon={<Download size={16} />} onClick={handleExport}>
                Exporter
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nom de l'enfant
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date de naissance
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Municipalité
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date de déclaration
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeclarations.map((declaration) => (
                <tr key={declaration._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {declaration._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {declaration.prenomBebe} {declaration.nomBebe}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(declaration.dateNaissance).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {declaration.mairieDestinataire.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={declaration.statutValidation} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(declaration.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* CORRECTION: Changement du lien de /births/${declaration._id} vers /app/births/${declaration._id} */}
                    <Link to={`/app/births/${declaration._id}`} className="text-blue-600 hover:text-blue-900">
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDeclarations.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 text-sm">
                Aucune déclaration de naissance trouvée correspondant à vos critères.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BirthsList;