import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import PagerView from "react-native-pager-view";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import Button from "@/components/Button";
import { router, useLocalSearchParams } from "expo-router";
import { getStationById } from "@/services/StationService";
import { Reservation } from "@/interfaces/Reservation";
import BackButton from "@/components/BackButton";
import { Station } from "@/interfaces/Station";
import * as SecureStore from "expo-secure-store";

const hours = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
];

const { width } = Dimensions.get("window");
moment.updateLocale("fr", {
  weekdaysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  weekdaysMin: ["D", "L", "M", "M", "J", "V", "S"],
  weekdays: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  months: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  week: {
    dow: 1,
    doy: 4,
  },
  monthsShort: [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jui",
    "Jul",
    "Aou",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ],
});

export default function ChoiceDateScreen() {
  const { id } = useLocalSearchParams();
  const newId = parseInt(id as string);
  const weekPagerRef = useRef<PagerView>(null);
  const dayPagerRef = useRef<PagerView>(null);
  const [week, setWeek] = useState(0);
  const [station, setStation] = useState<Station | null>(null);
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [value, setValue] = useState(new Date());
  const [startSlotTime, setStartSlotTime] = useState<number | null>(null);
  const [endSlotTime, setEndSlotTime] = useState<number | null>(null);

  // Convertir les timestamps en objets moment pour l'affichage
  const startSlot = startSlotTime ? moment(startSlotTime) : null;
  const endSlot = endSlotTime ? moment(endSlotTime) : null;

  /**
   * Récupérer les réservations de la station
   */
  useEffect(() => {
    getStationById(newId)
      .then((res) => {
        setStation(res.data);
        setReservations(res.data.reservations);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des réservations :", err);
      });
  }, [newId]);

  /**
   * Crée un tableau de jours pour les semaines précédentes, actuelles et suivantes.
   */
  const weeks = useMemo(() => {
    const start = moment().add(week, "weeks").startOf("week");

    return [-1, 0, 1].map((adj) => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, "week").add(index, "day");

        return {
          weekday: date.format("ddd"),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  /**
   * Crée un tableau de jours pour les jours passés, actuels et à venir.
   */
  const days = useMemo(() => {
    return [
      moment(value).subtract(1, "day").toDate(),
      value,
      moment(value).add(1, "day").toDate(),
    ];
  }, [value]);

  /**
   * Réinitialise le créneau sélectionné
   */
  const resetReservation = () => {
    setStartSlotTime(null);
    setEndSlotTime(null);
  };

  // Le bouton est désactivé si startSlot ou endSlot n'est pas défini
  const isButtonDisabled = startSlotTime === null || endSlotTime === null;

  const checkout = async () => {
    await SecureStore.setItemAsync("station", JSON.stringify(station));
    await SecureStore.setItemAsync(
      "timeslots",
      JSON.stringify({
        start: startSlot?.toDate(),
        end: endSlot?.toDate(),
      })
    );
    resetReservation();
    router.navigate("/checkout");
  };

  /**
   * Gestion du changement de page pour le sélecteur de semaine
   */
  const onWeekPageSelected = useCallback(
    (e: any) => {
      const position = e.nativeEvent.position;
      if (position === 1) {
        return;
      }

      const index = position - 1;
      const newDate = moment(value).add(index, "week");

      // Empêcher de naviguer vers le passé
      if (newDate.isBefore(moment(), "day")) {
        weekPagerRef.current?.setPageWithoutAnimation(1);
        return;
      }

      setValue(newDate.toDate());

      setTimeout(() => {
        setWeek(week + index);
        weekPagerRef.current?.setPageWithoutAnimation(1);
      }, 10);
    },
    [value, week]
  );

  /**
   * Gestion du changement de page pour le sélecteur de jour
   */
  const onDayPageSelected = useCallback(
    (e: any) => {
      const position = e.nativeEvent.position;
      if (position === 1) {
        return;
      }

      const nextValue = moment(value).add(position - 1, "days");

      // Empêcher de naviguer vers le passé
      if (nextValue.isBefore(moment(), "day")) {
        dayPagerRef.current?.setPageWithoutAnimation(1);
        return;
      }

      setTimeout(() => {
        // Ajuste le sélecteur de semaine si nécessaire
        if (moment(value).week() !== nextValue.week()) {
          setWeek(moment(value).isBefore(nextValue) ? week + 1 : week - 1);
        }

        setValue(nextValue.toDate());
        dayPagerRef.current?.setPageWithoutAnimation(1);
      }, 10);
    },
    [value, week]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ paddingHorizontal: 16 }}>
          <BackButton />
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <ThemedText variant="title">Choisissez un créneau</ThemedText>
        </View>

        <View style={styles.picker}>
          <PagerView
            ref={weekPagerRef}
            style={{ flex: 1, height: 50 }}
            initialPage={1}
            onPageSelected={onWeekPageSelected}
          >
            {weeks.map((dates, index) => (
              <View style={styles.itemRow} key={`week-${index}`} collapsable={false}>
                {dates.map((item, dateIndex) => {
                  const isActive =
                    value.toDateString() === item.date.toDateString();
                  const isPast = moment(item.date).isBefore(moment(), "day");
                  return (
                    <TouchableWithoutFeedback
                      key={dateIndex}
                      onPress={() => {
                        if (!isPast) {
                          setValue(item.date);
                        }
                      }}
                      disabled={isPast}
                    >
                      <View
                        style={[
                          styles.item,
                          isActive && {
                            backgroundColor: Colors["shady-950"],
                          },
                          isPast && {
                            opacity: 0.4,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.itemWeekday,
                            isActive && { color: "#fff" },
                          ]}
                        >
                          {item.weekday}
                        </Text>
                        <Text
                          style={[
                            styles.itemDate,
                            isActive && { color: "#fff" },
                          ]}
                        >
                          {item.date.getDate()}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </PagerView>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          {/* Affiche le créneau sélectionné */}
          {startSlot && endSlot ? (
            <ThemedText>
              Créneau sélectionné : {startSlot.format("HH:mm")}h -&gt;{" "}
              {moment(endSlot).add(1, "hour").format("HH:mm")}h
            </ThemedText>
          ) : null}
        </View>

        {/* Affiche les jours */}
        <PagerView
          ref={dayPagerRef}
          style={{ flex: 1 }}
          initialPage={1}
          onPageSelected={onDayPageSelected}
        >
          {days.map((day, index) => {
            const formatHour = (n: number) => n.toString().padStart(2, "0");

            // 💡 On extrait les réservations de ce jour-là
            const dayReservations = reservations?.filter((res) =>
              moment(res.startTime).isSame(day, "day")
            );

            return (
              <View
                key={`day-${index}`}
                style={{ flex: 1, paddingHorizontal: 16 }}
                collapsable={false}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 12,
                  }}
                >
                  {/* Affiche le jour */}
                  <ThemedText>
                    {day.toLocaleDateString("fr-FR", { dateStyle: "long" })}
                  </ThemedText>

                  {/* Affiche le bouton pour réinitialiser le créneau */}
                  {startSlot && endSlot ? (
                    <TouchableOpacity
                      onPress={resetReservation}
                      style={{ borderBottomWidth: 1 }}
                    >
                      <ThemedText>Réinitialiser</ThemedText>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={{ gap: 10 }}>
                    {hours.map((hour, hourIndex) => {
                      const h = Number(hour);
                      const nextHour = (h + 1) % 24;

                      // ✅ On construit une plage horaire correspondant à ce créneau
                      const slotStart = moment(day)
                        .hour(h)
                        .minute(0)
                        .second(0);
                      const slotEnd = moment(day).hour(nextHour);

                      // ⛔ Est-ce qu'un créneau de reservation chevauche celui-ci ?
                      const isTaken = dayReservations?.some((res) => {
                        const resStart = moment(res.startTime);
                        const resEnd = moment(res.endTime);
                        return (
                          slotStart.isBefore(resEnd) &&
                          slotEnd.isAfter(resStart)
                        );
                      });

                      // ✅ On vérifie si le créneau est sélectionné
                      const slotTime = slotStart.valueOf();
                      const isSelected =
                        (startSlotTime !== null &&
                          endSlotTime === null &&
                          slotTime === startSlotTime) ||
                        (startSlotTime !== null &&
                          endSlotTime !== null &&
                          slotTime >= startSlotTime &&
                          slotTime <= endSlotTime);

                      return (
                        <TouchableOpacity
                          key={hourIndex}
                          style={[
                            isTaken || moment(slotStart).isBefore(moment())
                              ? styles.hourButtonDisabled
                              : isSelected
                                ? styles.hourButtonSelected
                                : styles.hourButton,
                          ]}
                          disabled={
                            isTaken || moment(slotStart).isBefore(moment())
                          }
                          onPress={() => {
                            if (!startSlotTime) {
                              setStartSlotTime(slotStart.valueOf()); // Premier clic = heure de début
                            } else if (!endSlotTime) {
                              if (slotStart.valueOf() < startSlotTime) {
                                // Si clic avant startSlot → on inverse intelligemment
                                setEndSlotTime(startSlotTime);
                                setStartSlotTime(slotStart.valueOf());
                              } else {
                                setEndSlotTime(slotStart.valueOf()); // Deuxième clic = heure de fin
                              }
                            } else {
                              // Si les deux sont déjà définis → on reset tout
                              setStartSlotTime(slotStart.valueOf());
                              setEndSlotTime(null);
                            }
                          }}
                        >
                          <ThemedText
                            color={
                              isTaken || moment(slotStart).isBefore(moment())
                                ? Colors["shady-950"]
                                : isSelected
                                  ? Colors["shady-50"]
                                  : Colors["shady-950"]
                            }
                          >
                            {isTaken || moment(slotStart).isBefore(moment())
                              ? "Indisponible"
                              : "Disponible"}
                          </ThemedText>
                          <ThemedText
                            color={
                              isTaken || moment(slotStart).isBefore(moment())
                                ? Colors["shady-950"]
                                : isSelected
                                  ? Colors["shady-50"]
                                  : Colors["shady-950"]
                            }
                          >
                            {isTaken || moment(slotStart).isBefore(moment())
                              ? ""
                              : `De ${formatHour(h)}h à ${formatHour(nextHour)}h`}
                          </ThemedText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            );
          })}
        </PagerView>

        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <Button title="Continuer" onPress={checkout} disabled={isButtonDisabled} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  picker: {
    height: 74,
    paddingVertical: 12,
  },
  /** Item */
  item: {
    flex: 1,
    height: 50,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderColor: "#e3e3e3",
    flexDirection: "column",
    alignItems: "center",
  },
  itemRow: {
    width: width,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: "500",
    color: "#737373",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  /** Button */
  hourButton: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderRadius: 10,
    backgroundColor: Colors["shady-50"],
    borderWidth: 1,
    borderColor: Colors["shady-300"],
  },
  hourButtonDisabled: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors["shady-300"],
    backgroundColor: Colors["shady-200"],
  },
  hourButtonSelected: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderRadius: 10,
    backgroundColor: Colors["shady-950"],
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});
