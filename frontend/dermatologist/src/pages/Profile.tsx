// Generated via prompt: prompts/dermatologist_pages_fix_v1.md
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Review and manage your profile information.</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.name || '—'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.email || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Specialization</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.dermatologistProfile?.specialization || '—'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;


