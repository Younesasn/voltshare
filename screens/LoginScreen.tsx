import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { onLogin, authState } = useAuth();
  const router = useRouter();

  const login = async () => {
    try {
      setIsLoading(true);
      await onLogin!(email, password);
      setIsLoading(false);
      router.navigate("/twoFA");
    } catch (error: any) {
      console.log({ errorLogin: error.message });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Image
        source={require("../../assets/images/icon.png")}
        style={styles.image}
      /> */}
      <Text>Connectez-vous</Text>
      <ThemedText>
        Connecté ? : {authState?.authenticated ? "Oui" : "Non"}
      </ThemedText>

      <View style={{ display: "flex", width: "100%", padding: 20 }}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text: string) => setEmail(text)}
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text: string) => setPassword(text)}
          secureTextEntry={true}
          placeholder="Mot de passe"
        />
        {isLoading ? (
          <ThemedText>Connexion en cours...</ThemedText>
        ) : (
          <TouchableOpacity onPress={login}>
            <ThemedText>Se connecter</ThemedText>
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
  },
  image: {
    width: 100,
    height: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderColor: Colors["shady-900"],
    borderWidth: 1,
    height: 40,
    marginBottom: 20,
    borderRadius: 6,
    padding: 10,
  },
});
