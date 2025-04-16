import { Colors } from "@/themes/Colors";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SearchMenu } from "./SearchMenu";
import Octicons from "@expo/vector-icons/Octicons";
import { ThemedText } from "@/themes/ThemedText";
import { Bornes } from "@/data/Bornes";
import { Link } from "expo-router";

export function Map() {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 45.7621171125936,
        longitude: 4.877936294844991,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {Bornes.map((borne, key) => {
        return (
          <Marker
            coordinate={{
              latitude: borne.coordinate.latitude,
              longitude: borne.coordinate.longitude,
            }}
            title={borne.name}
            key={key}
          >
            <Link href={`./borne-details/${borne.id}`}>
              <View style={styles.borne}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                  <ThemedText>{borne.power}</ThemedText>
                  <Octicons name="zap" size={12} color={Colors["shady-950"]} />
                </View>
                <ThemedText style={styles.markerTarif}>{borne.tarif}</ThemedText>
              </View>
            </Link>
          </Marker>
        );
      })}
      <SearchMenu />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
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
