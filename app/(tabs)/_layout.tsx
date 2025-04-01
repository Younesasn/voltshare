import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from '@expo/vector-icons/Feather';
import { StyleSheet } from "react-native";
import { Colors } from "@/themes/Colors";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: styles.container }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Recharger",
          tabBarLabel: "Recharger",
          tabBarIcon: () => (
            <MaterialIcons name="electric-car" size={24} color={Colors["shady-950"]} />
          ),
          tabBarActiveTintColor: "#000000",
          tabBarInactiveTintColor: "#000000",
        }}
      />
      <Tabs.Screen
        name="add/index"
        options={{
          title: "Ajouter",
          tabBarLabel: "Ajouter",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="charging-station" size={24} color={Colors["shady-950"]} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservation/index"
        options={{
          title: "Réservations",
          tabBarLabel: "Réservations",
          tabBarIcon: ({ color }) => (
            <Feather name="layout" size={24} color={Colors["shady-950"]} />
          ),
        }}
      />
      <Tabs.Screen
        name="account/index"
        options={{
          title: "Compte",
          tabBarLabel: "Compte",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" size={24} color={Colors["shady-950"]} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    bottom: 20,
    marginHorizontal: "auto",
    backgroundColor: Colors["shady-50"],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors["shady-950"],
    borderRadius: 50,
  },
});
