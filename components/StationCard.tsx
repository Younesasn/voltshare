import { Station } from "@/interfaces/Station";
import { ThemedText } from "@/themes/ThemedText";
import { View, Image, StyleSheet } from "react-native";
import React, { FC } from "react";
import { Colors } from "@/themes/Colors";
import Button from "./Button";
import { router } from "expo-router";

interface StationCardProps {
  station: Station;
}

const StationCard: FC<StationCardProps> = ({ station }) => {
  const imageUrl = process.env.EXPO_PUBLIC_API_URL + "/images/station/";
  return (
    <View style={styles.card} key={station.id}>
      <Image
        src={imageUrl + station.picture}
        style={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          width: "100%",
          height: 150,
        }}
      />
      <View style={{ padding: 10, gap: 15 }}>
        <View style={{ gap: 10 }}>
          <View>
            <ThemedText variant="subtitle">{station?.name}</ThemedText>
            <ThemedText>{station?.adress}</ThemedText>
          </View>
          <View>
            <ThemedText>Puissance : {station?.power}kW</ThemedText>
            <ThemedText>Tarif : {station?.price}€/h</ThemedText>
          </View>
        </View>
        <Button
          title={"Voir les réservations"}
          onPress={() => {
            router.navigate(`../list-reservations/${station.id}`);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors["shady-700"],
    flexDirection: "column",
  },
});

export default StationCard;
