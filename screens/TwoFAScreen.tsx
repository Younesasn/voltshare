import { useAuth } from "@/context/AuthContext";
import { ThemedText } from "@/themes/ThemedText";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Colors } from "@/themes/Colors";
import Button from "@/components/Button";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// === Zod schema ===
const schema = z.object({
  code: z
    .string()
    .min(1, { message: "Code requis" })
    .regex(/^\d+$/, { message: "Le code doit être numérique" }),
});

type TwoFAFormValues = z.infer<typeof schema>;

export default function TwoFAScreen() {
  const router = useRouter();
  const { on2FA } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [twoFaError, setTwoFaError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFAFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
    },
  });

  const twoFa = async ({ code }: TwoFAFormValues) => {
    try {
      setIsLoading(true);
      const result = await on2FA!(Number(code));
      if (result.error) {
        setIsLoading(false);
        setTwoFaError("Code invalide");
        return;
      }
      setIsLoading(false);
      router.navigate("/(app)");
    } catch (error: any) {
      setIsLoading(false);
      console.log({ errorTwoFa: error.message });
      setTwoFaError("Une erreur est survenue, veuillez réessayer.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedText variant="title">Une dernière chose</ThemedText>
          <ThemedText style={{ textAlign: "center" }}>
            Nous vous avons envoyé un code par email. Entrez le code ci-dessous
          </ThemedText>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              marginTop: 20,
            }}
          >
            <Controller
              control={control}
              name="code"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Code"
                  keyboardType="numeric"
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.code && (
              <Text style={styles.error}>{errors.code.message}</Text>
            )}
            {twoFaError && <Text style={styles.error}>{twoFaError}</Text>}
            <Button
              title="Valider"
              onPress={handleSubmit(twoFa)}
              isLoading={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors["shady-50"],
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  input: {
    borderColor: Colors["shady-900"],
    borderWidth: 1,
    height: 50,
    borderRadius: 6,
    padding: 10,
    width: 200,
    textAlign: "center",
  },
  error: {
    color: "red",
  },
});
