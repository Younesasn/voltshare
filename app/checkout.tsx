import { ThemedText } from "@/themes/ThemedText";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { Image, StyleSheet, View } from "react-native";
import { Station } from "@/interfaces/Station";
import { useAuth } from "@/context/AuthContext";
import { useReservationRefresh } from "@/hooks/useReservationRefresh";
import { createSession } from "@/services/StripeCheckoutService";
import * as WebBrowser from "expo-web-browser";
import { useNavigation, router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Button from "@/components/Button";
import moment from "moment";
import { Colors } from "@/themes/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createReservation } from "@/services/ReservationService";

export default function Checkout() {
  const [startSlot, setStartSlot] = useState();
  const [endSlot, setEndSlot] = useState();
  const [station, setStation] = useState<Station | null>(null);
  const { user } = useAuth();
  const { refreshAllData } = useReservationRefresh();
  const navigation = useNavigation();
  const taxes = 0.7;

  const getData = async () => {
    const data = await SecureStore.getItemAsync("timeslots");
    const stationData = await SecureStore.getItemAsync("station");
    setStartSlot(JSON.parse(data!).start);
    setEndSlot(JSON.parse(data!).end);
    setStation(JSON.parse(stationData!));
  };

  useEffect(() => {
    navigation.setOptions({ presentation: "modal" });
    getData();
  }, []);

  const betweenHour = () => {
    return moment
      .duration(moment(endSlot).add(1, "hour").diff(moment(startSlot)))
      .hours();
  };

  const tarification = () => {
    return Math.ceil((station?.price! + taxes) * betweenHour());
  };

  const createUrlSession = async () => {
    try {
      if (!user) {
        console.error("Utilisateur non connecté");
        return;
      }

      if (!station) {
        console.error("Station non trouvée");
        return;
      }

      const res = await createSession({
        user: user,
        product_name: station.name,
        amount: tarification(),
      });

      if (!res.data) {
        console.error("Pas d'URL de session reçue");
        return;
      }

      const url = res.data.url;
      const result = await WebBrowser.openAuthSessionAsync(url, undefined, {
        showInRecents: false,
        createTask: false,
        preferEphemeralSession: true, // Force une session éphémère
      });
      console.log("Résultat de session Stripe :", result);

      if (result.type === "success") {
        if (
          !user?.cars?.[0]?.id ||
          !startSlot ||
          !endSlot ||
          !station?.["@id"]
        ) {
          console.error("Données manquantes pour la réservation");
          return;
        }

        const res = await createReservation({
          user: `/api/users/${user.id}`,
          car: `/api/cars/${user.cars[0].id}`,
          date: new Date(),
          startTime: new Date(startSlot),
          endTime: new Date(endSlot),
          price: tarification(),
          station: station["@id"],
        });

        // Rafraîchir toutes les données
        await refreshAllData();

        console.log(res.data);

        // Nettoyer les données temporaires
        await SecureStore.deleteItemAsync("timeslots");
        await SecureStore.deleteItemAsync("station");

        // Rediriger vers la page de succès au lieu d'une URL externe

        navigation.goBack();
        router.push("/success-payment");
      } else if (result.type === "cancel") {
        console.log("Paiement annulé par l'utilisateur.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Erreur lors de la création de la session: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <AntDesign
          name="close"
          size={30}
          color="black"
          onPress={async () => {
            await SecureStore.deleteItemAsync("timeslots");
            await SecureStore.deleteItemAsync("station");
            navigation.goBack();
          }}
        />
        <View style={{ paddingVertical: 15, paddingLeft: 4 }}>
          <ThemedText variant="title">Résumé</ThemedText>
          {/* Vue Station */}
          <View style={{ paddingVertical: 20, gap: 20 }}>
            <View style={{ gap: 10 }}>
              <ThemedText>Borne sélectionnée</ThemedText>
              <View style={styles.card}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Image
                    src={station?.picture}
                    width={80}
                    height={80}
                    style={{ borderRadius: 10 }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <View style={{ width: 160 }}>
                      <ThemedText>{station?.name}</ThemedText>
                      <ThemedText>{station?.adress}</ThemedText>
                    </View>

                    <View>
                      <View>
                        <ThemedText variant="lilText">
                          Puissance : {station?.power}kW
                        </ThemedText>
                      </View>
                      <View>
                        <ThemedText variant="lilText">
                          Tarif : {station?.price}€/h
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ gap: 10 }}>
              <ThemedText>Créneau horaire sélectionné</ThemedText>
              <View style={styles.card}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <ThemedText>Début : </ThemedText>
                    <ThemedText>
                      {moment(startSlot).format("HH:mm")} h
                    </ThemedText>
                  </View>
                  <View
                    style={{
                      width: "60%",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <ThemedText variant="lilText">
                      Temps estimé : {betweenHour()}{" "}
                      {betweenHour() == 1 ? "heure" : "heures"}
                    </ThemedText>
                    <View style={styles.separator} />
                  </View>
                  <View>
                    <ThemedText>Fin : </ThemedText>
                    <ThemedText>
                      {moment(endSlot).add(1, "hour").format("HH:mm")} h
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <ThemedText>Véhicule sélectionné</ThemedText>
              <View style={styles.card}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Ionicons
                    name="car-sport-sharp"
                    size={40}
                    color={Colors["shady-950"]}
                  />
                  <ThemedText>
                    {user?.cars?.[0]?.model ?? "Aucun véhicule"}
                  </ThemedText>
                </View>
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <ThemedText>Tarification</ThemedText>
              <View style={styles.card}>
                <View style={{ flexDirection: "column", gap: 20 }}>
                  <View style={{ gap: 4 }}>
                    <ThemedText>Tarif horaire : {station?.price} €</ThemedText>
                    <ThemedText>Nombres d'heure : {betweenHour()}</ThemedText>
                    <ThemedText>Taxes : {taxes} €</ThemedText>
                  </View>
                  <ThemedText>Prix Total : {tarification()} €</ThemedText>
                </View>
              </View>
            </View>
          </View>
        </View>
        <Button title="Payer" onPress={createUrlSession} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  card: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors["shady-700"],
    gap: 10,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: Colors["shady-500"],
  },
});
