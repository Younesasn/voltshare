import { Colors } from "@/themes/Colors";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Octicons from "@expo/vector-icons/Octicons";
import { ThemedText } from "@/themes/ThemedText";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { searchLocation } from "@/services/SearchLocationService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStations } from "@/context/StationContext";

export function Map() {
  const { stations, loading, refreshStations } = useStations();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const mapRef = useRef<MapView>(null);
  const [searchCoords, setSearchCoords] = useState<number[] | null>(null);
  const [searchResult, setSearchResult] = useState<[] | null>(null);
  const schema = z.object({
    address: z.string().min(1, "Veuillez saisir une adresse"),
  });
  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      address: "",
    },
  });
  const delta = 0.0421;

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    const location = await Location.getCurrentPositionAsync();
    setLocation(location);

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: delta,
          longitudeDelta: delta,
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
            latitudeDelta: delta,
            longitudeDelta: delta,
          },
          1000
        );
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Erreur de recherche :", error.response.data);
      } else {
        console.error("Erreur de recherche :", error.message);
      }
    }
  };

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
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        showsUserLocation={true}
        userInterfaceStyle="light"
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude ?? 45.7621171125936,
          longitude: location?.coords.longitude ?? 4.87793629484499,
          latitudeDelta: delta,
          longitudeDelta: delta,
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
        {stations?.map((borne) => {
          return (
            <Marker
              coordinate={{
                latitude: borne.latitude,
                longitude: borne.longitude,
              }}
              title={borne.name}
              key={borne.id}
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
                    <Octicons
                      name="zap"
                      size={12}
                      color={Colors["shady-950"]}
                    />
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

      <SafeAreaView style={{ position: "absolute", width: "100%" }}>
        <View
          style={{
            marginHorizontal: 10,
            padding: 10,
            backgroundColor: Colors["shady-50"],
            borderRadius: 15,
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
                    fetchSearchSuggestions(text);
                  }}
                  value={value}
                  placeholder="Rechercher un lieu..."
                  placeholderTextColor={Colors["shady-900"]}
                  style={{ width: "90%", height: 40 }}
                />
              )}
            />
            <TouchableOpacity onPress={handleSubmit(getSearchLocation)}>
              <MaterialIcons name="search" size={24} color="black" />
            </TouchableOpacity>
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
                    setValue("address", item.properties.label);
                    setSearchCoords([lon, lat]);
                    setSearchResult(null);

                    if (mapRef.current) {
                      mapRef.current.animateToRegion(
                        {
                          latitude: lat,
                          longitude: lon,
                          latitudeDelta: delta,
                          longitudeDelta: delta,
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
          )}
        </View>
        <TouchableOpacity
          onPress={getLocation}
          style={{
            marginHorizontal: 15,
            marginTop: 15,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <FontAwesome6
            name="location-arrow"
            size={24}
            color={Colors["shady-950"]}
          />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
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
    paddingHorizontal: 10,
    borderRadius: 14,
    borderColor: Colors["shady-300"],
    borderWidth: 1,
    backgroundColor: Colors["shady-200"],
  },
});
