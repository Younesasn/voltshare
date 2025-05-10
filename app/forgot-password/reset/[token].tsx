import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { UserPasswordToken } from "@/interfaces/User";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { z } from "zod";

const schema = z
  .object({
    password: z.string().min(8, "Minimum 8 caractères"),
    confirmPassword: z.string().min(8, "Confirme ton mot de passe"),
  })
  .refine((form) => form.password === form.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export default function Reset() {
  const { token } = useLocalSearchParams();
  const newToken = String(token);
  const router = useRouter();
  const { onChangePassword, onLogin, inProgressChangingPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<any>();
  const [emailUser, setEmailUser] = useState<string>("");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
  });

  // Vérifie si le token est valide
  const validator = async () => {
    const result = await inProgressChangingPassword!(newToken);
    console.log(result);
    setIsValid(result);
    if(result.user) {
      setEmailUser(result.user.email);
    }
  };

  useEffect(() => {
    validator();
  }, [newToken]);

  const onSubmit = async ({ password }: any) => {
    try {
      setIsLoading(true);
      const result = await onChangePassword!(newToken, password);
      if (result.error) {
        console.log({ result });
        setIsLoading(false);
        return;
      }
      await onLogin!(emailUser, password);
      setIsLoading(false);
      Toast.show({
        autoHide: true,
        type: "success",
        text1: "Mot de passe modifié",
        text2: "Votre mot de passe a été modifié avec succès.",
        position: "top",
        visibilityTime: 5000,
      });
      router.replace("/twoFA");
    } catch (error: any) {
      console.log({ error });
      setIsLoading(false);
    }
  };

  if (isValid === false) {
    return <Redirect href="/(app)" />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <ThemedText variant="title">
              Créez votre nouveau mot de passe
            </ThemedText>
            <ThemedText>
              Votre nouveau mot de passe doit être différent de votre mot de
              passe précédent.
            </ThemedText>
          </View>

          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Nouveau mot de passe"
                  placeholderTextColor={Colors["shady-900"]}
                  secureTextEntry
                />
              )}
            />
            {errors.password && (
              <ThemedText color="red">{errors.password.message}</ThemedText>
            )}
            <View style={{ marginBottom: 10, gap: 10 }}>
              <ThemedText color={Colors["shady-700"]}>
                Au moins 12 caractères
              </ThemedText>
              <ThemedText color={Colors["shady-700"]}>
                Au moins une majuscule
              </ThemedText>
              <ThemedText color={Colors["shady-700"]}>
                Au moins un chiffre
              </ThemedText>
              <ThemedText color={Colors["shady-700"]}>
                Au moins un caractère spécial
              </ThemedText>
            </View>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Confirmer le mot de passe"
                  placeholderTextColor={Colors["shady-900"]}
                  secureTextEntry
                />
              )}
            />
            {errors.confirmPassword && (
              <ThemedText color="red">
                {errors.confirmPassword.message}
              </ThemedText>
            )}
          </View>
          <Button
            title="Valider"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 40,
  },
  input: {
    borderColor: Colors["shady-900"],
    borderWidth: 1,
    height: 50,
    borderRadius: 6,
    padding: 10,
  },
});
