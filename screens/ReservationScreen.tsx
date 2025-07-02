import { ChipGroup } from "@/components/chip/Chip";
import { Reservation } from "@/interfaces/Reservation";
import { ThemedText } from "@/themes/ThemedText";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { Station } from "@/interfaces/Station";
import ReservationCard from "@/components/ReservationCard";

const ReservationScreen: React.FunctionComponent = (_$_): React.ReactNode => {
  const [index, setIndex] = useState<number>(0);
  const [displayedLabel, setDisplayedLabel] = useState<string>("Client");
  const [displayedCount, setDisplayedCount] = useState<number>(42);
  const fadeAnim = useSharedValue<number>(1);
  const [reservations, setReservations] = useState<Reservation[]>();
  const [stations, setStations] = useState<Station[]>();
  const { user } = useAuth();
  const chipData = [
    {
      label: "Client",
      icon: "person",
      activeIcon: "person.fill",
      activeColor: "#0A84FF",
    },
    {
      label: "Hôte",
      icon: "cart",
      activeIcon: "cart.fill",
      activeColor: "#FF453A",
    },
  ];
  const updateDisplayedContent = (newIndex: number) => {
    setDisplayedLabel(chipData[newIndex].label);
    setDisplayedCount(Math.floor(Math.random() * 100) + 1);
  };
  const handleChipChange = (newIndex: number) => {
    if (newIndex !== index) {
      fadeAnim.value = withTiming(0, { duration: 150 }, (finished) => {
        if (finished) {
          runOnJS(updateDisplayedContent)(newIndex);
          fadeAnim.value = withTiming(1, { duration: 150 });
        }
      });
      setIndex(newIndex);
    }
  };
  const animatedStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      opacity: fadeAnim.value,
      transform: [
        {
          translateY: interpolate(fadeAnim.value, [0, 1], [4, 0]),
        },
      ],
    };
  });
  useEffect(() => {
    setReservations(user?.reservations?.reverse());
    setStations(user?.stations);
    updateDisplayedContent(0);
  }, []);
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.chipContainer}>
            <ChipGroup
              chips={chipData as any}
              selectedIndex={index}
              onChange={handleChipChange}
              containerStyle={styles.chipGroupContainer}
            />
          </View>
          {displayedLabel === "Client" ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Animated.View style={[animatedStyle, { gap: 10 }]}>
                {reservations?.map((reservation) => {
                  if (
                    moment().isBetween(
                      reservation.startTime,
                      reservation.endTime
                    )
                  ) {
                    return (
                      <View key={reservation.id}>
                        <ThemedText variant="title">
                          Réservation en cours
                        </ThemedText>
                        <ReservationCard reservation={reservation} inProgress />
                      </View>
                    );
                  }
                })}
                {reservations?.map((reservation) => {
                  if (moment(reservation.startTime).isAfter())
                    return (
                      <View key={reservation.id}>
                        <ThemedText variant="title">
                          Prochaine réservation
                        </ThemedText>
                        <ReservationCard reservation={reservation}/>
                      </View>
                    );
                })}
                <View style={{ gap: 10 }}>
                  <View style={{ gap: 4 }}>
                    <ThemedText variant="title">Mes réservations</ThemedText>
                    <ThemedText>
                      Vous trouverez ci-dessous l'ensemble de vos réservations
                      passées.
                    </ThemedText>
                  </View>
                  <FlatList
                    data={reservations}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <ReservationCard reservation={item} />
                    )}
                  />
                </View>
              </Animated.View>
            </ScrollView>
          ) : (
            <Animated.View style={[animatedStyle]}>
              <ThemedText variant="title">Mes bornes</ThemedText>
              <FlatList
                data={stations}
                renderItem={({ item }) => (
                  <View key={item.id}>
                    <ThemedText>{item.name}</ThemedText>
                  </View>
                )}
              />
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
export default ReservationScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chipContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
  },
  chipGroupContainer: {
    paddingHorizontal: 4,
  },
});
