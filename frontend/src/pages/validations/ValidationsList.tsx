import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Check, X, Eye } from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

// Types alignés avec le backend
interface PreDeclarationNaissance {
  _id: string;
  nomBebe: string;
  prenomBebe: string;
  sexe: 'male' | 'female';
  dateNaissance: string;
  lieuNaissance: string;
  heureNaissance: string;
  pere: {
    nom: string;
    prenom: string;
    profession: string;
    adresse: string;
    email?: string;
  };
  mere: {
    nom: string;
    prenom: string;
    profession: string;
    adresse: string;
    email?: string;
  };
  mairieDestinataire: {
    _id: string;
    nom: string;
    email: string;
  };
  createdBy: string;
  hopitalNom: string;
  hopitalEmail: string;
  statutValidation: 'en attente' | 'validée' | 'refusée';
  commentaireValidation?: string;
  createdAt: string;
  updatedAt: string;
}

interface PreDeclarationDeces {
  _id: string;
  nomDefunt: string;
  prenomDefunt: string;
  dateNaissanceDefunt: string;
  dateDeces: string;
  heureDeces: string;
  lieuDeces: string;
  causeDeces: string;
  descriptionMort: string;
  pere: {
    nom: string;
    prenom: string;
    email?: string;
  };
  mere: {
    nom: string;
    prenom: string;
    email?: string;
  };
  createdBy: string;
  hopitalNom: string;
  hopitalEmail: string;
  status: 'en attente' | 'validée' | 'refusée';
  commentaireValidation?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface pour les erreurs API
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

type DeclarationType = 'birth' | 'death';

const ValidationsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DeclarationType>('birth');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [birthDeclarations, setBirthDeclarations] = useState<PreDeclarationNaissance[]>([]);
  const [deathDeclarations, setDeathDeclarations] = useState<PreDeclarationDeces[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDeclarationId, setSelectedDeclarationId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<DeclarationType | null>(null);
  const [actionType, setActionType] = useState<'validate' | 'reject' | null>(null);
  const [comment, setComment] = useState('');

  // Fonction pour récupérer les pré-déclarations depuis l'API
  const fetchDeclarations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const birthResponse = await api.get('/predeclarations/predeclarations/mairie');
      setBirthDeclarations(birthResponse.data);

      // TODO: Ajouter l'endpoint pour les décès si nécessaire
      // const deathResponse = await api.get('/predeclarations/mairie/deces');
      setDeathDeclarations([]); // Temporairement vide
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Erreur lors de la récupération des déclarations:', apiError);
      setError(apiError.response?.data?.message || apiError.message || 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeclarations();
  }, []);

