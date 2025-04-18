import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { StyleSheet, View } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import Button from "./Button";
import { Station } from "@/interfaces/Station";

export default function station({ station }: { station: Station }) {
  return (
    <View style={styles.container}>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
        <FontAwesome5
          name="charging-station"
          size={30}
          color={Colors["shady-950"]}
        />
        <View>
          <ThemedText variant="text">{station.name}</ThemedText>
          <View
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <ThemedText variant="text" style={{marginEnd: 2, color: Colors["shady-700"]}}>{station.power}kW</ThemedText>
            <Octicons name="zap" size={12} color={Colors["shady-700"]} />
            <ThemedText variant="text"> - </ThemedText>
            <ThemedText variant="text">3.2km</ThemedText>
          </View>
        </View>
      </View>
      <Button link={'./borne-details/[id]'} title="Choisir" id={station.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: Colors["shady-950"],
  },
});
