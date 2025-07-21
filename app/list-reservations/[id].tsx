import { Reservation } from "@/interfaces/Reservation";
import { Station } from "@/interfaces/Station";
import { exportDataStation, getStationById } from "@/services/StationService";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import moment from "moment";
import { FlatList, StyleSheet, View } from "react-native";
import Button from "@/components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";
import Card from "@/components/ReservationCard";
import Toast from "react-native-toast-message";

export default function ListReservations() {
  const { id } = useLocalSearchParams();
  const newId = parseInt(id as string);
  const [station, setStation] = useState<Station | undefined>();
  const [reservations, setReservations] = useState<Reservation[] | undefined>();
  const getData = async () => {
    const res = await getStationById(newId);
    setStation(res.data);
    setReservations(res.data.reservations);
  };

  useEffect(() => {
    getData();
  }, []);

  const exportData = async () => {
    const res = await exportDataStation(newId);
    if (!res.data) return;
    Toast.show({
      autoHide: true,
      type: "success",
      text1: "Donées exportées !",
      text2: "Les données de cette borne vous ont été envoyés par mail.",
      position: "top",
      visibilityTime: 5000,
    });
    console.log(res.data);
  };

  if (!reservations?.length) {
    return (
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
        <BackButton />
        <ThemedText variant="title">{station?.name}</ThemedText>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ThemedText variant="subtitle" isCenter>
            Pas de réservations passées sur cette borne.
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BackButton />
        <View style={{ gap: 10 }}>
          <ThemedText variant="title">{station?.name}</ThemedText>
          <ThemedText>
            Retrouvez l'ensemble des réservations passées sur votre borne.
          </ThemedText>
        </View>
        <FlatList
          data={reservations?.reverse()}
          keyExtractor={(item) =>
            item.id?.toString() ?? Math.random().toString()
          }
          renderItem={({ item }) => (
            <Card
              reservation={item}
              inProgress={moment().isBetween(item.startTime, item.endTime)}
              isNotClient
            />
          )}
          contentContainerStyle={{ gap: 16, paddingVertical: 16 }}
        />
      </View>
      <View style={{ gap: 10, paddingHorizontal: 16 }}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          {/* Calcul du total d'heures réservées et du prix total */}
          <ThemedText>
            Heures réservées :{" "}
            {reservations &&
              reservations.reduce((total, res) => {
                if (res.startTime && res.endTime) {
                  const start = moment(res.startTime);
                  const end = moment(res.endTime);
                  return total + end.diff(start, "hours", true);
                }
                return total;
              }, 0)}{" "}
            h
          </ThemedText>
          <ThemedText>
            Prix total rapporté :{" "}
            {reservations &&
              reservations
                .reduce((total, res) => total + (res.price || 0), 0)
                .toFixed(2)}{" "}
            €
          </ThemedText>
        </View>
        <Button title="Exportez les données" onPress={exportData} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: Colors["shady-50"],
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: Colors["shady-50"],
    borderRadius: 16,
    padding: 14,
    shadowColor: Colors["shady-900"],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginHorizontal: 2,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  status: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
});