  // Filtrage des déclarations
  const filteredBirthDeclarations = birthDeclarations.filter(
    declaration =>
      declaration.prenomBebe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.nomBebe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.hopitalNom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeathDeclarations = deathDeclarations.filter(
    declaration =>
      declaration.prenomDefunt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.nomDefunt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.hopitalNom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ouvrir le modal pour validation ou rejet
  const openModal = (type: DeclarationType, id: string, action: 'validate' | 'reject') => {
    setSelectedDeclarationId(id);
    setSelectedType(type);
    setActionType(action);
    setComment('');
    setShowModal(true);
  };

  // Fermer le modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedDeclarationId(null);
    setSelectedType(null);
    setActionType(null);
    setComment('');
  };

  // Fonction pour valider ou rejeter une pré-déclaration
  const handleValidationAction = async () => {
    if (!selectedDeclarationId || !selectedType || !actionType) return;

    try {
      const statutValidation = actionType === 'validate' ? 'validée' : 'refusée';
      await api.put(`/predeclarations/naissance/${selectedDeclarationId}/validation`, {
        statutValidation,
        commentaire: comment || (actionType === 'reject' ? 'Déclaration refusée' : '')
      });

      // Mettre à jour l'état local
      if (selectedType === 'birth') {
        setBirthDeclarations(prevDeclarations =>
          prevDeclarations.map(declaration =>
            declaration._id === selectedDeclarationId
              ? { ...declaration, statutValidation, commentaireValidation: comment || declaration.commentaireValidation }
              : declaration
          )
        );
      }

      toast.success(`Déclaration ${statutValidation} avec succès`);
      closeModal();
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Erreur lors de l'action ${actionType}:`, apiError);
      const errorMessage = apiError.response?.data?.message || apiError.message || `Erreur lors de l'action ${actionType}`;
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en attente':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">En attente</span>;
      case 'validée':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Validée</span>;
      case 'refusée':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Refusée</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inconnu</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                onClick={fetchDeclarations}
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Validations des Pré-déclarations</h1>
        <p className="text-gray-600">Examiner et valider les pré-déclarations des hôpitaux</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'birth'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('birth')}
            >
              Pré-déclarations de Naissance ({filteredBirthDeclarations.length})
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'death'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('death')}
            >
              Pré-déclarations de Décès ({filteredDeathDeclarations.length})
            </button>
          </nav>
        </div>

        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom, ID, ou hôpital..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={fetchDeclarations}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Actualiser
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'birth' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom de l'Enfant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Heure Naissance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parents
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hôpital
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de Création
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBirthDeclarations.map((declaration) => (
                  <tr key={declaration._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link to={`/validations/birth/${declaration._id}`} className="text-blue-600 hover:text-blue-800">
                        {declaration._id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {declaration.prenomBebe} {declaration.nomBebe}
                      </div>
                      <div className="text-sm text-gray-500">
                        {declaration.sexe === 'male' ? 'Garçon' : 'Fille'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{declaration.dateNaissance}</div>
                      <div className="text-sm text-gray-500">{declaration.heureNaissance}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Père: {declaration.pere.prenom} {declaration.pere.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        Mère: {declaration.mere.prenom} {declaration.mere.nom}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{declaration.hopitalNom}</div>
                      <div className="text-sm text-gray-500">{declaration.hopitalEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(declaration.statutValidation)}
                      {declaration.commentaireValidation && (
                        <div className="text-xs text-gray-500 mt-1">
                          {declaration.commentaireValidation}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(declaration.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <Link
                          to={`/validations/birth/${declaration._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye size={16} />
                        </Link>
                        {declaration.statutValidation === 'en attente' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              icon={<Check size={16} />}
                              onClick={() => openModal('birth', declaration._id, 'validate')}
                            >
                              Valider
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              icon={<X size={16} />}
                              onClick={() => openModal('birth', declaration._id, 'reject')}
                            >
                              Rejeter
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom du Défunt
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de Décès
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hôpital
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de Création
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeathDeclarations.map((declaration) => (
                  <tr key={declaration._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link to={`/validations/death/${declaration._id}`} className="text-blue-600 hover:text-blue-800">
                        {declaration._id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {declaration.prenomDefunt} {declaration.nomDefunt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {declaration.dateDeces}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {declaration.hopitalNom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(declaration.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(declaration.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {declaration.status === 'en attente' && (
                        <div className="flex space-x-2 justify-end">
                          <Button
                            variant="success"
                            size="sm"
                            icon={<Check size={16} />}
                            onClick={() => openModal('death', declaration._id, 'validate')}
                          >
                            Valider
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<X size={16} />}
                            onClick={() => openModal('death', declaration._id, 'reject')}
                          >
                            Rejeter
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {((activeTab === 'birth' && filteredBirthDeclarations.length === 0) ||
            (activeTab === 'death' && filteredDeathDeclarations.length === 0)) && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 text-sm">
                {searchTerm
                  ? 'Aucune pré-déclaration trouvée correspondant à vos critères.'
                  : 'Aucune pré-déclaration en attente de validation.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal pour commentaire de validation/rejet */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {actionType === 'validate' ? 'Valider la déclaration' : 'Rejeter la déclaration'}
            </h3>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Commentaire {actionType === 'reject' ? '(requis)' : '(optionnel)'}
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder={actionType === 'reject' ? 'Veuillez indiquer la raison du rejet' : 'Ajouter un commentaire (facultatif)'}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={closeModal}
              >
                Annuler
              </Button>
              <Button
                variant={actionType === 'validate' ? 'success' : 'danger'}
                size="sm"
                onClick={handleValidationAction}
                disabled={actionType === 'reject' && !comment.trim()}
              >
                {actionType === 'validate' ? 'Confirmer la validation' : 'Confirmer le rejet'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationsList;