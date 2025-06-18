// BirthForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import { birthService } from '../../services/birthService';
import { User, Parent, ApiResponse } from '../../types';
import api from '../../services/api';

interface Municipality {
  _id: string;
  nom: string;
  email: string;
}

interface UserWithNom extends User {
  nom?: string;
}

// Interface pour les données à envoyer au service
interface BirthDeclarationCreateData {
  nomBebe: string;
  prenomBebe: string;
  dateNaissance: string; // Non optionnel
  heureNaissance: string; // Non optionnel
  lieuNaissance: string; // Non optionnel
  sexe: 'masculin' | 'féminin';
  pere: Parent;
  mere: Parent;
  mairieDestinataire: Municipality;
}

const BirthForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('child');
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [childInfo, setChildInfo] = useState({
    prenomBebe: '',
    nomBebe: '',
    dateNaissance: '',
    heureNaissance: '',
    lieuNaissance: '',
    sexe: 'masculin' as 'masculin' | 'féminin',
  });

  const [fatherInfo, setFatherInfo] = useState<Parent>({
    prenom: '',
    nom: '',
    carteIdentite: '',
    telephone: '',
    email: '',
  });

  const [motherInfo, setMotherInfo] = useState<Parent>({
    prenom: '',
    nom: '',
    carteIdentite: '',
    telephone: '',
    email: '',
  });

  const [declarationInfo, setDeclarationInfo] = useState({
    mairieDestinataire: '',
  });

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const response = await api.get<ApiResponse<UserWithNom[]>>('/users', {
          params: { role: 'mairie' },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const municipalitiesData = response.data?.data?.map((user) => ({
          _id: user._id,
          nom: user.nom || `Mairie sans nom (${user.email})`,
          email: user.email,
        })) || [];
        setMunicipalities(municipalitiesData);
        if (municipalitiesData.length === 0) {
          setError('Aucune mairie trouvée dans la base de données.');
        }
      } catch (error: unknown) {
        console.error('Erreur lors de la récupération des mairies:', error);
        const errorMessage = error instanceof Error && 'response' in error 
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Erreur lors du chargement des mairies.';
        setError(errorMessage || 'Erreur lors du chargement des mairies.');
      }
    };

    fetchMunicipalities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validation côté client
      if (!childInfo.dateNaissance || !childInfo.lieuNaissance || !childInfo.heureNaissance) {
        setError('Les champs date, lieu et heure de naissance sont obligatoires.');
        setIsSubmitting(false);
        return;
      }
      if (!['masculin', 'féminin'].includes(childInfo.sexe)) {
        setError('Le sexe doit être "masculin" ou "féminin".');
        setIsSubmitting(false);
        return;
      }

      // Trouver la municipalité sélectionnée - CORRECTION ICI
      const selectedMunicipality = municipalities.find(
        (m) => m._id === declarationInfo.mairieDestinataire
      );

      if (!selectedMunicipality) {
        setError('Veuillez sélectionner une mairie.');
        setIsSubmitting(false);
        return;
      }

      // Créer l'objet de données avec le bon typage
      const createData: BirthDeclarationCreateData = {
        nomBebe: childInfo.nomBebe,
        prenomBebe: childInfo.prenomBebe,
        dateNaissance: childInfo.dateNaissance,
        heureNaissance: childInfo.heureNaissance,
        lieuNaissance: childInfo.lieuNaissance,
        sexe: childInfo.sexe,
        pere: fatherInfo,
        mere: motherInfo,
        mairieDestinataire: selectedMunicipality,
      };

      await birthService.create(createData);
      navigate('/app/births');
    } catch (error: unknown) {
      console.error('Erreur lors de la soumission:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Erreur lors de la soumission de la déclaration.';
      setError(errorMessage || 'Erreur lors de la soumission de la déclaration.');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/app/births')}
          className="mr-4"
        >
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvelle Déclaration de Naissance</h1>
          <p className="text-gray-600">Remplissez les détails pour enregistrer une nouvelle naissance</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['child', 'father', 'mother', 'declaration'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'child' && 'Informations de l\'enfant'}
                {tab === 'father' && 'Informations du père'}
                {tab === 'mother' && 'Informations de la mère'}
                {tab === 'declaration' && 'Détails de la déclaration'}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {activeTab === 'child' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="prenomBebe" className="block text-sm font-medium text-gray-700">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="prenomBebe"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={childInfo.prenomBebe}
                      onChange={(e) => setChildInfo({ ...childInfo, prenomBebe: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="nomBebe" className="block text-sm font-medium text-gray-700">
                      Nom de famille
                    </label>
                    <input
                      type="text"
                      id="nomBebe"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={childInfo.nomBebe}
                      onChange={(e) => setChildInfo({ ...childInfo, nomBebe: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      id="dateNaissance"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={childInfo.dateNaissance}
                      onChange={(e) => setChildInfo({ ...childInfo, dateNaissance: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="heureNaissance" className="block text-sm font-medium text-gray-700">
                      Heure de naissance
                    </label>
                    <input
                      type="time"
                      id="heureNaissance"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={childInfo.heureNaissance}
                      onChange={(e) => setChildInfo({ ...childInfo, heureNaissance: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label htmlFor="lieuNaissance" className="block text-sm font-medium text-gray-700">
                      Lieu de naissance
                    </label>
                    <input
                      type="text"
                      id="lieuNaissance"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={childInfo.lieuNaissance}
                      onChange={(e) => setChildInfo({ ...childInfo, lieuNaissance: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Sexe</label>
                    <div className="mt-2 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                      <div className="flex items-center">
                        <input
                          id="masculin"
                          name="sexe"
                          type="radio"
                          checked={childInfo.sexe === 'masculin'}
                          onChange={() => setChildInfo({ ...childInfo, sexe: 'masculin' })}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor="masculin" className="ml-3 block text-sm font-medium text-gray-700">
                          Masculin
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="féminin"
                          name="sexe"
                          type="radio"
                          checked={childInfo.sexe === 'féminin'}
                          onChange={() => setChildInfo({ ...childInfo, sexe: 'féminin' })}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor="féminin" className="ml-3 block text-sm font-medium text-gray-700">
                          Féminin
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="button" variant="primary" onClick={() => setActiveTab('father')}>
                    Suivant: Informations du père
                  </Button>
                </div>
              </div>
            )}
            {activeTab === 'father' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="fatherPrenom" className="block text-sm font-medium text-gray-700">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="fatherPrenom"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={fatherInfo.prenom}
                      onChange={(e) => setFatherInfo({ ...fatherInfo, prenom: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="fatherNom" className="block text-sm font-medium text-gray-700">
                      Nom de famille
                    </label>
                    <input
                      type="text"
                      id="fatherNom"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={fatherInfo.nom}
                      onChange={(e) => setFatherInfo({ ...fatherInfo, nom: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="fatherCarteIdentite" className="block text-sm font-medium text-gray-700">
                      Numéro de carte d'identité
                    </label>
                    <input
                      type="text"
                      id="fatherCarteIdentite"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={fatherInfo.carteIdentite}
                      onChange={(e) => setFatherInfo({ ...fatherInfo, carteIdentite: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="fatherTelephone" className="block text-sm font-medium text-gray-700">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      id="fatherTelephone"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={fatherInfo.telephone}
                      onChange={(e) => setFatherInfo({ ...fatherInfo, telephone: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label htmlFor="fatherEmail" className="block text-sm font-medium text-gray-700">
                      Email (optionnel)
                    </label>
                    <input
                      type="email"
                      id="fatherEmail"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={fatherInfo.email || ''}
                      onChange={(e) => setFatherInfo({ ...fatherInfo, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('child')}>
                    Précédent: Informations de l'enfant
                  </Button>
                  <Button type="button" variant="primary" onClick={() => setActiveTab('mother')}>
                    Suivant: Informations de la mère
                  </Button>
                </div>
              </div>
            )}
            {activeTab === 'mother' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="motherPrenom" className="block text-sm font-medium text-gray-700">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="motherPrenom"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={motherInfo.prenom}
                      onChange={(e) => setMotherInfo({ ...motherInfo, prenom: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="motherNom" className="block text-sm font-medium text-gray-700">
                      Nom de famille
                    </label>
                    <input
                      type="text"
                      id="motherNom"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={motherInfo.nom}
                      onChange={(e) => setMotherInfo({ ...motherInfo, nom: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="motherCarteIdentite" className="block text-sm font-medium text-gray-700">
                      Numéro de carte d'identité
                    </label>
                    <input
                      type="text"
                      id="motherCarteIdentite"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={motherInfo.carteIdentite}
                      onChange={(e) => setMotherInfo({ ...motherInfo, carteIdentite: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="motherTelephone" className="block text-sm font-medium text-gray-700">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      id="motherTelephone"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={motherInfo.telephone}
                      onChange={(e) => setMotherInfo({ ...motherInfo, telephone: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label htmlFor="motherEmail" className="block text-sm font-medium text-gray-700">
                      Email (optionnel)
                    </label>
                    <input
                      type="email"
                      id="motherEmail"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={motherInfo.email || ''}
                      onChange={(e) => setMotherInfo({ ...motherInfo, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('father')}>
                    Précédent: Informations du père
                  </Button>
                  <Button type="button" variant="primary" onClick={() => setActiveTab('declaration')}>
                    Suivant: Détails de la déclaration
                  </Button>
                </div>
              </div>
            )}
            {activeTab === 'declaration' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="mairieDestinataire" className="block text-sm font-medium text-gray-700">
                      Municipalité destinataire
                    </label>
                    <select
                      id="mairieDestinataire"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={declarationInfo.mairieDestinataire}
                      onChange={(e) =>
                        setDeclarationInfo({ ...declarationInfo, mairieDestinataire: e.target.value })
                      }
                    >
                      <option value="">Sélectionner une municipalité</option>
                      {municipalities.map((municipality) => (
                        <option key={municipality._id} value={municipality._id}>
                          {municipality.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Résumé</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Informations de l'enfant</h4>
                      <p><span className="font-medium">Nom:</span> {childInfo.prenomBebe} {childInfo.nomBebe}</p>
                      <p><span className="font-medium">Naissance:</span> {childInfo.dateNaissance} à {childInfo.heureNaissance}</p>
                      <p><span className="font-medium">Sexe:</span> {childInfo.sexe === 'masculin' ? 'Masculin' : 'Féminin'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Informations du père</h4>
                      <p><span className="font-medium">Nom:</span> {fatherInfo.prenom} {fatherInfo.nom}</p>
                      <p><span className="font-medium">ID:</span> {fatherInfo.carteIdentite}</p>
                      <p><span className="font-medium">Contact:</span> {fatherInfo.telephone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Informations de la mère</h4>
                      <p><span className="font-medium">Nom:</span> {motherInfo.prenom} {motherInfo.nom}</p>
                      <p><span className="font-medium">ID:</span> {motherInfo.carteIdentite}</p>
                      <p><span className="font-medium">Contact:</span> {motherInfo.telephone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Détails de la déclaration</h4>
                      <p><span className="font-medium">Municipalité:</span> {municipalities.find((m) => m._id === declarationInfo.mairieDestinataire)?.nom || 'Non sélectionnée'}</p>
                      <p><span className="font-medium">Statut:</span> Brouillon (En attente de soumission)</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('mother')}>
                    Précédent: Informations de la mère
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={<Save size={16} />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Soumission...' : 'Soumettre la déclaration'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BirthForm;