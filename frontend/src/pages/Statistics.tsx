import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, Baby, HeartPulse, Clock, CheckCircle, XCircle, RefreshCw, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { statsService } from '../services/statsService';
import { 
  UserRole, 
  HospitalStats, 
  MunicipalityStats, 
  GlobalStats, 
  AdminHospitalStats 
} from '../types';
import StatsCard from '../components/common/StatsCard';
import Button from '../components/common/Button';

// Interface pour typer les erreurs d'API
interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
    headers?: Record<string, string>;
  };
  message?: string;
}

const Statistics: React.FC = () => {
  const { authState } = useAuth();
  const { user } = authState;
  
  // ✅ États typés correctement selon le rôle
  const [hospitalStats, setHospitalStats] = useState<HospitalStats | null>(null);
  const [municipalityStats, setMunicipalityStats] = useState<MunicipalityStats | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [adminHospitalStats, setAdminHospitalStats] = useState<AdminHospitalStats[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = useCallback(async () => {
    console.log('🔄 Chargement des statistiques pour le rôle:', user?.role);
    setIsLoading(true);
    setError(null);
    
    try {
      if (user?.role === UserRole.hopital) {
        console.log('📊 Chargement des stats hôpital...');
        const response = await statsService.getHospitalStats();
        console.log('✅ Stats hôpital reçues:', response.data);
        setHospitalStats(response.data);
      } 
      else if (user?.role === UserRole.mairie) {
        console.log('📊 Chargement des stats mairie...');
        const response = await statsService.getMunicipalityStats();
        console.log('✅ Stats mairie reçues:', response.data);
        setMunicipalityStats(response.data);
      } 
      else if (user?.role === UserRole.admin || user?.role === UserRole.superadmin) {
        console.log('📊 Chargement des stats admin...');
        const [globalResponse, hospitalResponse] = await Promise.all([
          statsService.getGlobalStats(),
          statsService.getHospitalDetailedStats()
        ]);
        
        console.log('✅ Stats globales reçues:', globalResponse.data);
        console.log('✅ Stats détaillées hôpitaux reçues:', hospitalResponse.data);
        
        setGlobalStats(globalResponse.data);
        setAdminHospitalStats(hospitalResponse.data);
      }
    } catch (error) {
      // ✅ Type assertion plus sûre avec vérification
      const apiError = error as ApiError;
      
      console.error('❌ Erreur lors du chargement des statistiques:', error);
      console.error('❌ Response data:', apiError.response?.data);
      console.error('❌ Status:', apiError.response?.status);
      console.error('❌ Headers:', apiError.response?.headers);
      
      let errorMessage = 'Erreur lors du chargement des statistiques';
      
      if (apiError.response?.status === 401) {
        errorMessage = 'Non autorisé - Veuillez vous reconnecter';
      } else if (apiError.response?.status === 403) {
        errorMessage = 'Accès interdit - Permissions insuffisantes';
      } else if (apiError.response?.status === 404) {
        errorMessage = 'Endpoint non trouvé - Vérifiez la configuration';
      } else if (apiError.response?.status && apiError.response.status >= 500) {
        errorMessage = 'Erreur serveur - Contactez l\'administrateur';
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    if (user) {
      console.log('👤 Utilisateur connecté:', { role: user.role, org: user.organization });
      loadStatistics();
    } else {
      console.log('❌ Aucun utilisateur connecté');
    }
  }, [loadStatistics, user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  };

  const exportStatistics = () => {
    // Logique d'export à implémenter
    console.log('Export des statistiques...');
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
      <div className="text-center text-red-500 mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Erreur de chargement</h2>
          <p className="text-sm">{error}</p>
          <p className="text-xs text-gray-500 mt-2">
            Rôle: {user?.role} | Organisation: {user?.organization}
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          className="mt-4"
          variant="outline"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Statistiques</h1>
          <p className="text-gray-600">
            Tableau de bord statistique pour {
              user?.role === UserRole.hopital ? 'hôpital' : 
              user?.role === UserRole.mairie ? 'mairie' : 'administration'
            }
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            Actualiser
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Download size={16} />}
            onClick={exportStatistics}
          >
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistics Cards pour Hôpital */}
      {user?.role === UserRole.hopital && hospitalStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Déclarations de naissance"
            value={hospitalStats.nbNaissances}
            icon={<Baby size={24} />}
            textColor="text-blue-600"
          />
          <StatsCard
            title="Déclarations de décès"
            value={hospitalStats.nbDeces}
            icon={<HeartPulse size={24} />}
            textColor="text-purple-600"
          />
          <StatsCard
            title="Total déclarations"
            value={hospitalStats.total}
            icon={<BarChart3 size={24} />}
            textColor="text-green-600"
          />
        </div>
      )}

      {/* Statistics Cards pour Mairie */}
      {user?.role === UserRole.mairie && municipalityStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Déclarations à valider"
            value={municipalityStats.statistiques.enAttente}
            icon={<Clock size={24} />}
            textColor="text-yellow-600"
          />
          <StatsCard
            title="Déclarations validées"
            value={municipalityStats.statistiques.validees}
            icon={<CheckCircle size={24} />}
            textColor="text-green-600"
          />
          <StatsCard
            title="Déclarations refusées"
            value={municipalityStats.statistiques.refusees}
            icon={<XCircle size={24} />}
            textColor="text-red-600"
          />
          <StatsCard
            title="Total déclarations"
            value={municipalityStats.statistiques.total}
            icon={<BarChart3 size={24} />}
            textColor="text-blue-600"
          />
        </div>
      )}

      {/* Statistics Cards pour Admin/Superadmin */}
      {(user?.role === UserRole.admin || user?.role === UserRole.superadmin) && globalStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total naissances"
            value={globalStats.totalNaissances}
            icon={<Baby size={24} />}
            textColor="text-blue-600"
          />
          <StatsCard
            title="Total décès"
            value={globalStats.totalDeces}
            icon={<HeartPulse size={24} />}
            textColor="text-purple-600"
          />
          <StatsCard
            title="Total déclarations"
            value={globalStats.total}
            icon={<BarChart3 size={24} />}
            textColor="text-green-600"
          />
        </div>
      )}

      {/* Détail par hôpital pour Admin/Superadmin */}
      {(user?.role === UserRole.admin || user?.role === UserRole.superadmin) && adminHospitalStats.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques par hôpital</h3>
          <div className="space-y-3">
            {adminHospitalStats.map((hospital, index) => (
              <div key={`${hospital.hopital}-${index}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 block">{hospital.hopital}</span>
                    <span className="text-sm text-gray-500">
                      Total: {hospital.totalNaissances + hospital.totalDeces} déclarations
                    </span>
                  </div>
                </div>
                <div className="flex space-x-6 text-sm">
                  <div className="text-center">
                    <div className="text-blue-600 font-bold text-lg">{hospital.totalNaissances}</div>
                    <div className="text-gray-500">Naissances</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-600 font-bold text-lg">{hospital.totalDeces}</div>
                    <div className="text-gray-500">Décès</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si aucune donnée */}
      {!hospitalStats && !municipalityStats && !globalStats && (
        <div className="text-center text-gray-500 mt-8">
          <p>Aucune statistique disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default Statistics;