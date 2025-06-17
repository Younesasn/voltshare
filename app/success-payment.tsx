import Button from "@/components/Button";
import { ThemedText } from "@/themes/ThemedText";
import { router, useNavigation } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useReservationRefresh } from "@/hooks/useReservationRefresh";

export default function SuccesPage() {
  const { refreshAllData } = useReservationRefresh();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
    refreshAllData();
  }, []);

  const handleReturnToMap = () => {
    router.replace("/(app)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText variant="title">Merci d'avoir choisi Voltshare !</ThemedText>
      <ThemedText>
        Un message vous a été envoyé par l'hôte de la borne
      </ThemedText>
      <Button
        title="Retourner à la carte"
        onPress={handleReturnToMap}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});