import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const schema = z.object({
  email: z
    .string()
    .email({ message: "Email invalide" })
    .min(1, { message: "Email requis" }),
});

export default function ForgotPasswordScreen() {
  const { onForgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: { email: string }) => {
    try {
      setIsLoading(true);
      await onForgotPassword!(email);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log({ errorForgotPassword: error.message });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ThemedText variant="title">Mot de passe oublié</ThemedText>
        <ThemedText style={{ textAlign: "center" }}>
          Entrez votre email pour recevoir un lien de réinitialisation de mot de
          passe
        </ThemedText>
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
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            {errors.email && (
              <ThemedText style={{ color: "red" }}>
                {errors.email.message}
              </ThemedText>
            )}
            <Button title="Envoyer" onPress={handleSubmit(onSubmit)} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 20,
  },
  input: {
    borderColor: Colors["shady-900"],
    borderWidth: 1,
    height: 50,
    borderRadius: 6,
    padding: 10,
  },
});
