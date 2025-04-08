import { StyleSheet, View } from "react-native";
import { Map } from "@/components/Map";
import { IsLogged } from "@/data/IsLogged";
import { Redirect } from "expo-router";

export default function Index() {
  if (!IsLogged) {
    return <Redirect href={"/login"} />;
  }

  return (
    <View style={styles.container}>
      {/* <Redirect href={"/choice-date"} /> */}
      <Map />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
});
