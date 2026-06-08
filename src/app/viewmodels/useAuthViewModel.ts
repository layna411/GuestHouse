import { useState } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';
import { toast } from 'sonner';

type AppState = 'login' | 'dashboard' | 'landing-page';

export function useAuthViewModel() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('appState') as AppState;
    return saved ? saved : 'landing-page';
  });

  const [loading, setLoading] = useState(false);

  const handleSetAppState = (state: AppState) => {
    setAppState(state);
    localStorage.setItem('appState', state);
  };

  const handleLogin = async (email: string, password_hash: string) => {
    setLoading(true);
    try {
      const user = await authApi.login({
        email,
        password_hash
      });
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      handleSetAppState('dashboard');
      toast.success(`Welcome back, ${user.name}!`);
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    handleSetAppState('landing-page');
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
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
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
    setAppState: handleSetAppState
  };
}
