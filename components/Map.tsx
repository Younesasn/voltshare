import { Markers } from "@/data/Markers";
import { Colors } from "@/themes/Colors";
import { StyleSheet, Text, View } from "react-native";
import MapView, { MarkerAnimated } from "react-native-maps";

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
      {Markers.map((marker, key) => {
        return (
          <MarkerAnimated
            coordinate={{
              latitude: marker.coordinate.latitude,
              longitude: marker.coordinate.longitude,
            }}
            title={marker.power}
            description={marker.tarif}
            key={key}
          >
            <View style={styles.marker}>
              <Text style={styles.markerPower}>{marker.power}</Text>
              <Text style={styles.markerTarif}>{marker.tarif}</Text>
            </View>
          </MarkerAnimated>
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
  marker: {
    borderRadius: 10,
    borderColor: Colors["shady-400"],
    borderWidth: 1,
    backgroundColor: Colors["shady-50"],
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
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
