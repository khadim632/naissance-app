import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

const BirthForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('child');
  
  const [childInfo, setChildInfo] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    gender: 'male',
  });
  
  const [fatherInfo, setFatherInfo] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    phoneNumber: '',
    address: '',
  });
  
  const [motherInfo, setMotherInfo] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    phoneNumber: '',
    address: '',
  });
  
  const [declarationInfo, setDeclarationInfo] = useState({
    municipalityId: '',
  });
  
  // Sample municipalities for development purposes
  const municipalities = [
    { id: '1', name: 'Mairie de Dakar' },
    { id: '2', name: 'Mairie de Pikine' },
    { id: '3', name: 'Mairie de Guédiawaye' },
    { id: '4', name: 'Mairie de Rufisque' },
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to save the data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to the list after successful submission
      navigate('/births');
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/births')}
          className="mr-4"
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">New Birth Declaration</h1>
          <p className="text-gray-600">Fill in the details to register a new birth</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'child'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('child')}
            >
              Child Information
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'father'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('father')}
            >
              Father Information
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'mother'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('mother')}
            >
              Mother Information
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'declaration'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('declaration')}
            >
              Declaration Details
            </button>
          </nav>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Child Information */}
            {activeTab === 'child' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="childFirstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="childFirstName"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={childInfo.firstName}
                        onChange={(e) => setChildInfo({ ...childInfo, firstName: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="childLastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="childLastName"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={childInfo.lastName}
                        onChange={(e) => setChildInfo({ ...childInfo, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                      Birth Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        id="birthDate"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={childInfo.birthDate}
                        onChange={(e) => setChildInfo({ ...childInfo, birthDate: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="birthTime" className="block text-sm font-medium text-gray-700">
                      Birth Time
                    </label>
                    <div className="mt-1">
                      <input
                        type="time"
                        id="birthTime"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={childInfo.birthTime}
                        onChange={(e) => setChildInfo({ ...childInfo, birthTime: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700">
                      Birth Place
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="birthPlace"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={childInfo.birthPlace}
                        onChange={(e) => setChildInfo({ ...childInfo, birthPlace: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <div className="mt-2 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                      <div className="flex items-center">
                        <input
                          id="male"
                          name="gender"
                          type="radio"
                          checked={childInfo.gender === 'male'}
                          onChange={() => setChildInfo({ ...childInfo, gender: 'male' })}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor="male" className="ml-3 block text-sm font-medium text-gray-700">
                          Male
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="female"
                          name="gender"
                          type="radio"
                          checked={childInfo.gender === 'female'}
                          onChange={() => setChildInfo({ ...childInfo, gender: 'female' })}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor="female" className="ml-3 block text-sm font-medium text-gray-700">
                          Female
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="primary"
                    onClick={() => setActiveTab('father')}
                  >
                    Next: Father Information
                  </Button>
                </div>
              </div>
            )}
            
            {/* Father Information */}
            {activeTab === 'father' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="fatherFirstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="fatherFirstName"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={fatherInfo.firstName}
                        onChange={(e) => setFatherInfo({ ...fatherInfo, firstName: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="fatherLastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="fatherLastName"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={fatherInfo.lastName}
                        onChange={(e) => setFatherInfo({ ...fatherInfo, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="fatherIdNumber" className="block text-sm font-medium text-gray-700">
                      ID Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="fatherIdNumber"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={fatherInfo.idNumber}
                        onChange={(e) => setFatherInfo({ ...fatherInfo, idNumber: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="fatherPhoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        id="fatherPhoneNumber"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={fatherInfo.phoneNumber}
                        onChange={(e) => setFatherInfo({ ...fatherInfo, phoneNumber: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="fatherAddress" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="fatherAddress"
                        rows={3}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={fatherInfo.address}
                        onChange={(e) => setFatherInfo({ ...fatherInfo, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setActiveTab('child')}
                  >
                    Previous: Child Information
                  </Button>
                  <Button 
                    type="button" 
                    variant="primary"
                    onClick={() => setActiveTab('mother')}
                  >
                    Next: Mother Information
                  </Button>
                </div>
              </div>
            )}
            
            {/* Mother Information */}
            {activeTab === 'mother' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="motherFirstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="motherFirstName"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={motherInfo.firstName}
                        onChange={(e) => setMotherInfo({ ...motherInfo, firstName: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="motherLastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="motherLastName"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={motherInfo.lastName}
                        onChange={(e) => setMotherInfo({ ...motherInfo, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="motherIdNumber" className="block text-sm font-medium text-gray-700">
                      ID Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="motherIdNumber"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={motherInfo.idNumber}
                        onChange={(e) => setMotherInfo({ ...motherInfo, idNumber: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="motherPhoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        id="motherPhoneNumber"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={motherInfo.phoneNumber}
                        onChange={(e) => setMotherInfo({ ...motherInfo, phoneNumber: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="motherAddress" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="motherAddress"
                        rows={3}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={motherInfo.address}
                        onChange={(e) => setMotherInfo({ ...motherInfo, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setActiveTab('father')}
                  >
                    Previous: Father Information
                  </Button>
                  <Button 
                    type="button" 
                    variant="primary"
                    onClick={() => setActiveTab('declaration')}
                  >
                    Next: Declaration Details
                  </Button>
                </div>
              </div>
            )}
            
            {/* Declaration Details */}
            {activeTab === 'declaration' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="municipality" className="block text-sm font-medium text-gray-700">
                      Target Municipality
                    </label>
                    <div className="mt-1">
                      <select
                        id="municipality"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={declarationInfo.municipalityId}
                        onChange={(e) => setDeclarationInfo({ ...declarationInfo, municipalityId: e.target.value })}
                      >
                        <option value="">Select a municipality</option>
                        {municipalities.map((municipality) => (
                          <option key={municipality.id} value={municipality.id}>
                            {municipality.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Child Information</h4>
                      <p className="mt-1"><span className="font-medium">Name:</span> {childInfo.firstName} {childInfo.lastName}</p>
                      <p><span className="font-medium">Birth:</span> {childInfo.birthDate} at {childInfo.birthTime}</p>
                      <p><span className="font-medium">Gender:</span> {childInfo.gender === 'male' ? 'Male' : 'Female'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Father Information</h4>
                      <p className="mt-1"><span className="font-medium">Name:</span> {fatherInfo.firstName} {fatherInfo.lastName}</p>
                      <p><span className="font-medium">ID:</span> {fatherInfo.idNumber}</p>
                      <p><span className="font-medium">Contact:</span> {fatherInfo.phoneNumber}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Mother Information</h4>
                      <p className="mt-1"><span className="font-medium">Name:</span> {motherInfo.firstName} {motherInfo.lastName}</p>
                      <p><span className="font-medium">ID:</span> {motherInfo.idNumber}</p>
                      <p><span className="font-medium">Contact:</span> {motherInfo.phoneNumber}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Declaration Details</h4>
                      <p className="mt-1">
                        <span className="font-medium">Municipality:</span> {
                          declarationInfo.municipalityId 
                            ? municipalities.find(m => m.id === declarationInfo.municipalityId)?.name 
                            : 'Not selected'
                        }
                      </p>
                      <p><span className="font-medium">Status:</span> Draft (Pending submission)</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setActiveTab('mother')}
                  >
                    Previous: Mother Information
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    icon={<Save size={16} />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Declaration'}
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