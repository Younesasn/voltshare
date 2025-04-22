import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Button from "@/components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Station } from "@/interfaces/Station";
import { getStationById } from "@/services/StationService";

export default function BorneDetailsScreen() {
  const { id } = useLocalSearchParams();
  const newId = parseInt(id as string);
  const [station, setStation] = useState<Station | null>(null);
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    getStationById(newId).then((res) => {
      setStation(res.data);
    }).catch((err) => {
      console.error("Erreur lors de la récupération du station :", err.message);
      Alert.alert("Erreur", "Impossible de récupérer les informations.");
    });
  }, [newId]);

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        style={styles.image}
        source={require("../assets/images/borne.avif")}
        alt="image test"
      />
      {/* Retour Button */}
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons
          name="arrow-back-outline"
          size={24}
          color={Colors["shady-900"]}
        />
      </TouchableOpacity>

      <ScrollView style={styles.content}>
        <View style={styles.contentTitle}>
          <View>
            <View style={{ width: 360 }}>
              <ThemedText variant="title">{station?.name}</ThemedText>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <ThemedText variant="lilText">{station?.adress}</ThemedText>
              <ThemedText variant="lilText">•</ThemedText>
              <ThemedText variant="lilText">2.9km</ThemedText>
            </View>
          </View>
          {isStarred ? (
            <Entypo
              name="star"
              onPress={() => setIsStarred(false)}
              size={24}
              color={Colors["shady-950"]}
            />
          ) : (
            <Entypo
              name="star-outlined"
              onPress={() => setIsStarred(true)}
              size={24}
              color={Colors["shady-950"]}
            />
          )}
        </View>

        <ThemedText variant="lilText" style={{ marginBottom: 20 }}>
          {station?.description}
        </ThemedText>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <MaterialCommunityIcons
            name="ev-plug-type2"
            size={40}
            color={Colors["shady-950"]}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}
          >
            <View>
              <ThemedText>{station?.type}</ThemedText>
              <ThemedText variant="lilText">{station?.power}kW</ThemedText>
            </View>
            <ThemedText variant="lilText">•</ThemedText>
            <View>
              <ThemedText>{station?.price}€/h</ThemedText>
              <ThemedText variant="lilText">prix</ThemedText>
            </View>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 5,
                backgroundColor: "#39E930",
              }}
            />
            <ThemedText variant="lilText">Disponible</ThemedText>
          </View>
          <Button link="./choice-date/[id]" title="Réserver" id={station?.id} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    backgroundColor: Colors["shady-50"],
    borderColor: Colors["shady-900"],
    borderWidth: 1,
    position: "absolute",
    top: 60,
    left: 20,
    padding: 5,
    borderRadius: 20,
    zIndex: 90,
    elevation: 10,
  },
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
    width: "100%",
    height: 300,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
  },
  contentTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: Colors["shady-50"],
    position: "absolute",
    top: 60,
    left: 20,
    padding: 5,
    borderRadius: 20,
  },
});
