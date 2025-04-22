import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Alert,
  Button,
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
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

moment.locale("fr");

export default function AccountScreen() {
  const [image, setImage] = useState<string | null>(null);
  const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/images/`;
  const { onLogout, user, onDeleteAccount, onUpdating } = useAuth();
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
    });
    console.log(result.assets[0].fileName);
    if (result.canceled || result.assets[0].fileName === null) {
      console.log("Vous avez annulé l'image");
      return;
    }
    setImage(result.assets[0].uri as string);
    onUpdating(user?.id, { avatar: result.assets[0].fileName as string });
  };

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
            <Button title="🖍️" onPress={pickImage} />
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
        <ScrollView style={{ paddingVertical: 20 }}>
          <View>
            <ThemedText variant="title">Mes voitures</ThemedText>
            <FlatList
              scrollEnabled={false}
              data={user?.cars}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.buttonCar}>
                  <ThemedText>{item.model}</ThemedText>
                  <Ionicons
                    name="car-sport-sharp"
                    size={40}
                    color={Colors["shady-950"]}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              style={{ paddingVertical: 20 }}
            />
            <TouchableOpacity style={styles.buttonCar}>
              <ThemedText>Ajouter une voiture</ThemedText>
              <AntDesign name="plus" size={40} color={Colors["shady-950"]} />
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* Footer */}
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
});
