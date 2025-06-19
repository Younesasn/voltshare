import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import { Station } from "@/interfaces/Station";
import { getStarredStations } from "@/services/StationService";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from "react-native";

export default function StarredStation() {
  const navigation = useNavigation();
  const [station, setStation] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await getStarredStations();
      setStation(res.data);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log("Erreur lors du chargement des bornes favorites : " + e);
    }
  };

  useEffect(() => {
    getData();
    navigation.setOptions({ presentation: "modal" });
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={Colors["shady-900"]} />
      </View>
    );
  }

  return (
    <View style={{ paddingVertical: 20, paddingHorizontal: 18, gap: 10 }}>
      <AntDesign
        name="close"
        size={30}
        color="black"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <ThemedText variant="title">Bornes favorites</ThemedText>
      <FlatList
        data={station}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={({ item }) => (
          <View style={styles.card} key={item.id}>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/images/borne.avif")}
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
                  <ThemedText>{item?.name}</ThemedText>
                  <ThemedText>{item?.adress}</ThemedText>
                </View>

                <View>
                  <View>
                    <ThemedText variant="lilText">
                      Puissance : {item?.power}kW
                    </ThemedText>
                  </View>
                  <View>
                    <ThemedText variant="lilText">
                      Tarif : {item?.price}€/h
                    </ThemedText>
                  </View>
                  <Button title="Voir" />
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors["shady-700"],
    flexDirection: "column",
  },
});
