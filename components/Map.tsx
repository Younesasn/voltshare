import { Colors } from "@/themes/Colors";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Octicons from "@expo/vector-icons/Octicons";
import { ThemedText } from "@/themes/ThemedText";
import { Link } from "expo-router";
import { getAllStations } from "@/services/StationService";
import { useEffect, useMemo, useRef, useState } from "react";
import { Station } from "@/interfaces/Station";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { searchLocation } from "@/services/SearchLocationService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";

export function Map() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const [searchCoords, setSearchCoords] = useState<number[] | null>(null);
  const [searchResult, setSearchResult] = useState<[] | null>(null);
  const schema = z.object({
    address: z.string().min(1, "Veuillez saisir une adresse"),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      address: "",
    },
  });

  const refreshStations = async () => {
    try {
      setLoading(true);
      const res = await getAllStations();
      setStations(res.data.member);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.error("Erreur lors du rafraîchissement :", err.message);
      Alert.alert("Erreur", "Impossible de récupérer les bornes.");
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLocation(location);

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.0421,
        },
        1000
      );
    }
  };

  const getSearchLocation = async ({ address }: { address: string }) => {
    try {
      const res = await searchLocation(address);
      const coords = res.data.features[0].geometry.coordinates;
      setSearchCoords(coords);

      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: coords[1],
            longitude: coords[0],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      }
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
    }
  };

  const fetchSearchSuggestions = async (query: string) => {
    if (!query || query.length < 8) {
      setSearchResult(null);
      return;
    }

    try {
      const res = await searchLocation(query);
      const features = res.data.features.slice(0, 4);
      setSearchResult(features);
    } catch (error) {
      console.error("Erreur de recherche :", error);
      setSearchResult(null);
    }
  };

  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSearchSuggestions, 300),
    []
  );

  useEffect(() => {
    refreshStations();
    getLocation();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors["shady-700"]} />
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      showsUserLocation={true}
      userInterfaceStyle="light"
      style={styles.map}
      initialRegion={{
        latitude: location?.coords.latitude ?? 45.7621171125936,
        longitude: location?.coords.longitude ?? 4.87793629484499,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {searchCoords && (
        <Marker
          coordinate={{
            latitude: searchCoords[1],
            longitude: searchCoords[0],
          }}
          title="Recherche"
          key="recherche"
        />
      )}
      <SafeAreaView>
        <View
          style={{
            padding: 10,
            marginHorizontal: 10,
            borderRadius: 15,
            backgroundColor: Colors["shady-50"],
          }}
        >
          <View style={styles.input}>
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    debouncedFetchSuggestions(text);
                  }}
                  value={value}
                  placeholder="Rechercher un lieu..."
                  placeholderTextColor={Colors["shady-900"]}
                  style={{ width: "90%" }}
                />
              )}
            />
            <TouchableOpacity onPress={handleSubmit(getSearchLocation)}>
              <MaterialIcons name="search" size={30} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              paddingHorizontal: 4,
              gap: 20,
            }}
          >
            <FlatList
              data={searchResult}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    const [lon, lat] = item.geometry.coordinates;
                    setSearchCoords([lon, lat]);
                    setSearchResult(null);

                    if (mapRef.current) {
                      mapRef.current.animateToRegion(
                        {
                          latitude: lat,
                          longitude: lon,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        },
                        1000
                      );
                    }
                  }}
                  style={{
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderColor: Colors["shady-300"],
                  }}
                >
                  <ThemedText>{item.properties.label}</ThemedText>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </SafeAreaView>
      {/* Bouton de rafraichissement  /  Bouton de localisation */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity onPress={refreshStations}>
          <Ionicons
            name="reload-circle"
            size={34}
            color={Colors["shady-950"]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={getLocation}>
          <FontAwesome6
            name="location-arrow"
            size={34}
            color={Colors["shady-950"]}
          />
        </TouchableOpacity>
      </View>

      {stations?.map((borne, key) => {
        return (
          <Marker
            coordinate={{
              latitude: borne.latitude,
              longitude: borne.longitude,
            }}
            title={borne.name}
            key={key}
          >
            <Link href={`./borne-details/${borne.id}`}>
              <View style={styles.borne}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <ThemedText>{borne.power}kW</ThemedText>
                  <Octicons name="zap" size={12} color={Colors["shady-950"]} />
                </View>
                <ThemedText style={styles.markerTarif}>
                  {borne.price}€/h
                </ThemedText>
              </View>
            </Link>
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  borne: {
    borderRadius: 10,
    borderColor: Colors["shady-400"],
    borderWidth: 1,
    backgroundColor: Colors["shady-50"],
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    // Ombre
    shadowColor: Colors["shady-950"],
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  position: {
    backgroundColor: Colors["shady-50"],
  },
  markerPower: {
    fontSize: 14,
    color: Colors["shady-950"],
    fontWeight: "bold",
  },
  markerTarif: {
    fontSize: 12,
    color: Colors["shady-700"],
  },
  input: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 14,
    borderColor: Colors["shady-300"],
    borderWidth: 1,
    backgroundColor: Colors["shady-200"],
  },
});
