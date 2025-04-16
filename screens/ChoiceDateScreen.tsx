import { useState } from "react";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import DayButton from "@/components/DayButton";
import { Link } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/Button";

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

export default function ChoiceDateScreen() {
  const [selectedId, setSelectedId] = useState<number>(0);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topBar}>
        <ThemedText variant="title">Voltshare</ThemedText>
        <TouchableOpacity>
          <Link href={"../"}>
            <Entypo name="cross" size={24} color="black" />
          </Link>
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.dateContain}>
        <View style={styles.month}>
          <AntDesign name="caretleft" size={24} color="black" />
          <ThemedText variant="text">Mars</ThemedText>
          <AntDesign name="caretright" size={24} color="black" />
        </View>

        <FlatList
          data={[
            { day: "L", number: 1 },
            { day: "M", number: 2 },
            { day: "M", number: 3 },
            { day: "J", number: 4 },
            { day: "V", number: 5 },
            { day: "S", number: 6 },
            { day: "D", number: 7 },
          ]}
          renderItem={({ item, index }) => (
            <DayButton
              letterDay={item.day}
              numberDay={item.number}
              index={index}
              selectedId={selectedId}
              onPress={setSelectedId}
            />
          )}
          style={{ paddingVertical: 5 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />

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
                  <ThemedText>{`De ${Number(hour)} à ${
                    Number(hour) + 1
                  }`}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      <Button link="../" title="Continuer" style={styles.button} />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topBar: {
    backgroundColor: Colors["shady-50"],
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  month: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  dateContain: {
    gap: 25,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  carouselDay: {},
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
  button: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});
