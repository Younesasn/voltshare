// export default function ChoiceDateScreen() {
//   const [selectedId, setSelectedId] = useState<number>(0);

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.topBar}>
//         <ThemedText variant="title">Voltshare</ThemedText>
//         <TouchableOpacity>
//           <Link href={"../"}>
//             <Entypo name="cross" size={24} color="black" />
//           </Link>
//         </TouchableOpacity>
//       </SafeAreaView>

//       <View style={styles.dateContain}>
//         <View style={styles.month}>
//           <AntDesign name="caretleft" size={24} color="black" />
//           <ThemedText variant="text">Mars</ThemedText>
//           <AntDesign name="caretright" size={24} color="black" />
//         </View>

//         <FlatList
//           data={[
//             { day: "L", number: 1 },
//             { day: "M", number: 2 },
//             { day: "M", number: 3 },
//             { day: "J", number: 4 },
//             { day: "V", number: 5 },
//             { day: "S", number: 6 },
//             { day: "D", number: 7 },
//           ]}
//           renderItem={({ item, index }) => (
//             <DayButton
//               letterDay={item.day}
//               numberDay={item.number}
//               index={index}
//               selectedId={selectedId}
//               onPress={setSelectedId}
//             />
//           )}
//           style={{ paddingVertical: 5 }}
//           horizontal={true}
//           showsHorizontalScrollIndicator={false}
//         />

//         <ScrollView style={{ height: 620 }}>
//           <View
//             style={{
//               width: "100%",
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <View style={{ gap: 10 }}>
//               {hours.map((hour, index) => (
//                 <TouchableOpacity
//                   style={[
//                     styles.hourButton,
//                     {
//                       backgroundColor: Colors["shady-50"],
//                       borderWidth: 1,
//                       borderColor: Colors["shady-300"],
//                     },
//                   ]}
//                   key={index}
//                 >
//                   <ThemedText>Disponible</ThemedText>
//                   <ThemedText>{`De ${Number(hour)} à ${
//                     Number(hour) + 1
//                   }`}</ThemedText>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         </ScrollView>
//       </View>

//       <Button link="../" title="Continuer" style={styles.button} />
//     </View>
//   );
// }

// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   topBar: {
//     backgroundColor: Colors["shady-50"],
//     width: "100%",
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "flex-end",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//   },
//   month: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 4,
//   },
//   dateContain: {
//     gap: 25,
//     paddingVertical: 20,
//     paddingHorizontal: 30,
//   },
//   carouselDay: {},
//   hourButton: {
//     width: "100%",
//     height: 50,
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "flex-end",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingBottom: 10,
//     borderRadius: 10,
//   },
//   button: {
//     position: "absolute",
//     bottom: 30,
//     right: 30,
//   },
// });

import { useState, useRef, useMemo, useEffect } from "react";
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
import { getDayOfWeek } from "@/utils/momentFunction";

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
  const [value, setValue] = useState(new Date());

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

  useEffect(() => {
    console.log(days[1]);
    console.log(getDayOfWeek(days[1]));
  }, [newId, days]);  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Choisissez un créneau</Text>
        </View>

        <View style={styles.picker}>
          <Swiper
            index={1}
            ref={swiper}
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
                swiper.current.scrollTo(1, false);
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
                            backgroundColor: "#111",
                            borderColor: "#111",
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

        <Swiper
          index={1}
          ref={contentSwiper}
          loop={false}
          showsPagination={false}
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
              contentSwiper.current.scrollTo(1, false);
            }, 10);
          }}
        >
          {days.map((day, index) => {
            return (
              <View
                key={index}
                style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}
              >
                <Text style={styles.subtitle}>
                  {day.toLocaleDateString("fr-FR", { dateStyle: "long" })}
                </Text>
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
                      {hours.map((hour, index) => (
                        <TouchableOpacity
                          style={[
                            styles.hourButton,
                            {
                              backgroundColor: Colors["shady-50"],
                              borderWidth: 1,
                              borderColor: Colors["shady-300"],
                            },
                          ]}
                          key={index}
                        >
                          <ThemedText>Disponible</ThemedText>
                          <ThemedText>{`De ${moment().hour(Number(hour)).hour()}h à ${
                            moment().hour(Number(hour)).hour() + 1
                          }h`}</ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </ScrollView>
              </View>
            );
          })}
        </Swiper>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              borderWidth: 1,
              borderColor: Colors["shady-950"],
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
          >
            <ThemedText>Retour</ThemedText>
          </TouchableOpacity>
          <Button link="../" title="Continuer" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
  },
  header: {
    paddingHorizontal: 16,
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
  subtitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#999999",
    marginBottom: 12,
  },
  footer: {
    marginTop: "auto",
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  placeholderInset: {
    // borderWidth: 4,
    // borderColor: "#e5e7eb",
    // borderStyle: "dashed",
    // borderRadius: 9,
    // flexGrow: 1,
    // flexShrink: 1,
    // flexBasis: 0,
  },
  /** Button */
  hourButton: {
    width: "100%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderRadius: 10,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});
