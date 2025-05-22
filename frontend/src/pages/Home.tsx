import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Gestion simplifiée des</span>
                  <span className="block text-blue-600">déclarations civiles</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Plateforme numérique pour la gestion des déclarations de naissance et de décès. 
                  Simplifiez vos démarches administratives avec DeclaraSen.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/login">
                      <Button 
                        variant="primary"
                        size="lg"
                        icon={<ArrowRight className="ml-2" />}
                      >
                        Commencer
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Fonctionnalités</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Une meilleure façon de gérer les déclarations
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Notre plateforme offre des outils puissants pour simplifier la gestion des déclarations civiles.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Gestion des déclarations</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Créez et gérez facilement les déclarations de naissance et de décès.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Collaboration</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Travaillez en collaboration entre hôpitaux et municipalités.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Validation simplifiée</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Processus de validation rapide et sécurisé des déclarations.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Suivi en temps réel</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Suivez l'état de vos déclarations en temps réel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Prêt à commencer ?</span>
            <span className="block">Connectez-vous maintenant</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Rejoignez les nombreux établissements qui utilisent déjà DeclaraSen pour simplifier leurs processus.
          </p>
          <Link to="/login">
            <Button 
              variant="outline" 
              size="lg"
              className="mt-8 w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-blue-700"
            >
              Se connecter
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;