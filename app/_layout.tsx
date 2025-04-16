import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  const { authState } = useAuth();
  return (
    <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(app)" />
        </Stack>
    </AuthProvider>
  );
}
