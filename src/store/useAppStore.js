import { create } from 'zustand';

const useAppStore = create((set) => ({
  // Filtre actif sur la liste des notes 
  activeFilter: 'all',
  setActiveFilter: (filter) => set({ activeFilter: filter }),

  // Thème  
  theme: 'light',
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  // Recherche 
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export default useAppStore;