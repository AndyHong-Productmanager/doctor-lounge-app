import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { email: string; displayName: string; nicename: string } | null;
  setAuthenticated: (user: { email: string; displayName: string; nicename: string }) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  setAuthenticated: (user) => set({ isAuthenticated: true, user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  clearAuth: () => set({ isAuthenticated: false, user: null, isLoading: false }),
}));
