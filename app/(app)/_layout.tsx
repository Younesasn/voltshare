import { useAuth } from "@/context/AuthContext";
import {
  NativeTabs,
  Icon,
  Label,
} from "expo-router/unstable-native-tabs";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "@/themes/Colors";

export default function AppLayout() {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState?.authenticated === false) {
      router.replace("/login");
    }
  }, [authState?.authenticated]);

  if (authState?.authenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors["shady-950"]} />
      </View>
    );
  }

  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <Label>Recharger</Label>
        <Icon
          sf={{ default: "ev.charger", selected: "ev.charger.fill" }}
          selectedColor={"black"}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="message/index">
        <Label>Messagerie</Label>
        <Icon
          sf={{
            default: "ellipsis.message",
            selected: "ellipsis.message.fill",
          }}
          selectedColor={"black"}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="reservation/index">
        <Label>Réservations</Label>
        <Icon
          sf={{
            default: "rectangle.grid.2x2",
            selected: "rectangle.grid.2x2.fill",
          }}
          selectedColor={"black"}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account/index">
        <Label>Compte</Label>
        <Icon
          sf={{
            default: "person.crop.circle",
            selected: "person.crop.circle.fill",
          }}
          selectedColor={"black"}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}