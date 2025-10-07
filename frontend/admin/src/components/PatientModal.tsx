// Generated via prompt: prompts/admin_patients_crud_v1.md
import React, { useEffect, useState } from 'react';

type Gender = 'male' | 'female' | 'other' | '';

interface PatientForm {
  name: string;
  email: string;
  phone_no: string;
  password?: string;
  dob?: string;
  gender?: Gender;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PatientForm) => Promise<void> | void;
  initialData?: Partial<PatientForm> | null;
  title?: string;
  submitting?: boolean;
}

const PatientModal: React.FC<Props> = ({ open, onClose, onSubmit, initialData, title = 'Create Patient', submitting }) => {
  const [form, setForm] = useState<PatientForm>({ name: '', email: '', phone_no: '', password: '', dob: '', gender: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        phone_no: initialData.phone_no || '',
        password: '',
        dob: initialData.dob || '',
        gender: (initialData.gender as Gender) || '',
      });
    } else {
      setForm({ name: '', email: '', phone_no: '', password: '', dob: '', gender: '' });
    }
    setErrors({});
  }, [initialData, open]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.phone_no.trim()) e.phone_no = 'Phone No is required';
    // Password required only when creating (no initialData)
    if (!initialData) {
      if (!form.password || !form.password.trim()) e.password = 'Password is required';
      if (form.password && form.password.length < 6) e.password = 'Password must be at least 6 characters';
    } else if (form.password && form.password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    await onSubmit({ ...form, gender: form.gender || undefined, dob: form.dob || undefined });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone No</label>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.phone_no}
              onChange={e => setForm({ ...form, phone_no: e.target.value })}
            />
            {errors.phone_no && <p className="mt-1 text-sm text-red-600">{errors.phone_no}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password {initialData ? <span className="text-gray-400 text-xs">(leave blank to keep unchanged)</span> : null}</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.password || ''}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder={initialData ? 'Optional' : 'At least 6 characters'}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={form.dob || ''}
                onChange={e => setForm({ ...form, dob: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={form.gender || ''}
                onChange={e => setForm({ ...form, gender: e.target.value as Gender })}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientModal;