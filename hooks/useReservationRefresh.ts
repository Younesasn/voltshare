import { useAuth } from "@/context/AuthContext";
import { useStations } from "@/context/StationContext";

export const useReservationRefresh = () => {
  const { onRefreshing } = useAuth();
  const { refreshStations } = useStations();

  const refreshAllData = async () => {
    try {
      // Rafraîchir les données utilisateur
      if (onRefreshing) {
        await onRefreshing();
      }
      
      // Rafraîchir les données des stations
      await refreshStations();
      
      console.log("✅ Toutes les données ont été rafraîchies avec succès");
    } catch (error) {
      console.error("❌ Erreur lors du rafraîchissement des données:", error);
    }
  };

  return { refreshAllData };
}; 