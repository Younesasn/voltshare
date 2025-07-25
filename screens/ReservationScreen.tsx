import { ChipGroup } from "@/components/chip/Chip";
import { ThemedText } from "@/themes/ThemedText";
import moment from "moment";
import { useState } from "react";
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
import StationCard from "@/components/StationCard";
import ReservationCard from "@/components/ReservationCard";

const ReservationScreen = () => {
  const [index, setIndex] = useState<number>(0);
  const [displayedLabel, setDisplayedLabel] = useState<string>("Client");
  const fadeAnim = useSharedValue<number>(1);
  const { user } = useAuth();
  const hasStation = !!user?.stations?.length;
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

  const clientComponent = (
    <Animated.View style={[animatedStyle, { gap: 15 }]}>
      {user?.reservations?.reverse()?.map((reservation) => {
        if (moment().isBetween(reservation.startTime, reservation.endTime)) {
          return (
            <View key={reservation.id} style={{ gap: 10 }}>
              <ThemedText variant="title">Réservation en cours</ThemedText>
              <ReservationCard reservation={reservation} inProgress />
            </View>
          );
        }
      })}
      {(() => {
        const prochainesReservations = user?.reservations
          ?.reverse()
          ?.filter((reservation) => moment(reservation.startTime).isAfter());
        if (prochainesReservations && prochainesReservations.length > 0) {
          return (
            <View style={{ gap: 10 }}>
              <ThemedText variant="title">Prochaines réservations</ThemedText>
              {prochainesReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                />
              ))}
            </View>
          );
        }
        return null;
      })()}
      <View style={{ gap: 10 }}>
        <View style={{ gap: 4 }}>
          <ThemedText variant="title">Mes réservations</ThemedText>
          <ThemedText>
            Vous trouverez ci-dessous l'ensemble de vos réservations passées.
          </ThemedText>
        </View>
        <FlatList
          data={user?.reservations?.reverse()}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 16, paddingVertical: 10 }}
          renderItem={({ item }) => <ReservationCard reservation={item} />}
        />
      </View>
    </Animated.View>
  );

  const hoteComponent = user?.stations && (
    <Animated.View style={[animatedStyle, { gap: 10, marginBottom: 80 }]}>
      <ThemedText variant="title">Mes bornes</ThemedText>
      <FlatList
        scrollEnabled={false}
        data={user.stations}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={({ item }) => <StationCard station={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </Animated.View>
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.chipContainer}>
            <ChipGroup
              chips={chipData as any}
              selectedIndex={index}
              hasStation={hasStation}
              onChange={handleChipChange}
              containerStyle={styles.chipGroupContainer}
            />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginBottom: 60 }}>
              {displayedLabel === "Client" ? clientComponent : hoteComponent}
            </View>
          </ScrollView>
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
