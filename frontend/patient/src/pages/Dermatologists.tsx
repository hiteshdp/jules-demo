// Generated via prompt: prompts/dermatologist_fetch_functionality_v1.md
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchDermatologists } from '../store/slices/dermatologistSlice';
import { UserIcon, CurrencyDollarIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const Dermatologists: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dermatologists, loading, error } = useSelector((state: RootState) => state.dermatologist);

  useEffect(() => {
    dispatch(fetchDermatologists());
  }, [dispatch]);

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getAvailabilityStatus = (dermatologist: any) => {
    if (!dermatologist.is_available) return 'Not Available';
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const isAvailableToday = dermatologist.available_days?.includes(today);
    
    return isAvailableToday ? 'Available Today' : 'Available';
  };

  const getAvailabilityColor = (dermatologist: any) => {
    if (!dermatologist.is_available) return 'bg-red-100 text-red-800';
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const isAvailableToday = dermatologist.available_days?.includes(today);
    
    return isAvailableToday ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <UserIcon className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading dermatologists</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchDermatologists())}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Available Dermatologists</h1>
        <p className="mt-1 text-sm text-gray-500">
          Choose from our qualified dermatologists for your hair loss consultation.
        </p>
      </div>

      {dermatologists.length === 0 ? (
        <div className="text-center py-12">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No dermatologists available</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are currently no dermatologists available for consultation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dermatologists.map((dermatologist) => (
            <div key={dermatologist.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      Dr. {dermatologist.user.name}
                    </h3>
                    <p className="text-sm text-gray-500">{dermatologist.specialization}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <AcademicCapIcon className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                    <span>{dermatologist.years_of_experience} years experience</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <CurrencyDollarIcon className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                    <span>₹{dermatologist.consultation_fee} consultation fee</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                    <span>
                      {formatTime(dermatologist.start_time)} - {formatTime(dermatologist.end_time)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(dermatologist)}`}>
                      {getAvailabilityStatus(dermatologist)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Max {dermatologist.max_patients_per_day} patients/day
                    </span>
                  </div>

                  {dermatologist.bio && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                      {dermatologist.bio}
                    </p>
                  )}

                  <div className="mt-4">
                    <button
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!dermatologist.is_available}
                    >
                      {dermatologist.is_available ? 'Book Consultation' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dermatologists;
