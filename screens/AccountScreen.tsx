import { useAuth } from "@/context/AuthContext";
import { ThemedText } from "@/themes/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function AccountScreen() {
  const {onLogout} = useAuth()
  return (
    <View style={styles.container}>
      <ThemedText variant="title">Compte</ThemedText>
      <TouchableOpacity onPress={onLogout}>
        <ThemedText variant="text">Déconnexion</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
