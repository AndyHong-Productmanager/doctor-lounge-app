import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { email: string; displayName: string; nicename: string } | null;
  deviceToken: string | null;
  setAuthenticated: (user: { email: string; displayName: string; nicename: string }) => void;
  setLoading: (loading: boolean) => void;
  setDeviceToken: (token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  deviceToken: null,
  setAuthenticated: (user) => set({ isAuthenticated: true, user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setDeviceToken: (deviceToken) => set({ deviceToken }),
  clearAuth: () => set({ isAuthenticated: false, user: null, deviceToken: null, isLoading: false }),
}));
