import Button from "@/components/Button";
import { ThemedText } from "@/themes/ThemedText";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CancelPage() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedText variant="title" isCenter>
        Le paiment a malheureusement échoué...
      </ThemedText>
      <ThemedText>Veuillez réessayez la réservation</ThemedText>
      <Button
        title="Retourner à la carte"
        onPress={() => {
          router.replace("/");
        }}
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