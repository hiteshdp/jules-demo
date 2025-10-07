import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { CalendarDaysIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const Appointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { appointments, loading } = useSelector((state: RootState) => state.appointment);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const filteredAppointments = appointments.filter(appointment => {
    switch (filter) {
      case 'today':
        return new Date(appointment.scheduled_at).toDateString() === new Date().toDateString();
      case 'upcoming':
        return new Date(appointment.scheduled_at) > new Date();
      case 'completed':
        return appointment.status === 'completed';
      case 'cancelled':
        return appointment.status === 'cancelled';
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const handleAppointmentClick = (appointmentId: number) => {
    navigate(`/appointments/${appointmentId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your patient appointments and consultations.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Appointments' },
            { key: 'today', label: 'Today' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`${
                filter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Appointments List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' 
                  ? 'You don\'t have any appointments yet.'
                  : `No ${filter} appointments found.`
                }
              </p>
            </div>
          ) : (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <li key={appointment.id} className="py-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleAppointmentClick(appointment.id)}>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserGroupIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {appointment.patient?.name}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <CalendarDaysIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{formatDateTime(appointment.scheduled_at)}</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>₹{appointment.consultation_fee}</span>
                          {appointment.is_paid && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Paid
                            </span>
                          )}
                        </div>
                        {appointment.notes && (
                          <p className="mt-2 text-sm text-gray-600 truncate">
                            {appointment.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
