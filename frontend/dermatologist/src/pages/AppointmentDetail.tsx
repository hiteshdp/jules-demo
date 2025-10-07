// Generated via prompt: prompts/dermatologist_pages_fix_v1.md
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments } from '../store/slices/appointmentSlice';

const AppointmentDetail: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { appointments, loading } = useSelector((state: RootState) => state.appointment);

  useEffect(() => {
    if (appointments.length === 0) {
      dispatch(fetchAppointments());
    }
  }, [dispatch, appointments.length]);

  const appointment = appointments.find((a) => String(a.id) === String(id));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-gray-900">Appointment not found</h1>
        <button
          onClick={() => navigate('/appointments')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Appointments
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
        <p className="mt-1 text-sm text-gray-500">Review appointment information and patient context.</p>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Patient</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.patient?.name || 'N/A'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Scheduled At</dt>
              <dd className="mt-1 text-sm text-gray-900">{new Date(appointment.scheduled_at).toLocaleString()}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.status}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Consultation Fee</dt>
              <dd className="mt-1 text-sm text-gray-900">₹{appointment.consultation_fee}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.notes || '—'}</dd>
            </div>
          </dl>
        </div>
        <div className="px-4 py-4 sm:px-6 flex justify-end gap-3">
          <button
            onClick={() => navigate('/appointments')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;


