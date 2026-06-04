import { useState } from 'react';
import { User, UserRole } from '../types';
import { authApi } from '../services/api';
import { toast } from 'sonner';

type AppState = 'splash' | 'role-selection' | 'login' | 'dashboard';

export function useAuthViewModel() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSplashComplete = () => {
    setAppState('login');
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAppState('login');
  };

  const handleLogin = async (email: string, password_hash: string) => {
    setLoading(true);
    try {
      const user = await authApi.login({
        email,
        password_hash
      });
      setCurrentUser(user);
      setSelectedRole(user.role);
      setAppState('dashboard');
      toast.success(`Welcome back, ${user.name}!`);
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRoleSelection = () => {
    setAppState('role-selection');
    setSelectedRole(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedRole(null);
    setAppState('login');
    toast.success('Logged out successfully');
  };

  const handleUpdateProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const updatedUser = await authApi.updateProfile({
        ...data,
        id: currentUser.id
      });
      setCurrentUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return {
    appState,
    selectedRole,
    currentUser,
    loading,
    handleSplashComplete,
    handleRoleSelect,
    handleLogin,
    handleBackToRoleSelection,
    handleLogout,
    handleUpdateProfile
  };
}
