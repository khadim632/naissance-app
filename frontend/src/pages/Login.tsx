import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { AxiosError } from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

interface ApiErrorResponse {
  message?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [formError, setFormError] = useState('');
  const { login, authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !motDePasse) {
      setFormError('Email et mot de passe requis');
      return;
    }
    
    try {
      await login(email, motDePasse);
      const from = location.state?.from?.pathname || '/app/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'Email ou mot de passe invalide';
      setFormError(errorMessage);
    }
  };
  
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-center text-blue-600">DeclaraSen</h1>
          <h2 className="mt-2 text-center text-gray-600">
            Système de Gestion des Pré-déclarations
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {authState.error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {authState.error}
            </div>
          )}
          
          {formError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {formError}
            </div>
          )}
          
          <div className="rounded-md -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Adresse email"
              />
            </div>
            
            <div>
              <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                id="motDePasse"
                name="motDePasse"
                type="password"
                autoComplete="current-password"
                required
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={authState.loading}
              icon={<LogIn size={18} />}
            >
              {authState.loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;