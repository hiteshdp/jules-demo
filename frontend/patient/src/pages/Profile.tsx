import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { PencilIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Profile = () => {
  // const dispatch = useDispatch<AppDispatch>(); // TODO: Will be used for profile update actions
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    medical_history: '',
    allergies: '',
    current_medications: '',
    lifestyle: '',
    smoking: false,
    alcohol_consumption: false,
    dietary_habits: '',
    stress_level: '',
    sleep_pattern: '',
    hair_care_routine: '',
    family_history: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        medical_history: user.patientProfile?.medical_history || '',
        allergies: user.patientProfile?.allergies || '',
        current_medications: user.patientProfile?.current_medications || '',
        lifestyle: user.patientProfile?.lifestyle || '',
        smoking: user.patientProfile?.smoking || false,
        alcohol_consumption: user.patientProfile?.alcohol_consumption || false,
        dietary_habits: user.patientProfile?.dietary_habits || '',
        stress_level: user.patientProfile?.stress_level || '',
        sleep_pattern: user.patientProfile?.sleep_pattern || '',
        hair_care_routine: user.patientProfile?.hair_care_routine || '',
        family_history: user.patientProfile?.family_history || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would dispatch an update action
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        medical_history: user.patientProfile?.medical_history || '',
        allergies: user.patientProfile?.allergies || '',
        current_medications: user.patientProfile?.current_medications || '',
        lifestyle: user.patientProfile?.lifestyle || '',
        smoking: user.patientProfile?.smoking || false,
        alcohol_consumption: user.patientProfile?.alcohol_consumption || false,
        dietary_habits: user.patientProfile?.dietary_habits || '',
        stress_level: user.patientProfile?.stress_level || '',
        sleep_pattern: user.patientProfile?.sleep_pattern || '',
        hair_care_routine: user.patientProfile?.hair_care_routine || '',
        family_history: user.patientProfile?.family_history || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and medical history.
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Medical History</h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Medical History</label>
                  <textarea
                    name="medical_history"
                    value={formData.medical_history}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Describe any relevant medical history..."
                  />
                </div>
                <div>
                  <label className="form-label">Allergies</label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={2}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="List any allergies..."
                  />
                </div>
                <div>
                  <label className="form-label">Current Medications</label>
                  <textarea
                    name="current_medications"
                    value={formData.current_medications}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={2}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="List current medications..."
                  />
                </div>
                <div>
                  <label className="form-label">Family History</label>
                  <textarea
                    name="family_history"
                    value={formData.family_history}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={2}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Describe family history of hair loss or related conditions..."
                  />
                </div>
              </div>
            </div>

            {/* Lifestyle Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Lifestyle Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Lifestyle</label>
                  <select
                    name="lifestyle"
                    value={formData.lifestyle}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select lifestyle</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very_active">Very Active</option>
                  </select>
                </div>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="smoking"
                      checked={formData.smoking}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Smoking</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="alcohol_consumption"
                      checked={formData.alcohol_consumption}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Alcohol Consumption</span>
                  </label>
                </div>
                <div>
                  <label className="form-label">Dietary Habits</label>
                  <textarea
                    name="dietary_habits"
                    value={formData.dietary_habits}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={2}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Describe your dietary habits..."
                  />
                </div>
                <div>
                  <label className="form-label">Stress Level</label>
                  <textarea
                    name="stress_level"
                    value={formData.stress_level}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={2}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Describe your stress level and sources..."
                  />
                </div>
                <div>
                  <label className="form-label">Sleep Pattern</label>
                  <textarea
                    name="sleep_pattern"
                    value={formData.sleep_pattern}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={2}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Describe your sleep pattern..."
                  />
                </div>
                <div>
                  <label className="form-label">Hair Care Routine</label>
                  <textarea
                    name="hair_care_routine"
                    value={formData.hair_care_routine}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={2}
                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Describe your current hair care routine..."
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
