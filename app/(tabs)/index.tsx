import { ThemedText } from "@/themes/ThemedText";
import { StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <ThemedText variant="title">Recharger</ThemedText>
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
