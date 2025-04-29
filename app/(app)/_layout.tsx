import { useAuth } from "@/context/AuthContext";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/themes/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function AppLayout() {
  const { authState } = useAuth();

  if (authState?.authenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors["shady-950"]} />
      </View>
    );
  }

  if (!authState?.authenticated) {
    return <Redirect href="/login" />;
  }

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
        name="message/index"
        options={{
          title: "Messagerie",
          tabBarLabel: "Messagerie",
          tabBarIconStyle: { marginBottom: -5 },
          tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginTop: 9 },
          tabBarIcon: () => (
            <AntDesign name="message1" size={24} color={Colors["shady-950"]} />
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
