import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { StyleSheet, View } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import { BorneType } from "@/types/BorneType";
import Button from "./Button";

export default function Borne({ borne }: { borne: BorneType }) {
  return (
    <View style={styles.container}>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
        <FontAwesome5
          name="charging-station"
          size={30}
          color={Colors["shady-950"]}
        />
        <View>
          <ThemedText variant="text">{borne.name}</ThemedText>
          <View
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <ThemedText variant="text" style={{marginEnd: 2, color: Colors["shady-700"]}}>{borne.power}</ThemedText>
            <Octicons name="zap" size={12} color={Colors["shady-700"]} />
            <ThemedText variant="text"> - </ThemedText>
            <ThemedText variant="text">3.2km</ThemedText>
          </View>
        </View>
      </View>
      <Button link={'./borne-details/[id]'} title="Choisir" id={borne.id} />
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
