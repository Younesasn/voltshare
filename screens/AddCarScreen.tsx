import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { Car } from "@/interfaces/Car";
import { User } from "@/interfaces/User";
import { createCar } from "@/services/CarService";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as z from "zod";

const schema = z.object({
  model: z.string().min(1, { message: "Modèle requis" }),
});

export default function AddCarScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, onRefreshing } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      model: "",
    },
  });

  const onSubmit = async ({ model }: any) => {
    try {
      setIsLoading(true);
      const car = {
        model: model,
        user: "/api/users/" + user?.id,
      };
      const result = await createCar(car);
      if (result.data.error) {
        setIsLoading(false);
        return;
      }
      await onRefreshing!();
      setIsLoading(false);
      Toast.show({
        autoHide: true,
        type: "success",
        text1: "Voiture ajoutée",
        text2: "Votre voiture a été ajoutée avec succès.",
        position: "top",
        visibilityTime: 5000,
      });
      router.back();
    } catch (error: any) {
      setIsLoading(false);
      console.log({ error });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: 18,
        }}
      >
        <View style={styles.container}>
          <ThemedText variant="title">Ajouter votre voiture</ThemedText>
          <Controller
            control={control}
            name="model"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Modèle"
                placeholderTextColor={Colors["shady-900"]}
              />
            )}
          />
          {errors.model && (
            <Text style={{ color: "red" }}>{errors.model.message}</Text>
          )}
          <View style={{ display: "flex", flexDirection: "row", gap: 20 }}>
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
              title="Ajouter"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.3,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  input: {
    borderColor: Colors["shady-900"],
    borderWidth: 1,
    height: 50,
    width: "60%",
    borderRadius: 6,
    padding: 10,
  },
});
