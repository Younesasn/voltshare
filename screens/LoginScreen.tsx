import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/Button";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const schema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email requis",
    })
    .email({ message: "Email invalide" }),
  password: z.string().min(1, { message: "Mot de passe requis" }),
});
const screenWidth = Dimensions.get("window").width;
type LoginFormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { onLogin } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = async ({ email, password }: LoginFormValues) => {
    try {
      setIsLoading(true);
      const result = await onLogin!(email, password);
      if (result.error) {
        setIsLoading(false);
        setLoginError("Email ou mot de passe incorrect");
        return;
      }
      setIsLoading(false);
      router.replace("/twoFA");
    } catch (error: any) {
      setIsLoading(false);
      console.log({ errorLogin: error.message });
      setLoginError("Une erreur est survenue, veuillez réessayer.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require("../assets/images/borne.avif")}
            style={styles.image}
          />

          <View style={styles.content}>
            <View>
              <ThemedText variant="title">Se connecter</ThemedText>
            </View>
            <View style={{ flexDirection: "column", gap: 10 }}>
              <Controller
                control={control}
                name="email"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Email"
                    placeholderTextColor={Colors["shady-900"]}
                  />
                )}
              />
              {errors.email && (
                <ThemedText style={styles.error}>
                  {errors.email.message}
                </ThemedText>
              )}
            </View>
            <View style={{ flexDirection: "column", gap: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => router.navigate("/forgot-password")}
                >
                  <ThemedText>Mot de passe oublié ?</ThemedText>
                </TouchableOpacity>
              </View>
              <Controller
                control={control}
                name="password"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.input}>
                    <TextInput
                      style={{ width: "90%" }}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Mot de passe"
                      placeholderTextColor={Colors["shady-900"]}
                      secureTextEntry={!isVisible}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setIsVisible(!isVisible);
                      }}
                    >
                      {isVisible ? (
                        <FontAwesome6
                          name="eye-slash"
                          size={20}
                          color="black"
                        />
                      ) : (
                        <FontAwesome6 name="eye" size={20} color="black" />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <ThemedText style={styles.error}>
                  {errors.password.message}
                </ThemedText>
              )}
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {loginError && (
                <ThemedText style={styles.error}>{loginError}</ThemedText>
              )}
              <Button
                title="Se connecter"
                onPress={handleSubmit(login)}
                isLoading={isLoading}
              />
              <TouchableOpacity
                onPress={() => router.navigate("/register")}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                <ThemedText>Vous n'avez pas de compte ?</ThemedText>
                <ThemedText>Inscrivez-vous</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors["shady-50"],
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  image: {
    width: screenWidth,
    height: 300,
    alignSelf: "stretch",
  },
  content: {
    height: "50%",
    width: "100%",
    padding: 20,
    gap: 25,
    display: "flex",
    justifyContent: "center",
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: Colors["shady-900"],
    borderWidth: 1,
    height: 50,
    borderRadius: 6,
    padding: 10,
  },
  error: {
    color: "red",
  },
});
