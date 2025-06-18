// src/pages/deaths/DeathsList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deathService } from '../../services/deathService';
import { DeathDeclaration } from '../../types';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button';

const DeathsList: React.FC = () => {
  const navigate = useNavigate();
  const [declarations, setDeclarations] = useState<DeathDeclaration[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeclarations = async () => {
      try {
        const response = await deathService.getAll();
        setDeclarations(response.data?.data || []);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error && 'response' in err 
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Erreur lors du chargement des déclarations.';
        setError(errorMessage || 'Erreur lors du chargement des déclarations.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeclarations();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Death Declarations</h1>
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate('/app/deaths/new')}
        >
          New Declaration
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cause
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {declarations.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  Aucune déclaration de décès trouvée.
                </td>
              </tr>
            ) : (
              declarations.map((declaration) => (
                <tr key={declaration._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {declaration.pere?.prenom || declaration.mere?.prenom ? (
                      `${declaration.pere?.prenom || ''} ${declaration.pere?.nom || ''} / ${declaration.mere?.prenom || ''} ${declaration.mere?.nom || ''}`
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {declaration.descriptionMort || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(declaration.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeathsList;