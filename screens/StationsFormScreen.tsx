import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { StationRegister } from "@/interfaces/Station";
import { searchLocation } from "@/services/SearchLocationService";
import { createStation } from "@/services/StationService";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FlatList,
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
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { z } from "zod";

export default function StationsFormScreen() {
  const [coords, setCoords] = useState<number[] | null>(null);
  const [searchResult, setSearchResult] = useState<[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, onRefreshing } = useAuth();
  const schema = z.object({
    name: z.string().min(1, "Le nom de la borne est requise"),
    adress: z.string().min(1, "L'adresse est requise"),
    price: z.string().regex(/^[0-9]+$/, "Prix invalide"),
    power: z.string().regex(/^[0-9]+$/, "Puissance invalide"),
    description: z.string().min(1, "La description est requise"),
    defaultMessage: z
      .string()
      .min(1, "Le message envoyé par défaut est requis"),
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const fetchSearchSuggestions = async (query: string) => {
    if (!query || query.length < 4) {
      setSearchResult(null);
      return;
    }

    try {
      const res = await searchLocation(query);
      const features = res.data.features;
      setSearchResult(features as any);
    } catch (error) {
      console.error("Erreur de recherche :", error);
      setSearchResult(null);
    }
  };

  const onSubmit = async ({
    name,
    adress,
    price,
    power,
    description,
    defaultMessage,
  }: {
    name: string;
    adress: string;
    price: string;
    power: string;
    description: string;
    defaultMessage: string;
  }) => {
    try {
      setLoading(true);
      const station: StationRegister = {
        name,
        latitude: coords ? coords[1] : 0,
        longitude: coords ? coords[0] : 0,
        adress,
        price: Number(price),
        power: Number(power),
        description,
        type: "Type 2",
        user: `/api/users/${user?.id}`,
        picture: "Super photo",
        defaultMessage,
      };
      await createStation(station);
      await onRefreshing!();
      setLoading(false);
      Toast.show({
        autoHide: true,
        type: "success",
        text1: "Borne créée !",
        text2: "Votre borne a été créée avec succès.",
        position: "top",
        visibilityTime: 5000,
      });
      router.back();
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={10}
          style={styles.container}
        >
          <BackButton />
          <ScrollView>
            <View style={{ flex: 1, gap: 20 }}>
              <ThemedText variant="title">Créez votre borne</ThemedText>
              <View style={{ display: "flex", gap: 20 }}>
                <View style={{ gap: 10 }}>
                  <ThemedText>Nom de la borne</ThemedText>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Borne n1"
                        placeholderTextColor={Colors["shady-900"]}
                      />
                    )}
                  />
                  {errors.name && (
                    <ThemedText style={styles.error}>
                      {errors.name.message}
                    </ThemedText>
                  )}
                </View>
                <View>
                  <View style={{ gap: 10 }}>
                    <ThemedText>Adresse</ThemedText>
                    <Controller
                      control={control}
                      name="adress"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={styles.input}
                          onBlur={onBlur}
                          onChangeText={(text) => {
                            onChange(text);
                            fetchSearchSuggestions(text);
                          }}
                          value={value}
                          placeholder="1 rue de Troie 93002 Tiernon"
                          placeholderTextColor={Colors["shady-900"]}
                        />
                      )}
                    />
                    {errors.adress && (
                      <ThemedText style={styles.error}>
                        {errors.adress.message}
                      </ThemedText>
                    )}
                  </View>
                  {searchResult && (
                    <FlatList
                      scrollEnabled={false}
                      data={searchResult}
                      keyExtractor={(item, index) =>
                        item.properties.id || index.toString()
                      }
                      renderItem={({ item }: { item: any }) => (
                        <TouchableOpacity
                          onPress={() => {
                            Keyboard.dismiss();
                            const [lon, lat] = item.geometry.coordinates;
                            setValue("adress", item.properties.label);
                            setCoords([lon, lat]);
                            setSearchResult(null);
                          }}
                          style={{
                            padding: 10,
                            borderBottomWidth: 1,
                            borderColor: Colors["shady-400"],
                          }}
                        >
                          <ThemedText>{item.properties.label}</ThemedText>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </View>
                <View style={{ gap: 10 }}>
                  <ThemedText>Description</ThemedText>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Description"
                        placeholderTextColor={Colors["shady-900"]}
                      />
                    )}
                  />
                  {errors.description && (
                    <ThemedText style={styles.error}>
                      {errors.description.message}
                    </ThemedText>
                  )}
                </View>
                <View style={{ gap: 10 }}>
                  <ThemedText>Puissance de charge (kw)</ThemedText>
                  <Controller
                    control={control}
                    name="power"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="22"
                        placeholderTextColor={Colors["shady-900"]}
                        keyboardType="numeric"
                      />
                    )}
                  />
                  {errors.power && (
                    <ThemedText style={styles.error}>
                      {errors.power.message}
                    </ThemedText>
                  )}
                </View>
                <View style={{ gap: 10 }}>
                  <ThemedText>Prix/h</ThemedText>
                  <Controller
                    control={control}
                    name="price"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="5"
                        placeholderTextColor={Colors["shady-900"]}
                        keyboardType="numeric"
                      />
                    )}
                  />
                  {errors.price && (
                    <ThemedText style={styles.error}>
                      {errors.price.message}
                    </ThemedText>
                  )}
                </View>
                <View style={{ gap: 14 }}>
                  <View style={{ gap: 4 }}>
                    <ThemedText>Message par défaut</ThemedText>
                    <ThemedText variant="lilText">Ceci est un texte</ThemedText>
                  </View>
                  <Controller
                    control={control}
                    name="defaultMessage"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Bonjour, merci d'avoir réservé notre borne !"
                        placeholderTextColor={Colors["shady-900"]}
                      />
                    )}
                  />
                  {errors.defaultMessage && (
                    <ThemedText style={styles.error}>
                      {errors.defaultMessage.message}
                    </ThemedText>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
          <Button
            title="Valider"
            isLoading={loading}
            onPress={handleSubmit(onSubmit)}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
