import { useAuth } from "@/context/AuthContext";
import { Reservation } from "@/interfaces/Reservation";
import { ThemedText } from "@/themes/ThemedText";
import moment from "moment";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReservationScreen() {
  const [reservations, setReservations] = useState<Reservation[]>();
  const { user } = useAuth();

  useEffect(() => {
    setReservations(user?.reservations?.reverse());
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ display: "flex", gap: 10 }}>
        <ThemedText variant="title">Réservations</ThemedText>
        <ThemedText>
          Vous trouverez la liste de toute les réservations passées par vous et
          vos clients
        </ThemedText>
      </View>
      <View style={{height: "34%"}}>
        <View style={[styles.row, styles.header]}>
          <ThemedText style={styles.cell}>Date</ThemedText>
          <ThemedText style={styles.cell}>Début</ThemedText>
          <ThemedText style={styles.cell}>Fin</ThemedText>
          <ThemedText style={styles.cell}>Véhicule</ThemedText>
          <ThemedText style={styles.cell}>Station</ThemedText>
        </View>
        <FlatList
          data={reservations}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <ThemedText style={styles.cell}>
                {moment(item.startTime).format("DD/MM/YYYY")}
              </ThemedText>
              <ThemedText style={styles.cell}>
                {moment(item.startTime).format("HH:mm")}
              </ThemedText>
              <ThemedText style={styles.cell}>
                {moment(item.endTime).format("HH:mm")}
              </ThemedText>
              <ThemedText style={styles.cell}>
                {item.car?.model || "-"}
              </ThemedText>
              <ThemedText style={styles.cell}>
                {item.station?.name || "-"}
              </ThemedText>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  header: {
    borderBottomWidth: 2,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
  },
});
