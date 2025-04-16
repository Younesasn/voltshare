import { ThemedText } from "@/themes/ThemedText";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReservationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedText variant="title">Réservations</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
