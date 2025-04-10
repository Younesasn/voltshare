import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet } from "react-native";
import { Colors } from "@/themes/Colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.container,
        tabBarActiveTintColor: Colors["shady-950"],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Recharger",
          tabBarLabel: "Recharger",
          tabBarIconStyle: { marginBottom: -5 },
          tabBarStyle: {
            position: "absolute",
            bottom: 20,
            width: "90%",
            marginLeft: "5%",
            height: 70,
            backgroundColor: Colors["shady-50"],
            flexDirection: "row",
            borderBottomStartRadius: 30,
            borderEndEndRadius: 30,
            shadowColor: Colors["shady-950"],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5, // Pour Android
            paddingBottom: 5,
            paddingTop: 5,
          },
          tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginTop: 9 },
          tabBarIcon: () => (
            <MaterialIcons
              name="electric-car"
              size={28}
              color={Colors["shady-950"]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add/index"
        options={{
          title: "Ajouter",
          tabBarLabel: "Ajouter",
          tabBarIconStyle: { marginBottom: -5 },
          tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginTop: 9 },
          tabBarIcon: () => (
            <FontAwesome5
              name="charging-station"
              size={28}
              color={Colors["shady-950"]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reservation/index"
        options={{
          title: "Réservations",
          tabBarLabel: "Réservations",
          tabBarIconStyle: { marginBottom: -5 },
          tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginTop: 9 },
          tabBarIcon: () => (
            <Feather name="layout" size={28} color={Colors["shady-950"]} />
          ),
        }}
      />
      <Tabs.Screen
        name="account/index"
        options={{
          title: "Compte",
          tabBarLabel: "Compte",
          tabBarIconStyle: { marginBottom: -5 },
          tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginTop: 9 },
          tabBarIcon: () => (
            <MaterialIcons
              name="account-circle"
              size={28}
              color={Colors["shady-950"]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    marginLeft: "5%",
    height: 70,
    backgroundColor: Colors["shady-50"],
    flexDirection: "row",
    borderRadius: 50,
    shadowColor: Colors["shady-950"],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, // Pour Android
    paddingBottom: 5,
    paddingTop: 5,
  },
});
