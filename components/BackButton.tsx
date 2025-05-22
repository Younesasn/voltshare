import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function BackButton() {
  return (
    <TouchableOpacity style={styles.back} onPress={() => router.back()}>
      <Ionicons
        name="arrow-back-outline"
        size={24}
        color={Colors["shady-950"]}
      />
      <ThemedText>Retour</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  back: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
});
