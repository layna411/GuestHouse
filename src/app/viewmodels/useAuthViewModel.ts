import { useState } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';
import { toast } from 'sonner';

type AppState = 'login' | 'dashboard' | 'landing-page';

export function useAuthViewModel() {
  const [appState, setAppState] = useState<AppState>('landing-page');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password_hash: string) => {
    setLoading(true);
    try {
      const user = await authApi.login({
        email,
        password_hash
      });
      setCurrentUser(user);
      setAppState('dashboard');
      toast.success(`Welcome back, ${user.name}!`);
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAppState('landing-page');
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
    currentUser,
    loading,
    handleLogin,
    handleLogout,
    handleUpdateProfile,
    setAppState
  };
}
