import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { KeyRound, Loader } from 'lucide-react';
import authService from '../services/authService';
import Button from '../components/common/Button';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmMotDePasse, setConfirmMotDePasse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState(false);
  
  // Vérifier la validité du token à l'initialisation
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Token manquant ou invalide');
        setIsVerifying(false);
        return;
      }
      
      try {
        const isValid = await authService.verifyResetToken(token);
        setTokenValid(isValid);
        if (!isValid) {
          setError('Le lien de réinitialisation est invalide ou a expiré');
        }
      } catch {
  setError('Erreur lors de la vérification du token');
}
 finally {
        setIsVerifying(false);
      }
    };
    
    verifyToken();
  }, [token]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);
    
    try {
      if (!token) {
        throw new Error('Token manquant');
      }
      
      if (!motDePasse) {
        throw new Error('Veuillez entrer un nouveau mot de passe');
      }
      
      if (motDePasse !== confirmMotDePasse) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      
      // Validation de la force du mot de passe
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(motDePasse)) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre');
      }
      
      const response = await authService.resetPassword(token, motDePasse);
      setMessage(response);
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('Une erreur est survenue. Veuillez réessayer.');
  }
}
 finally {
      setIsSubmitting(false);
    }
  };
  
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Vérification du lien de réinitialisation...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-center text-blue-600">DeclaraSen</h1>
          <h2 className="mt-2 text-center text-gray-600">
            Réinitialisation de mot de passe
          </h2>
        </div>
        
        {!tokenValid ? (
          <div className="mt-6 space-y-6">
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
              {error || 'Ce lien de réinitialisation n\'est plus valide ou a expiré.'}
            </div>
            <div className="text-center">
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Demander un nouveau lien de réinitialisation
              </Link>
            </div>
          </div>
        ) : message ? (
          <div className="mt-8 space-y-6">
            <div className="bg-green-50 text-green-700 p-4 rounded-md">
              {message}
            </div>
            <p className="text-sm text-gray-600 text-center">
              Vous allez être redirigé vers la page de connexion...
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  id="motDePasse"
                  name="motDePasse"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Nouveau mot de passe"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre
                </p>
              </div>

              <div>
                <label htmlFor="confirmMotDePasse" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmMotDePasse"
                  name="confirmMotDePasse"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmMotDePasse}
                  onChange={(e) => setConfirmMotDePasse(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirmer le mot de passe"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSubmitting}
                icon={<KeyRound size={18} />}
              >
                {isSubmitting ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
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

export default ResetPassword;