import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments, fetchDermatologists, bookAppointment } from '../store/slices/appointmentSlice';
import { CalendarDaysIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Appointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, dermatologists, loading, error } = useSelector((state: RootState) => state.appointment);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    dermatologist_id: '',
    scheduled_at: '',
  });

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchDermatologists());
  }, [dispatch]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.dermatologist_id || !bookingData.scheduled_at) {
      toast.error('Please fill in all fields');
      return;
    }

    dispatch(bookAppointment({
      dermatologist_id: parseInt(bookingData.dermatologist_id),
      scheduled_at: bookingData.scheduled_at,
    }))
      .unwrap()
      .then(() => {
        setShowBookingForm(false);
        setBookingData({ dermatologist_id: '', scheduled_at: '' });
        toast.success('Appointment booked successfully!');
        // Refresh appointments list
        dispatch(fetchAppointments());
      })
      .catch((error) => {
        toast.error(error || 'Failed to book appointment');
      });
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your consultations with dermatologists.
          </p>
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          className="btn-primary"
        >
          Book New Appointment
        </button>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Book New Appointment
              </h3>
              <form onSubmit={handleBookingSubmit}>
                <div className="mb-4">
                  <label className="form-label">Select Dermatologist</label>
                  <div className="text-xs text-gray-500 mb-2">
                    {Array.isArray(dermatologists) ? dermatologists.length : 0} dermatologist(s) available
                  </div>
                  <select
                    value={bookingData.dermatologist_id}
                    onChange={(e) => setBookingData({ ...bookingData, dermatologist_id: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Choose a dermatologist</option>
                    {(Array.isArray(dermatologists) ? dermatologists : []).map((derm) => (
                      <option key={derm.id} value={derm.user_id}>
                        {derm.user.name} - {derm.specialization} (₹{derm.consultation_fee})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="form-label">Select Date & Time</label>
                  <input
                    type="datetime-local"
                    value={bookingData.scheduled_at}
                    onChange={(e) => setBookingData({ ...bookingData, scheduled_at: e.target.value })}
                    className="input-field"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Your Appointments</h3>
            <div className="text-sm text-gray-500">
              {Array.isArray(appointments) ? appointments.length : 0} appointment(s)
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">Error: {error}</p>
              <button
                onClick={() => {
                  dispatch(fetchAppointments());
                  dispatch(fetchDermatologists());
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try Again
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : !Array.isArray(appointments) || appointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by booking your first appointment.
              </p>
            </div>
          ) : (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <li key={appointment.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {appointment.dermatologist?.name || 'Unknown Doctor'}
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
                          <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>₹{appointment.consultation_fee}</span>
                        </div>
                        {appointment.notes && (
                          <p className="mt-2 text-sm text-gray-600">
                            {appointment.notes}
                          </p>
                        )}
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
