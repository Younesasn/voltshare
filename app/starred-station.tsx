import Button from "@/components/Button";
import { Station } from "@/interfaces/Station";
import { getStarredStations } from "@/services/StationService";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from "react-native";

export default function StarredStation() {
  const navigation = useNavigation();
  const router = useRouter();
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
      {station?.length > 0 ? (
        <>
          <ThemedText variant="title">Bornes favorites</ThemedText>
          <FlatList
            data={station}
            style={{ height: "88%" }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            renderItem={({ item }) => (
              <View style={styles.card} key={item.id}>
                <View>
                  <Image
                    source={require("../assets/images/borne.avif")}
                    style={{
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      width: "100%",
                      height: 150,
                    }}
                  />
                  <View style={{ padding: 10, gap: 15 }}>
                    <View style={{ gap: 10 }}>
                      <View>
                        <ThemedText>{item?.name}</ThemedText>
                        <ThemedText>{item?.adress}</ThemedText>
                      </View>
                      <View>
                        <ThemedText>Puissance : {item?.power}kW</ThemedText>
                        <ThemedText>Tarif : {item?.price}€/h</ThemedText>
                      </View>
                    </View>
                    <Button
                      title="Voir"
                      onPress={() => {
                        router.back();
                        router.navigate(`./borne-details/${item.id}`);
                      }}
                    />
                  </View>
                </View>
              </View>
            )}
          />
        </>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "88%",
          }}
        >
          <ThemedText variant="title">
            Pas de borne mise en favorite.
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors["shady-700"],
    flexDirection: "column",
  },
});
