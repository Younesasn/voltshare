import { AuthProvider } from "@/context/AuthContext";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StationProvider } from "@/context/StationContext";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { StatusBar } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Uber: require("../assets/fonts/UberMove-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light"><AuthProvider>
        <StationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="success-payment"
              options={{
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="(app)"
              options={{ animation: "none", gestureEnabled: false }}
            />
            <Stack.Screen
              name="add-car"
              options={{ presentation: "transparentModal" }}
            />
            <Stack.Screen
              name="login"
              options={{ animation: "none", gestureEnabled: false }}
            />
          </Stack>
          <Toast />
          <StatusBar animated translucent barStyle="dark-content" />
        </StationProvider>
      </AuthProvider></GluestackUIProvider>
  );
}
