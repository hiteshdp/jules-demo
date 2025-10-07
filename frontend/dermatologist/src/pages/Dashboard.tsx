import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import { 
  CalendarDaysIcon, 
  UserGroupIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments, loading } = useSelector((state: RootState) => state.appointment);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const todayAppointments = appointments.filter(
    appointment => new Date(appointment.scheduled_at).toDateString() === new Date().toDateString()
  );

  const upcomingAppointments = appointments.filter(
    appointment => new Date(appointment.scheduled_at) > new Date()
  ).slice(0, 5);

  const completedAppointments = appointments.filter(
    appointment => appointment.status === 'completed'
  );


  const stats = [
    {
      name: 'Today\'s Appointments',
      value: todayAppointments.length,
      icon: CalendarDaysIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Total Patients',
      value: new Set(appointments.map(apt => apt.patient_id)).size,
      icon: UserGroupIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Completed Appointments',
      value: completedAppointments.length,
      icon: ClipboardDocumentListIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, Dr. {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's your practice overview for today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/appointments"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <CalendarDaysIcon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  View Appointments
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage your patient appointments and consultations.
                </p>
              </div>
            </a>

            <a
              href="/appointments"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <ChatBubbleLeftRightIcon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Patient Chat
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Communicate with your patients in real-time.
                </p>
              </div>
            </a>

            <a
              href="/profile"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  <UserGroupIcon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Manage Profile
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Update your professional information and credentials.
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      {todayAppointments.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Today's Appointments
            </h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {todayAppointments.map((appointment) => (
                  <li key={appointment.id} className="py-4">
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
                          <span>{new Date(appointment.scheduled_at).toLocaleTimeString()}</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>₹{appointment.consultation_fee}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Upcoming Appointments
            </h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CalendarDaysIcon className="h-5 w-5 text-green-600" />
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
                          <span>{new Date(appointment.scheduled_at).toLocaleDateString()} at {new Date(appointment.scheduled_at).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {appointments.length === 0 && !loading && (
        <div className="text-center py-12">
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any appointments scheduled yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
