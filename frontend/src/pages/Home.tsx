import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import logo from '../assets/logo.png'; // Ton logo (dans src/assets/logo.png)

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Logo */}
      <div className="flex justify-center py-6">
        <img src={logo} alt="DeclaraSen Logo" className="h-20" />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          
          {/* Texte à gauche */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="lg:max-w-2xl">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                <span className="block">Gestion simplifiée des</span>
                <span className="block text-blue-600">déclarations civiles</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Plateforme numérique pour la gestion des déclarations de naissance et de décès.
                Simplifiez vos démarches administratives avec DeclaraSen.
              </p>
              <div className="mt-6">
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

          {/* Image à droite */}
          <div className="mt-10 lg:mt-0">
            <img 
              src="/images/hero.jpg" 
              alt="Illustration déclaration civile" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Vidéo intégrée */}
      <div className="my-16 max-w-4xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-center mb-4 text-blue-700">Découvrez DeclaraSen en vidéo</h3>
        <div className="aspect-w-16 aspect-h-9 rounded-lg shadow-lg overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/Ee6RXKVajVE" // Remplace par ton propre ID de vidéo
            title="Présentation DeclaraSen"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Fonctionnalités</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Une meilleure façon de gérer les déclarations
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Notre plateforme offre des outils puissants pour simplifier la gestion des déclarations civiles.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              { icon: <FileText />, title: "Gestion des déclarations", text: "Créez et gérez facilement les déclarations de naissance et de décès." },
              { icon: <Users />, title: "Collaboration", text: "Travaillez en collaboration entre hôpitaux et municipalités." },
              { icon: <CheckCircle />, title: "Validation simplifiée", text: "Processus de validation rapide et sécurisé des déclarations." },
              { icon: <Clock />, title: "Suivi en temps réel", text: "Suivez l'état de vos déclarations en temps réel." },
            ].map((feature, index) => (
              <div key={index} className="relative pl-16">
                <div className="absolute top-0 left-0 h-12 w-12 flex items-center justify-center rounded-md bg-blue-500 text-white">
                  {feature.icon}
                </div>
                <p className="text-lg font-medium text-gray-900">{feature.title}</p>
                <p className="mt-2 text-base text-gray-500">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call To Action */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Prêt à commencer ?</span>
            <span className="block">Connectez-vous maintenant</span>
          </h2>
          <p className="mt-4 text-lg text-blue-200">
            Rejoignez les nombreux établissements qui utilisent déjà DeclaraSen.
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
