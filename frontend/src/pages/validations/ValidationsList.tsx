import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Check, X } from 'lucide-react';
import { BirthDeclaration, DeathDeclaration, DeclarationStatus } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

// Mock data
const mockBirthDeclarations: BirthDeclaration[] = Array.from({ length: 15 }, (_, i) => ({
  id: `BD${1000 + i}`,
  childFirstName: `Prénom${i}`,
  childLastName: `Nom${i}`,
  birthDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  birthTime: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
  birthPlace: 'Hôpital Principal de Dakar',
  gender: Math.random() > 0.5 ? 'male' : 'female',
  father: {
    firstName: `PèrePrénom${i}`,
    lastName: `PèreNom${i}`,
    idNumber: `ID${100000 + i}`,
    phoneNumber: `+221 7${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000)}`,
    address: 'Dakar, Sénégal'
  },
  mother: {
    firstName: `MèrePrénom${i}`,
    lastName: `MèreNom${i}`,
    idNumber: `ID${200000 + i}`,
    phoneNumber: `+221 7${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000)}`,
    address: 'Dakar, Sénégal'
  },
  declarationDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  status: DeclarationStatus.PENDING,
  hospitalId: `${i % 3 + 1}`,
  hospitalName: `Hôpital ${i % 3 + 1}`,
  municipalityId: '1',
  municipalityName: 'Mairie de Dakar'
}));

const mockDeathDeclarations: DeathDeclaration[] = Array.from({ length: 10 }, (_, i) => ({
  id: `DD${1000 + i}`,
  deceased: {
    firstName: `Prénom${i}`,
    lastName: `Nom${i}`,
    birthDate: new Date(1950, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    idNumber: `ID${300000 + i}`,
    address: 'Dakar, Sénégal'
  },
  deathDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  deathTime: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
  deathPlace: 'Hôpital Principal de Dakar',
  deathCause: ['Natural causes', 'Illness', 'Accident', 'Other'][Math.floor(Math.random() * 4)],
  declarationDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  status: DeclarationStatus.PENDING,
  hospitalId: `${i % 3 + 1}`,
  hospitalName: `Hôpital ${i % 3 + 1}`,
  municipalityId: '1',
  municipalityName: 'Mairie de Dakar'
}));

type DeclarationType = 'birth' | 'death';

const ValidationsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DeclarationType>('birth');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [birthDeclarations, setBirthDeclarations] = useState<BirthDeclaration[]>([]);
  const [deathDeclarations, setDeathDeclarations] = useState<DeathDeclaration[]>([]);

  useEffect(() => {
    // Simulate API call
    const fetchDeclarations = () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        setBirthDeclarations(mockBirthDeclarations);
        setDeathDeclarations(mockDeathDeclarations);
        setIsLoading(false);
      }, 1000);
    };

    fetchDeclarations();
  }, []);

  const filteredBirthDeclarations = birthDeclarations.filter(
    declaration => 
      declaration.childFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.childLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeathDeclarations = deathDeclarations.filter(
    declaration => 
      declaration.deceased.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.deceased.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleValidate = (type: DeclarationType, id: string) => {
    // In a real app, this would be an API call
    if (type === 'birth') {
      setBirthDeclarations(prevDeclarations => 
        prevDeclarations.map(declaration => 
          declaration.id === id 
            ? { ...declaration, status: DeclarationStatus.VALIDATED, validationDate: new Date().toISOString() } 
            : declaration
        )
      );
    } else {
      setDeathDeclarations(prevDeclarations => 
        prevDeclarations.map(declaration => 
          declaration.id === id 
            ? { ...declaration, status: DeclarationStatus.VALIDATED, validationDate: new Date().toISOString() } 
            : declaration
        )
      );
    }
  };

  const handleReject = (type: DeclarationType, id: string) => {
    // In a real app, this would be an API call
    if (type === 'birth') {
      setBirthDeclarations(prevDeclarations => 
        prevDeclarations.map(declaration => 
          declaration.id === id 
            ? { ...declaration, status: DeclarationStatus.REJECTED, validationDate: new Date().toISOString() } 
            : declaration
        )
      );
    } else {
      setDeathDeclarations(prevDeclarations => 
        prevDeclarations.map(declaration => 
          declaration.id === id 
            ? { ...declaration, status: DeclarationStatus.REJECTED, validationDate: new Date().toISOString() } 
            : declaration
        )
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Validations</h1>
        <p className="text-gray-600">Review and validate declarations from hospitals</p>
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
              Birth Declarations
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'death'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('death')}
            >
              Death Declarations
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
                placeholder="Search by name, ID, or hospital..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                    Child Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Birth Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Declaration Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBirthDeclarations.map((declaration) => (
                  <tr key={declaration.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link to={`/validations/birth/${declaration.id}`} className="text-blue-600 hover:text-blue-800">
                        {declaration.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {declaration.childFirstName} {declaration.childLastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {declaration.birthDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {declaration.hospitalName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={declaration.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(declaration.declarationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {declaration.status === DeclarationStatus.PENDING && (
                        <div className="flex space-x-2 justify-end">
                          <Button
                            variant="success"
                            size="sm"
                            icon={<Check size={16} />}
                            onClick={() => handleValidate('birth', declaration.id)}
                          >
                            Validate
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<X size={16} />}
                            onClick={() => handleReject('birth', declaration.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
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
                    Deceased Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Death Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Declaration Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeathDeclarations.map((declaration) => (
                  <tr key={declaration.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link to={`/validations/death/${declaration.id}`} className="text-blue-600 hover:text-blue-800">
                        {declaration.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {declaration.deceased.firstName} {declaration.deceased.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {declaration.deathDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {declaration.hospitalName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={declaration.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(declaration.declarationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {declaration.status === DeclarationStatus.PENDING && (
                        <div className="flex space-x-2 justify-end">
                          <Button
                            variant="success"
                            size="sm"
                            icon={<Check size={16} />}
                            onClick={() => handleValidate('death', declaration.id)}
                          >
                            Validate
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<X size={16} />}
                            onClick={() => handleReject('death', declaration.id)}
                          >
                            Reject
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
              <p className="text-gray-500 text-sm">No declarations found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationsList;