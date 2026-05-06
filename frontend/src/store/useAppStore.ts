import { create } from 'zustand';
import { TravelRequestPayload, TravelResponse, generateExperience } from '@/services/api';

type AppStatus = 'idle' | 'loading' | 'success' | 'error';

interface AppState {
  status: AppStatus;
  data: TravelResponse | null;
  error: string | null;
  loadingStep: number;
  
  // Actions
  submitRequest: (payload: TravelRequestPayload) => Promise<void>;
  reset: () => void;
  setLoadingStep: (step: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  status: 'idle',
  data: null,
  error: null,
  loadingStep: 0,

  submitRequest: async (payload: TravelRequestPayload) => {
    set({ status: 'loading', error: null, data: null, loadingStep: 0 });
    
    try {
      const result = await generateExperience(payload);
      set({ status: 'success', data: result, loadingStep: 4 });
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to generate experience.';
      set({ status: 'error', error: message });
    }
  },

  reset: () => {
    set({ status: 'idle', data: null, error: null, loadingStep: 0 });
  },

  setLoadingStep: (step: number) => {
    set({ loadingStep: step });
  }
}));
