import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PERSONAS, DEFAULT_PERSONA, DEFAULT_SETTINGS } from './config';

const STORAGE_KEY = 'xetra-chat-storage';

const useStore = create(
  persist(
    (set, get) => ({
      // Dark mode state
      darkMode: true,
      toggleDarkMode: () => {
        const current = get().darkMode;
        document.documentElement.classList.toggle('dark', !current);
        set({ darkMode: !current });
      },

      // Persona management
      currentPersona: DEFAULT_PERSONA,
      personas: PERSONAS,
      setPersona: (persona) => set({ currentPersona: persona }),
      
      // Chat history
      messages: [],
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      clearMessages: () => set({ messages: [] }),
      
      // UI State
      isSidebarOpen: false,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      // Settings
      settings: DEFAULT_SETTINGS,
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      }))
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        darkMode: state.darkMode,
        currentPersona: state.currentPersona,
        settings: state.settings
      }),
      version: 1, // Increment if you need to reset storage on updates
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Migration logic if needed
          return {
            ...persistedState,
            // Reset or transform old state here
          };
        }
        return persistedState;
      }
    }
  )
);

// Initialize dark mode on load
const initializeApp = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (savedState?.state?.darkMode !== undefined) {
      document.documentElement.classList.toggle('dark', savedState.state.darkMode);
    }
  } catch (error) {
    console.error('Failed to initialize app state:', error);
    // Reset to default state on error
    localStorage.removeItem(STORAGE_KEY);
    document.documentElement.classList.remove('dark');
  }
};

initializeApp();

export default useStore;
