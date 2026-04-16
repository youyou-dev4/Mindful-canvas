import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { seedIfEmpty } from './src/services/storage';
import AppNavigator from './src/navigation/AppNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30, // 30 secondes
    },
  },
});

export default function App() {
  useEffect(() => {
    seedIfEmpty(); // charge les données par défaut au premier lancement
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
    </QueryClientProvider>
  );
}