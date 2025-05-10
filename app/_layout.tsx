import { AuthProvider } from "@/context/AuthContext";
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
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
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
      </AuthProvider>
      <Toast />
      <StatusBar animated translucent barStyle="dark-content" />
    </>
  );
}
