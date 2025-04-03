import { Link, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { Bornes } from "@/data/Bornes";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Button from "@/components/Button";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function BorneDetails() {
  const { id } = useLocalSearchParams();
  const newId = parseInt(id as string);
  const borne = Bornes.find((b) => b.id === newId);

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        style={styles.image}
        source={{ uri: borne?.image }}
        
      />
      {/* Retour Button */}
      <Link href={"../"} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color={Colors["shady-950"]} />
      </Link>

      <View style={styles.content}>
        <View style={styles.contentTitle}>
          <View>
            <ThemedText variant="title">{borne?.name}</ThemedText>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <ThemedText variant="lilText">{borne?.address}</ThemedText>
              <ThemedText variant="lilText">•</ThemedText>
              <ThemedText variant="lilText">2.9km</ThemedText>
            </View>
          </View>
          <Entypo name="star-outlined" size={24} color={Colors["shady-950"]} />
        </View>

        <ThemedText variant="lilText">{borne?.description}</ThemedText>

        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialCommunityIcons name="ev-plug-type2" size={40} color={Colors["shady-950"]} />
          <View style={{ display: "flex", flexDirection: "row", gap: 4, alignItems: "center" }}>
            <View>
              <ThemedText>{borne?.type}</ThemedText>
              <ThemedText variant="lilText">{borne?.power}</ThemedText>
            </View>
            <ThemedText variant="lilText">•</ThemedText>
            <View>
              <ThemedText>{borne?.tarif}</ThemedText>
              <ThemedText variant="lilText">prix</ThemedText>
            </View>
          </View>
        </View>

        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <View style={{ display: "flex", flexDirection: "row", gap: 4, alignItems: "center" }}>
            <View style={{width: 8, height: 8, borderRadius: 5, backgroundColor: "#39E930"}} />
            <ThemedText variant="lilText">Disponible</ThemedText>
          </View>
          <Button link="../(tabs)/" title="Réserver" />
        </View>
        {/* <View style={{ height: 900, width: "100%", backgroundColor: "red", display: "flex" }} /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: Colors["shady-50"],
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  image: {
    backgroundColor: Colors["shady-950"],
    width: "100%",
    height: 300,
  },
  content: {
    flex: 1,
    width: "100%",
    padding: 20,
    gap: 20,
  },
  contentTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { 
    backgroundColor: Colors["shady-50"], 
    position: "absolute", 
    top: 60, 
    left: 20, 
    padding: 5, 
    borderRadius: 20 
  }
});
