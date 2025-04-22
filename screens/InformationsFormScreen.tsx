import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { UserRegister } from "@/interfaces/User";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { z } from "zod";

export default function InformationsFormScreen() {
  const { user, onUpdating, onRefreshing } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [updatingError, setUpdatingError] = useState<string | null>(null);
  const schema = z.object({
    firstname: z.string().min(1, "Le prénom est requis"),
    lastname: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    adress: z.string().min(1, "L’adresse est requise"),
    tel: z.string().regex(/^[0-9]+$/, "Numéro invalide"),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: user,
  });

  useEffect(() => {
    if (user) {
      reset({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        adress: user.adress || "",
        tel: user.tel || "",
      });
    }
  }, [user]);

  const update = async ({
    firstname,
    lastname,
    email,
    adress,
    tel,
  }: UserRegister) => {
    try {
      setIsLoading(true);
      const result = await onUpdating!(user?.id, {
        firstname,
        lastname,
        email,
        adress,
        tel,
      });
      if (result.error) {
        setIsLoading(false);
        setUpdatingError(result.message);
        return;
      }
      await onRefreshing!();
      setIsLoading(false);
      Toast.show({
        autoHide: true,
        type: "success",
        text1: "Informations mises à jour",
        text2: "Vos informations ont été mises à jour avec succès.",
        position: "top",
        visibilityTime: 5000,
      });
    } catch (error: any) {
      setIsLoading(false);
      console.log({ errorUpdating: error.message });
      setUpdatingError("Une erreur est survenue, veuillez réessayer.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.container}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ThemedText variant="title">Modifier mes informations</ThemedText>
            <View style={styles.inputContain}>
              <View style={{ gap: 20 }}>
                <ThemedText>Identité</ThemedText>
                <Controller
                  control={control}
                  name="firstname"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Prénom"
                      placeholderTextColor={Colors["shady-900"]}
                    />
                  )}
                />
                {errors.firstname && (
                  <Text style={styles.error}>{errors.firstname.message}</Text>
                )}
                <Controller
                  control={control}
                  name="lastname"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Nom"
                      placeholderTextColor={Colors["shady-900"]}
                    />
                  )}
                />
                {errors.lastname && (
                  <Text style={styles.error}>{errors.lastname.message}</Text>
                )}
              </View>
              <View style={{ gap: 20 }}>
                <View style={{ gap: 8 }}>
                  <ThemedText>Email</ThemedText>
                  <ThemedText>
                    Votre email sera utilisé pour vous connecter et pour envoyer
                    des notifications.
                  </ThemedText>
                </View>
                <Controller
                  control={control}
                  name="email"
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
                  <Text style={styles.error}>{errors.email.message}</Text>
                )}
              </View>
              <View style={{ gap: 20 }}>
                <ThemedText>Adresse de facturation</ThemedText>
                <Controller
                  control={control}
                  name="adress"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Adresse"
                      placeholderTextColor={Colors["shady-900"]}
                    />
                  )}
                />
                {errors.adress && (
                  <Text style={styles.error}>{errors.adress.message}</Text>
                )}
              </View>
              <View style={{ gap: 20 }}>
                <ThemedText>Numéro de téléphone</ThemedText>
                <Controller
                  control={control}
                  name="tel"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Téléphone"
                      placeholderTextColor={Colors["shady-900"]}
                      keyboardType="numeric"
                    />
                  )}
                />
                {errors.tel && (
                  <Text style={styles.error}>{errors.tel.message}</Text>
                )}
              </View>
            </View>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                borderWidth: 1,
                borderColor: Colors["shady-950"],
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
            >
              <ThemedText>Retour</ThemedText>
            </TouchableOpacity>
            <Button
              title="Valider"
              isLoading={isLoading}
              onPress={handleSubmit(update)}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputContain: {
    gap: 40,
    width: "100%",
    padding: 20,
  },
  input: {
    width: "100%",
    borderColor: Colors["shady-900"],
    borderWidth: 1,
    height: 50,
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  error: {
    color: "red",
    fontSize: 12,
  },
});
