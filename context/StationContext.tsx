import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, ReactNode, FC } from 'react';
import { Station } from '@/interfaces/Station';
import { getAllStations } from '@/services/StationService';
import { useAuth } from './AuthContext';

interface StationContextType {
  stations: Station[];
  loading: boolean;
  refreshStations: () => Promise<void>;
}

const StationContext = createContext<StationContextType | undefined>(undefined);

export const useStations = () => {
  const context = useContext(StationContext);
  if (!context) {
    throw new Error('useStations must be used within a StationProvider');
  }
  return context;
};

export const StationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { authState } = useAuth();

  const refreshStations = useCallback(async () => {
    // Ne pas essayer de récupérer les stations si l'utilisateur n'est pas connecté
    // authState.authenticated peut être null (en cours de chargement), false (non connecté) ou true (connecté)
    if (!authState || authState.authenticated !== true) {
      console.log("🔒 Stations non chargées - utilisateur non authentifié", authState?.authenticated);
      setStations([]);
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Chargement des stations...");
      setLoading(true);
      const res = await getAllStations();
      console.log("✅ Stations chargées:", res.data.member?.length || 0, "stations");
      setStations(res.data.member);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      // Ne pas afficher d'alerte si l'erreur est due à une non-authentification (401)
      // C'est normal si l'utilisateur n'est pas connecté
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        console.error("❌ Erreur lors du rafraîchissement des stations :", err.message);
      } else {
        console.log("🔒 Erreur d'authentification (401/403) - normal si non connecté");
      }
      setStations([]);
    }
  }, [authState]);

  // Charger automatiquement les stations quand l'utilisateur se connecte
  useEffect(() => {
    if (authState && authState.authenticated === true) {
      console.log("🔄 StationProvider - Chargement automatique des stations");
      refreshStations();
    }
  }, [authState?.authenticated, refreshStations]);

  const contextValue = useMemo(
    () => ({ stations, loading, refreshStations }),
    [stations, loading, refreshStations]
  );

  return (
    <StationContext.Provider value={contextValue}>
      {children}
    </StationContext.Provider>
  );
}; 