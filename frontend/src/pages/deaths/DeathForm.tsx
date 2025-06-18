// src/pages/deaths/DeathForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import { deathService } from '../../services/deathService';
import { Parent, DeathDeclaration } from '../../types';

const DeathForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('father');
  const [error, setError] = useState<string | null>(null);

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

  const [deathInfo, setDeathInfo] = useState({
    descriptionMort: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const declarationData: Partial<DeathDeclaration> = {
        pere: fatherInfo,
        mere: motherInfo,
        descriptionMort: deathInfo.descriptionMort,
      };

      await deathService.create(declarationData);
      navigate('/app/deaths');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      const errorMessage = error instanceof Error && 'response' in error && 
        typeof error.response === 'object' && error.response !== null &&
        'data' in error.response && typeof error.response.data === 'object' &&
        error.response.data !== null && 'message' in error.response.data
        ? String(error.response.data.message)
        : 'Erreur lors de la soumission de la déclaration.';
      
      setError(errorMessage);
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
          onClick={() => navigate('/app/deaths')}
          className="mr-4"
        >
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvelle Déclaration de Décès</h1>
          <p className="text-gray-600">Remplissez les détails pour enregistrer une nouvelle déclaration de décès</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['father', 'mother', 'death'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'father' ? 'Informations du Père' : 
                 tab === 'mother' ? 'Informations de la Mère' : 
                 'Détails du Décès'}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {activeTab === 'father' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="fatherPrenom" className="block text-sm font-medium text-gray-700">
                      Prénom (optionnel)
                    </label>
                    <input
                      type="text"
                      id="fatherPrenom"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={fatherInfo.prenom}
                      onChange={(e) => setFatherInfo({ ...fatherInfo, prenom: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="fatherNom" className="block text-sm font-medium text-gray-700">
                      Nom de famille (optionnel)
                    </label>
                    <input
                      type="text"
                      id="fatherNom"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={fatherInfo.nom}
                      onChange={(e) => setFatherInfo({ ...fatherInfo, nom: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="fatherCarteIdentite" className="block text-sm font-medium text-gray-700">
                      Numéro d'identité (optionnel)
                    </label>
                    <input
                      type="text"
                      id="fatherCarteIdentite"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={fatherInfo.carteIdentite}
                      onChange={(e) => setFatherInfo({ ...fatherInfo, carteIdentite: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="fatherTelephone" className="block text-sm font-medium text-gray-700">
                      Numéro de téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      id="fatherTelephone"
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
                <div className="flex justify-end">
                  <Button type="button" variant="primary" onClick={() => setActiveTab('mother')}>
                    Suivant: Informations de la Mère
                  </Button>
                </div>
              </div>
            )}
            {activeTab === 'mother' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="motherPrenom" className="block text-sm font-medium text-gray-700">
                      Prénom (optionnel)
                    </label>
                    <input
                      type="text"
                      id="motherPrenom"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={motherInfo.prenom}
                      onChange={(e) => setMotherInfo({ ...motherInfo, prenom: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="motherNom" className="block text-sm font-medium text-gray-700">
                      Nom de famille (optionnel)
                    </label>
                    <input
                      type="text"
                      id="motherNom"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={motherInfo.nom}
                      onChange={(e) => setMotherInfo({ ...motherInfo, nom: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="motherCarteIdentite" className="block text-sm font-medium text-gray-700">
                      Numéro d'identité (optionnel)
                    </label>
                    <input
                      type="text"
                      id="motherCarteIdentite"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={motherInfo.carteIdentite}
                      onChange={(e) => setMotherInfo({ ...motherInfo, carteIdentite: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="motherTelephone" className="block text-sm font-medium text-gray-700">
                      Numéro de téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      id="motherTelephone"
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
                    Précédent: Informations du Père
                  </Button>
                  <Button type="button" variant="primary" onClick={() => setActiveTab('death')}>
                    Suivant: Détails du Décès
                  </Button>
                </div>
              </div>
            )}
            {activeTab === 'death' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="descriptionMort" className="block text-sm font-medium text-gray-700">
                      Cause du décès
                    </label>
                    <textarea
                      id="descriptionMort"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={deathInfo.descriptionMort}
                      onChange={(e) => setDeathInfo({ ...deathInfo, descriptionMort: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Résumé</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Informations du Père</h4>
                      <p><span className="font-medium">Nom:</span> {fatherInfo.prenom || 'N/A'} {fatherInfo.nom || ''}</p>
                      <p><span className="font-medium">ID:</span> {fatherInfo.carteIdentite || 'N/A'}</p>
                      <p><span className="font-medium">Contact:</span> {fatherInfo.telephone || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Informations de la Mère</h4>
                      <p><span className="font-medium">Nom:</span> {motherInfo.prenom || 'N/A'} {motherInfo.nom || ''}</p>
                      <p><span className="font-medium">ID:</span> {motherInfo.carteIdentite || 'N/A'}</p>
                      <p><span className="font-medium">Contact:</span> {motherInfo.telephone || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Détails du Décès</h4>
                      <p><span className="font-medium">Cause:</span> {deathInfo.descriptionMort || 'Non fourni'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('mother')}>
                    Précédent: Informations de la Mère
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={<Save size={16} />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Soumission en cours...' : 'Soumettre la Déclaration'}
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

export default DeathForm;