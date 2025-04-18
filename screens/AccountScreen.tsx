import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  const { onLogout, user } = useAuth();
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image
            source={require("../assets/images/avatar.avif")}
            style={styles.image}
          />
          <View>
            <ThemedText variant="title">{user?.firstname}</ThemedText>
            <ThemedText variant="title">{user?.lastname}</ThemedText>
          </View>
        </View>
        <TouchableOpacity onPress={onLogout}>
        <ThemedText variant="text">Déconnexion</ThemedText>
      </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors["shady-950"]
  }
});
