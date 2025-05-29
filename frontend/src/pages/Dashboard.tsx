import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Baby, 
  HeartPulse, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BarChart3 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, DashboardStats } from '../types';
import StatsCard from '../components/common/StatsCard';

const mockSampleStats: DashboardStats = {
  totalBirthDeclarations: 256,
  totalDeathDeclarations: 124,
  pendingBirthDeclarations: 42,
  pendingDeathDeclarations: 18,
  validatedBirthDeclarations: 198,
  validatedDeathDeclarations: 94,
  rejectedBirthDeclarations: 16,
  rejectedDeathDeclarations: 12
};

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadStats = () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        setStats(mockSampleStats);
        setIsLoading(false);
      }, 1000);
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500 mt-8">
        Failed to load dashboard statistics
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.firstName}! Here's what's happening in your {user?.role} account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {user?.role === UserRole.hopital && (
          <>
            <StatsCard
              title="Total Birth Declarations"
              value={stats.totalBirthDeclarations}
              icon={<Baby size={24} />}
              change={8}
              changeType="increase"
              textColor="text-blue-600"
            />
            <StatsCard
              title="Total Death Declarations"
              value={stats.totalDeathDeclarations}
              icon={<HeartPulse size={24} />}
              change={2}
              changeType="decrease"
              textColor="text-purple-600"
            />
            <StatsCard
              title="Pending Validations"
              value={stats.pendingBirthDeclarations + stats.pendingDeathDeclarations}
              icon={<Clock size={24} />}
              textColor="text-yellow-600"
            />
            <StatsCard
              title="Validated Declarations"
              value={stats.validatedBirthDeclarations + stats.validatedDeathDeclarations}
              icon={<CheckCircle size={24} />}
              textColor="text-green-600"
            />
          </>
        )}

        {user?.role === UserRole.mairie && (
          <>
            <StatsCard
              title="Pending Birth Validations"
              value={stats.pendingBirthDeclarations}
              icon={<Baby size={24} />}
              change={15}
              changeType="increase"
              textColor="text-blue-600"
            />
            <StatsCard
              title="Pending Death Validations"
              value={stats.pendingDeathDeclarations}
              icon={<HeartPulse size={24} />}
              change={5}
              changeType="increase"
              textColor="text-purple-600"
            />
            <StatsCard
              title="Validated This Month"
              value={68}
              icon={<CheckCircle size={24} />}
              textColor="text-green-600"
            />
            <StatsCard
              title="Rejected This Month"
              value={12}
              icon={<XCircle size={24} />}
              textColor="text-red-600"
            />
          </>
        )}

        {user?.role === UserRole.admin && (
          <>
            <StatsCard
              title="Total Hospitals"
              value={12}
              icon={<HeartPulse size={24} />}
              textColor="text-purple-600"
            />
            <StatsCard
              title="Total Municipalities"
              value={28}
              icon={<Users size={24} />}
              textColor="text-indigo-600"
            />
            <StatsCard
              title="Total Birth Declarations"
              value={stats.totalBirthDeclarations}
              icon={<Baby size={24} />}
              change={12}
              changeType="increase"
              textColor="text-blue-600"
            />
            <StatsCard
              title="Total Death Declarations"
              value={stats.totalDeathDeclarations}
              icon={<BarChart3 size={24} />}
              change={3}
              changeType="increase"
              textColor="text-gray-600"
            />
          </>
        )}

        {user?.role === UserRole.superadmin && (
          <>
            <StatsCard
              title="Total Hospitals"
              value={12}
              icon={<HeartPulse size={24} />}
              textColor="text-purple-600"
            />
            <StatsCard
              title="Total Municipalities"
              value={28}
              icon={<Users size={24} />}
              textColor="text-indigo-600"
            />
            <StatsCard
              title="Total Birth Declarations"
              value={stats.totalBirthDeclarations}
              icon={<Baby size={24} />}
              change={12}
              changeType="increase"
              textColor="text-blue-600"
            />
            <StatsCard
              title="Total Death Declarations"
              value={stats.totalDeathDeclarations}
              icon={<BarChart3 size={24} />}
              change={3}
              changeType="increase"
              textColor="text-gray-600"
            />
          </>
        )}
      </div>

      <div className="bg-white rounded-lg shadow mb-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Recent Activity Items */}
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Baby size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">New birth declaration submitted</p>
                <p className="text-xs text-gray-500">30 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">Birth declaration #BD428 validated</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <HeartPulse size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">New death declaration submitted</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;