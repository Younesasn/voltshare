import { Colors } from "@/themes/Colors";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import Borne from "./Borne";
import { Station } from "@/interfaces/Station";

export function SearchMenu({stations}: {stations: Station[]}) {
  return (
    <View style={styles.container}>
      <TextInput placeholder="Rechercher un lieu..." style={styles.input} />
      <FlatList data={stations} renderItem={({item}) => <Borne station={item} />} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "90%",
    marginLeft: "5%",
    bottom: 90,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    height: "30%",
    backgroundColor: Colors["shady-50"],
    display: "flex",
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowColor: Colors["shady-950"],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 14,
    borderColor: Colors["shady-300"],
    borderWidth: 1,
    backgroundColor: Colors["shady-200"],
  },
});
