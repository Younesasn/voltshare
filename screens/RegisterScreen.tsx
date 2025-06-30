import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { UserRegister } from "@/interfaces/User";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const schema = z
  .object({
    firstname: z.string().min(1, "Le prénom est requis"),
    lastname: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Minimum 8 caractères"),
    confirmPassword: z.string().min(8, "Confirme ton mot de passe"),
    adress: z.string().min(1, "L’adresse est requise"),
    tel: z.string().regex(/^[0-9]+$/, "Numéro invalide"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export default function RegisterScreen() {
  const router = useRouter();
  const { onRegister } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisiblePass, setIsVisiblePass] = useState<boolean>(false);
  const [isVisibleConfirmPass, setIsVisibleConfirmPass] =
    useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const register = async ({
    firstname,
    lastname,
    email,
    password,
    adress,
    tel,
  }: UserRegister) => {
    try {
      setIsLoading(true);
      const result = await onRegister!({
        firstname,
        lastname,
        email,
        password,
        adress,
        tel,
      });
      if (result.error) {
        setIsLoading(false);
        setRegisterError(result.message);
        return;
      }
      setIsLoading(false);
      router.navigate("/twoFA");
    } catch (error: any) {
      setIsLoading(false);
      console.log({ errorRegister: error.message });
      setRegisterError("Une erreur est survenue, veuillez réessayer.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <BackButton />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <View style={styles.contentTitle}>
                <ThemedText variant="title">Créer un compte</ThemedText>
              </View>
              <View style={styles.form}>
                <View style={styles.inputContain}>
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
                </View>
                <View style={styles.inputContain}>
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
                <View style={styles.inputContain}>
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
                <View style={styles.inputContain}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.input}>
                        <TextInput
                          onBlur={onBlur}
                          style={{ width: "90%" }}
                          onChangeText={onChange}
                          value={value}
                          placeholder="Mot de passe"
                          placeholderTextColor={Colors["shady-900"]}
                          secureTextEntry={!isVisiblePass}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            setIsVisiblePass(!isVisiblePass);
                          }}
                        >
                          {isVisiblePass ? (
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
                    <Text style={styles.error}>{errors.password.message}</Text>
                  )}
                </View>
                <View style={styles.inputContain}>
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.input}>
                        <TextInput
                          onBlur={onBlur}
                          style={{ width: "90%" }}
                          onChangeText={onChange}
                          value={value}
                          placeholder="Confirmez le mot de passe"
                          placeholderTextColor={Colors["shady-900"]}
                          secureTextEntry={!isVisibleConfirmPass}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            setIsVisibleConfirmPass(!isVisibleConfirmPass);
                          }}
                        >
                          {isVisibleConfirmPass ? (
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
                  {errors.confirmPassword && (
                    <Text style={styles.error}>
                      {errors.confirmPassword.message}
                    </Text>
                  )}
                </View>
                <View style={styles.inputContain}>
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
                <View style={styles.inputContain}>
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
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 20,
                    justifyContent: "center",
                  }}
                >
                  <View style={{ display: "flex", gap: 20, width: "100%" }}>
                    {registerError && (
                      <ThemedText style={styles.error}>
                        {registerError}
                      </ThemedText>
                    )}
                    <Button
                      title="Créer un compte"
                      onPress={handleSubmit(register)}
                      isLoading={isLoading}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  contentTitle: {
    marginBottom: 20,
  },
  form: {
    width: "100%",
    gap: 20,
  },
  inputContain: {
    gap: 6,
    width: "100%",
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
