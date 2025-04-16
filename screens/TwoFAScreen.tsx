import { useAuth } from "@/context/AuthContext";
import { ThemedText } from "@/themes/ThemedText";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function TwoFAScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const { on2FA, authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const twoFa = async () => {
    try {
      setIsLoading(true);
      await on2FA!(Number(code));
      setIsLoading(false);
      router.navigate("/(app)")
    } catch (error: any) {
      console.log({ errorTwoFa: error.message });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ThemedText variant="title">Une dernière chose</ThemedText>
      <ThemedText style={{ textAlign: "center" }}>
        Nous vous avons envoyé un code par email. Entrez le code ci-dessous
      </ThemedText>
      <ThemedText>
        Connecté ? : {authState?.authenticated ? "Oui" : "Non"}
      </ThemedText>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="Code"
          style={styles.input}
          value={code}
          onChangeText={(number: string) => setCode(number)}
        />
        {isLoading ? (
          <ThemedText
            style={{
              backgroundColor: Colors["shady-950"],
              padding: 10,
              borderRadius: 6,
            }}
          >
            Validation...
          </ThemedText>
        ) : (
          <TouchableOpacity
            onPress={twoFa}
            style={{
              backgroundColor: Colors["shady-950"],
              padding: 10,
              borderRadius: 6,
            }}
          >
            <ThemedText color={Colors["shady-50"]}>Valider</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors["shady-50"],
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    gap: 10,
  },
  input: {
    borderColor: Colors["shady-900"],
    borderWidth: 1,
    height: 40,
    marginBottom: 20,
    borderRadius: 6,
    padding: 10,
    width: 200,
  },
});