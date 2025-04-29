import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import { deleteCar } from "@/services/CarService";
import Toast from "react-native-toast-message";

moment.locale("fr");

export default function AccountScreen() {
  const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/images/`;
  const { onLogout, user, onDeleteAccount, onRefreshing } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const deleteAccount = () => {
    if (!user?.id || !onDeleteAccount) return;
    Alert.alert(
      "Suppression du compte",
      "Êtes-vous sûr de vouloir supprimer votre compte ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui",
          onPress: () => onDeleteAccount(user.id),
          style: "destructive",
        },
      ]
    );
  };

  const onDeleteCar = (carId: number) => {
    if (!user?.id) return;

    Alert.alert(
      "Suppression de la voiture",
      "Êtes-vous sûr de vouloir supprimer votre voiture ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui",
          onPress: async () => {
            try {
              setIsLoading(true);
              await deleteCar(carId);
              await onRefreshing!();
              setIsLoading(false);

              Toast.show({
                type: "success",
                text1: "Voiture supprimée",
                text2: "La voiture a été supprimée avec succès.",
                position: "top",
                visibilityTime: 5000,
              });
            } catch (error: any) {
              setIsLoading(false);
              console.error(
                "Erreur lors de la suppression de la voiture",
                error.message
              );
              Alert.alert("Erreur", "Impossible de supprimer la voiture.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <ThemedText>Chargement de votre compte...</ThemedText>
        <ActivityIndicator size="small" color={Colors["shady-700"]} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Image
              src={
                user?.avatar ? apiUrl + user?.avatar : apiUrl + "avatar.avif"
              }
              style={styles.image}
            />
            <View>
              <ThemedText variant="title">
                {user?.firstname} {user?.lastname}
              </ThemedText>
              <ThemedText>{user?.email}</ThemedText>
            </View>
          </View>
          <TouchableOpacity onPress={onLogout}>
            <MaterialIcons name="logout" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{ paddingVertical: 20, gap: 20 }}>
            <View style={{ gap: 10 }}>
              <ThemedText variant="title">Informations Personnelles</ThemedText>
              <TouchableOpacity
                onPress={() => router.navigate("/informations-form")}
              >
                <ThemedText>Modifier mes informations</ThemedText>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 10 }}>
              <ThemedText variant="title">Mes voitures</ThemedText>
              {user?.cars &&
                user?.cars.length > 0 &&
                (isLoading ? (
                  <ActivityIndicator size="large" color={Colors["shady-700"]} />
                ) : (
                  <FlatList
                    scrollEnabled={false}
                    data={user?.cars}
                    ItemSeparatorComponent={() => (
                      <View style={{ height: 20 }} />
                    )}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.buttonCar}
                        onPress={() => onDeleteCar(item.id as number)}
                      >
                        <ThemedText>{item.model}</ThemedText>
                        <Ionicons
                          name="car-sport-sharp"
                          size={40}
                          color={Colors["shady-950"]}
                        />
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id?.toString() as string}
                    style={{ paddingVertical: 10 }}
                  />
                ))}
              <TouchableOpacity
                style={styles.buttonCar}
                onPress={() => router.navigate("/addCar")}
              >
                <ThemedText>Ajouter une voiture</ThemedText>
                <AntDesign name="plus" size={40} color={Colors["shady-950"]} />
              </TouchableOpacity>
            </View>
            <View style={{ gap: 10 }}>
              <ThemedText variant="title">Mes bornes</ThemedText>
              {user?.stations && user?.stations.length > 0 && (
                <FlatList
                  scrollEnabled={false}
                  data={user?.stations}
                  ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                  renderItem={({ item }) => (
                    // <TouchableOpacity style={styles.buttonStation}>
                    //   <View>
                    //     <ThemedText>{item.name}</ThemedText>
                    //     <ThemedText variant="lilText">{item.type}</ThemedText>
                    //   </View>
                    //   <Image
                    //     source={require("../assets/images/borne.avif")}
                    //     style={{
                    //       width: "50%",
                    //       height: 100,
                    //       borderTopRightRadius: 5,
                    //       borderBottomRightRadius: 5,
                    //     }}
                    //   />
                    // </TouchableOpacity>
                    <View></View>
                  )}
                  keyExtractor={(item) => item.id?.toString() as string}
                  style={{ paddingVertical: 20 }}
                />
              )}
              <TouchableOpacity
                style={styles.buttonCar}
                onPress={() => console.log("salut")}
              >
                <ThemedText>Ajouter une borne</ThemedText>
                <AntDesign name="plus" size={40} color={Colors["shady-950"]} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <ThemedText variant="lilText">
                Voltshare © {moment().year()}
              </ThemedText>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: Colors["shady-950"],
                }}
                onPress={deleteAccount}
              >
                <ThemedText variant="lilText">Supprimer mon compte</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {/* Footer */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors["shady-950"],
  },
  buttonCar: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors["shady-950"],
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonStation: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 20,
  },
});
