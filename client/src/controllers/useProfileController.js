import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const STATUS_COLORS = {
  Delivered: 'bg-green-100 text-green-700',
  'In Preparation': 'bg-amber-100 text-amber-700',
  'Ready for Pickup': 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-700',
};

/**
 * Controller managing Profile navigation tabs, editing states, and profile saves
 */
export function useProfileController() {
  const { user, isLoggedIn, logout, updateProfile, setIsLoginOpen } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });

  const startEditing = () => {
    if (user) {
      setEditForm({ name: user.name, email: user.email, phone: user.phone });
    }
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const saveProfile = () => {
    updateProfile(editForm);
    setEditing(false);
  };

  return {
    user,
    isLoggedIn,
    logout,
    setIsLoginOpen,
    activeTab,
    setActiveTab,
    editing,
    editForm,
    setEditForm,
    startEditing,
    cancelEditing,
    saveProfile,
    statusColors: STATUS_COLORS,
  };
}
