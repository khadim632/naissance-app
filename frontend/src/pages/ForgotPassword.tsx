import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import authService from '../services/authService';
import Button from '../components/common/Button';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      if (!email) {
        throw new Error('Veuillez entrer votre adresse email');
      }
      
      // Debug logs
      console.log('authService:', authService);
      console.log('forgotPassword function:', authService.forgotPassword);
      
      if (typeof authService.forgotPassword !== 'function') {
        throw new Error('authService.forgotPassword is not a function');
      }
      
      const response = await authService.forgotPassword(email);
      setMessage(response);
      setEmail('');
    } catch (err: unknown) {
      console.error('Erreur lors de forgotPassword:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
  } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-center text-blue-600">DeclaraSen</h1>
          <h2 className="mt-2 text-center text-gray-600">
            Réinitialisation de mot de passe
          </h2>
        </div>

        {message ? (
          <div className="mt-8 space-y-6">
            <div className="bg-green-50 text-green-700 p-4 rounded-md">
              {message}
            </div>
            <div className="text-center">
              <Link to="/login" className="text-blue-600 hover:underline">
                Retour à la page de connexion
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
              </p>
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
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSubmitting}
                icon={<Mail size={18} />}
              >
                {isSubmitting ? 'Envoi...' : 'Envoyer le lien'}
              </Button>
            </div>
            
            <div className="text-center text-sm">
              <Link to="/login" className="text-blue-600 hover:underline">
                Retour à la page de connexion
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;