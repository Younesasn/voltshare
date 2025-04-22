import { Colors } from "@/themes/Colors";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import MapView, { Marker, MarkerAnimated, Region } from "react-native-maps";
import { SearchMenu } from "./SearchMenu";
import Octicons from "@expo/vector-icons/Octicons";
import { ThemedText } from "@/themes/ThemedText";
import { Link } from "expo-router";
import { getAllStations } from "@/services/StationService";
import { useEffect, useState } from "react";
import { Station } from "@/interfaces/Station";
import * as Location from "expo-location";

export function Map() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  // const [region, setRegion] = useState<Region>({
  //   latitude: location?.coords.latitude ?? 45.7621171125936,
  //   longitude: location?.coords.longitude ?? 4.877936294844991,
  //   latitudeDelta: 0.0922,
  //   longitudeDelta: 0.0421,
  // });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getAllStations()
      .then((res) => {
        setStations(res.data.member);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des bornes :", err.message);
        Alert.alert("Erreur", "Impossible de récupérer les bornes.");
      })
      .finally(() => setLoading(false));
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
      style={styles.map}
      initialRegion={{
        latitude: location?.coords.latitude ?? 45.7621171125936,
        longitude: location?.coords.longitude ?? 4.87793629484499,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }}
    >
      <MarkerAnimated
        title={"Vous êtes ici"}
        coordinate={{
          latitude: location?.coords.latitude ?? 45.7621171125936,
          longitude: location?.coords.longitude ?? 4.877936294844991,
        }} />
      {stations.map((borne, key) => {
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
      <SearchMenu stations={stations} />
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
});