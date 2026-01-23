import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { Station } from "@/interfaces/Station";
import { searchLocation } from "@/services/SearchLocationService";
import { getStationById, updateStation } from "@/services/StationService";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
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

export default function EditStation() {
  const { id } = useLocalSearchParams();
  const newId = parseInt(id as string);
  const { user, onRefreshing } = useAuth();
  const [station, setStation] = useState<Station | null>(null);
  const [searchResult, setSearchResult] = useState<[] | null>(null);
  const [coords, setCoords] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const schema = z.object({
    name: z.string().min(1, "Le nom de la borne est requise"),
    adress: z.string().min(1, "L'adresse est requise"),
    price: z.number().min(1, "Prix invalide"),
    power: z.number().min(1, "Puissance invalide"),
    description: z.string().min(1, "La description est requise"),
    defaultMessage: z
      .string()
      .min(1, "Le message envoyé par défaut est requis"),
  });
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      adress: "",
      price: 0,
      power: 0,
      description: "",
      defaultMessage: "",
    },
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

  const onSubmit = async (data: {
    name: string;
    adress: string;
    price: number;
    power: number;
    description: string;
    defaultMessage: string;
  }) => {
    try {
      setLoading(true);
      const res = await searchLocation(data.adress);
      const features = res.data.features;
      await updateStation(station?.id as number, {
        user: `/api/users/${user?.id}`,
        adress: data.adress ?? station?.adress,
        description: data.adress ?? station?.adress,
        name: data.name ?? station?.name,
        picture: station?.picture as string,
        power: data.power ?? station?.power,
        price: data.price ?? station?.price,
        type: station?.type ?? "Type 2",
        latitude: coords ? coords[1] : features[0].geometry.coordinates[1],
        longitude: coords ? coords[0] : features[0].geometry.coordinates[0],
        defaultMessage: data.defaultMessage ?? station?.defaultMessage,
      });
      await onRefreshing!();
      setLoading(false);
      Toast.show({
        autoHide: true,
        type: "success",
        text1: "Borne modifiée !",
        text2: "Votre borne a été modifiée avec succès.",
        position: "top",
        visibilityTime: 5000,
      });
      router.back();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getStationById(newId)
      .then((res) => {
        setStation(res.data);
        reset({
          name: res.data.name || "",
          adress: res.data.adress || "",
          price: res.data.price || 0,
          power: res.data.power || 0,
          description: res.data.description || "",
          defaultMessage: res.data.defaultMessage || "",
        });
      })
      .catch((err) => {
        console.error(
          "Erreur lors de la récupération du station :",
          err.message
        );
        Alert.alert("Erreur", "Impossible de récupérer les informations.");
      });
  }, []);

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
              <ThemedText variant="title">Modifiez votre borne</ThemedText>
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
                        style={[styles.input, { height: 100 }]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        multiline
                        numberOfLines={10}
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
                        onChangeText={(text) => onChange(Number(text))}
                        inputMode="numeric"
                        value={value !== undefined ? String(value) : ""}
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
                  <ThemedText>Prix/h (€)</ThemedText>
                  <Controller
                    control={control}
                    name="price"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={(text) => onChange(Number(text))}
                        value={value !== undefined ? String(value) : ""}
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
