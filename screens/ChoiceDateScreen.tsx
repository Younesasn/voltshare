import { useState, useRef, useMemo, useEffect, MutableRefObject } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import Swiper from "react-native-swiper";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import Button from "@/components/Button";
import { router, useLocalSearchParams } from "expo-router";
import { getStationById } from "@/services/StationService";
import { Reservation } from "@/interfaces/Reservation";
import Ionicons from "@expo/vector-icons/Ionicons";
import BackButton from "@/components/BackButton";

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
moment.defineLocale("fr", {
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
  const swiper = useRef();
  const contentSwiper = useRef();
  const [week, setWeek] = useState(0);
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [value, setValue] = useState(new Date());
  const [startSlot, setStartSlot] = useState<moment.Moment | null>(null);
  const [endSlot, setEndSlot] = useState<moment.Moment | null>(null);

  /**
   * Récupérer les réservations de la station
   */
  useEffect(() => {
    getStationById(newId)
      .then((res) => {
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
   * Vérifie si il y a une réservation pour le jour sélectionné
   */
  const hasReservation = reservations?.some((reservation) => {
    return moment(reservation.startTime).isSame(days[1], "day");
  });

  /**
   * Récupère les réservations pour le jour sélectionné
   */
  const timeslotsReservation = reservations?.filter((reservation) => {
    return moment(reservation.startTime).isSame(days[1], "day");
  });

  /**
   * Réinitialise le créneau sélectionné
   */
  const resetReservation = () => {
    setStartSlot(null);
    setEndSlot(null);
  };

  /**
   * Affiche les logs du créneau sélectionné
   */
  useEffect(() => {
    if (startSlot && endSlot) {
      console.log("Créneau sélectionné :");
      console.log("Début :", startSlot.toISOString());
      console.log("Fin :", moment(endSlot).add(1, "hour").toISOString());
    }
  }, [startSlot, endSlot]);

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
          <Swiper
            index={1}
            ref={swiper as MutableRefObject<any>}
            loop={false}
            showsPagination={false}
            onIndexChanged={(id) => {
              if (id === 1) {
                return;
              }

              const index = id - 1;
              setValue(moment(value).add(index, "week").toDate());

              setTimeout(() => {
                setWeek(week + index);
                swiper.current?.scrollTo(1, false);
              }, 10);
            }}
          >
            {weeks.map((dates, index) => (
              <View style={styles.itemRow} key={index}>
                {dates.map((item, dateIndex) => {
                  const isActive =
                    value.toDateString() === item.date.toDateString();
                  return (
                    <TouchableWithoutFeedback
                      key={dateIndex}
                      onPress={() => setValue(item.date)}
                    >
                      <View
                        style={[
                          styles.item,
                          isActive && {
                            backgroundColor: Colors["shady-950"],
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
          </Swiper>
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
        <Swiper
          index={1}
          ref={contentSwiper as MutableRefObject<any>}
          loop={false}
          showsPagination={false}
          showsVerticalScrollIndicator={false}
          onIndexChanged={(ind) => {
            if (ind === 1) {
              return;
            }

            setTimeout(() => {
              const nextValue = moment(value).add(ind - 1, "days");

              // Ajuste le sélecteur de semaine si nécessaire
              if (moment(value).week() !== nextValue.week()) {
                setWeek(
                  moment(value).isBefore(nextValue) ? week + 1 : week - 1
                );
              }

              setValue(nextValue.toDate());
              contentSwiper.current?.scrollTo(1, false);
            }, 10);
          }}
        >
          {days.map((day, index) => {
            const formatHour = (n: number) => n.toString().padStart(2, "0");

            // 💡 On extrait les réservations de ce jour-là
            const dayReservations = reservations?.filter((res) =>
              moment(res.startTime).isSame(day, "day")
            );

            return (
              <View
                key={index}
                style={{ flex: 1, paddingHorizontal: 16, marginBottom: 16 }}
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
                <ScrollView style={{ height: 620 }}>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ gap: 10 }}>
                      {hours.map((hour, index) => {
                        const h = Number(hour);
                        const nextHour = (h + 1) % 24;

                        // ✅ On construit une plage horaire correspondant à ce créneau
                        const slotStart = moment(day)
                          .hour(h)
                          .minute(0)
                          .second(0);
                        const slotEnd = moment(day).hour(nextHour);

                        // ⛔ Est-ce qu’un créneau de reservation chevauche celui-ci ?
                        const isTaken = dayReservations?.some((res) => {
                          const resStart = moment(res.startTime);
                          const resEnd = moment(res.endTime);
                          return (
                            slotStart.isBefore(resEnd) &&
                            slotEnd.isAfter(resStart)
                          );
                        });

                        // ✅ On vérifie si le créneau est sélectionné
                        const isSelected =
                          (startSlot &&
                            !endSlot &&
                            slotStart.isSame(startSlot)) ||
                          (startSlot &&
                            endSlot &&
                            slotStart.isSameOrAfter(startSlot) &&
                            slotStart.isBefore(moment(endSlot).add(1, "hour")));

                        return (
                          <TouchableOpacity
                            key={index}
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
                              if (!startSlot) {
                                setStartSlot(slotStart); // Premier clic = heure de début
                              } else if (!endSlot) {
                                if (slotStart.isBefore(startSlot)) {
                                  // Si clic avant startSlot → on inverse intelligemment
                                  setEndSlot(startSlot);
                                  setStartSlot(slotStart);
                                } else {
                                  setEndSlot(slotStart); // Deuxième clic = heure de fin
                                }
                              } else {
                                // Si les deux sont déjà définis → on reset tout
                                setStartSlot(slotStart);
                                setEndSlot(null);
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
                  </View>
                </ScrollView>
              </View>
            );
          })}
        </Swiper>

        <View style={{ paddingHorizontal: 16 }}>
          <Button link="../" title="Continuer" />
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
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
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
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 0,
    backgroundColor: "transparent",
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
  back: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
});
