// Generated via prompt: prompts/admin_dermatologists_crud_v1.md
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchDermatologists, createDermatologist, updateDermatologist, deleteDermatologist } from '../store/slices/dermatologistSlice';
import { UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import DermatologistModal from '../components/DermatologistModal';

const Dermatologists: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dermatologists, loading } = useSelector((state: RootState) => state.dermatologist);
  const [currentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchDermatologists({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const filteredDermatologists = dermatologists.filter((dermatologist: any) =>
    dermatologist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dermatologist.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentEditingData = editingId ? dermatologists.find((d: any) => d.id === editingId) : null;

  const handleCreate = () => {
    setEditingId(null);
    setModalOpen(true);
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this dermatologist?')) return;
    try {
      await dispatch(deleteDermatologist(id)).unwrap();
      toast.success('Dermatologist deleted successfully');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete dermatologist');
    }
  };

  const handleModalSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      if (editingId) {
        // Do not send empty password
        const payload = { ...data };
        if (!payload.password) delete payload.password;
        await dispatch(updateDermatologist({ dermatologistId: editingId, data: payload })).unwrap();
        toast.success('Dermatologist updated successfully');
      } else {
        await dispatch(createDermatologist(data)).unwrap();
        toast.success('Dermatologist created successfully');
      }
      setModalOpen(false);
      // refresh list
      dispatch(fetchDermatologists({ page: currentPage, search: searchTerm }));
    } catch (e: any) {
      const msg = e?.message || e?.error || 'Operation failed';
      toast.error(typeof msg === 'string' ? msg : 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dermatologists</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage dermatologist accounts and profiles.
            </p>
          </div>
          <div>
            <button onClick={handleCreate} className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
              + Create Dermatologist
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search dermatologists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Dermatologists Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredDermatologists.length === 0 ? (
              <div className="text-center py-12">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No dermatologists found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'No dermatologists match your search criteria.' : 'No dermatologists registered yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dermatologist
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DOB
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gender
                      </th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscription Status
                      </th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDermatologists.map((dermatologist: any) => (
                      <tr key={dermatologist.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {dermatologist.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dermatologist.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dermatologist.phone_no || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dermatologist.dob || '–'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dermatologist.gender || '–'}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dermatologist.subscription_status || '–'}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button onClick={() => handleEdit(dermatologist.id)} className="text-blue-600 hover:text-blue-900">Edit</button>
                            <button onClick={() => handleDelete(dermatologist.id)} className="text-red-600 hover:text-red-900">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <DermatologistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={currentEditingData ? { 
          name: currentEditingData.name, 
          email: currentEditingData.email, 
          phone_no: currentEditingData.phone_no, 
          dob: currentEditingData.dob, 
          gender: currentEditingData.gender 
        } : null}
        title={editingId ? 'Edit Dermatologist' : 'Create Dermatologist'}
        submitting={submitting}
      />
    </>
  );
};

export default Dermatologists;