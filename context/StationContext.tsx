import React, { createContext, useContext, useState, ReactNode, FC } from 'react';
import { Station } from '@/interfaces/Station';
import { getAllStations } from '@/services/StationService';
import { Alert } from 'react-native';

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
  const [loading, setLoading] = useState<boolean>(true);

  const refreshStations = async () => {
    try {
      setLoading(true);
      const res = await getAllStations();
      setStations(res.data.member);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.error("Erreur lors du rafraîchissement des stations :", err.message);
      Alert.alert("Erreur", "Impossible de récupérer les bornes.");
    }
  };

  return (
    <StationContext.Provider value={{ stations, loading, refreshStations }}>
      {children}
    </StationContext.Provider>
  );
}; 