import { Link, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { Bornes } from "@/data/Bornes";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Button from "@/components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";

export default function BorneDetailsScreen() {
  const { id } = useLocalSearchParams();
  const newId = parseInt(id as string);
  const borne = Bornes.find((b) => b.id === newId);

  const [isStarred, setIsStarred] = useState(false);

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        style={styles.image}
        source={require("../assets/images/borne.avif")}
        alt="image test"
      />
      {/* Retour Button */}
      <Link href={"../"} style={styles.backButton}>
        <Ionicons
          name="arrow-back-outline"
          size={24}
          color={Colors["shady-950"]}
        />
      </Link>

      <ScrollView style={styles.content}>
        <View style={styles.contentTitle}>
          <View>
            <View style={{ width: 360 }}>
              <ThemedText variant="title">{borne?.name}</ThemedText>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <ThemedText variant="lilText">{borne?.address}</ThemedText>
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
          {borne?.description}
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
          <Button link="../choice-date/" title="Réserver" />
        </View>
      </ScrollView>
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
