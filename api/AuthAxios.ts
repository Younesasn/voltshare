import * as SecureStore from "expo-secure-store";
import axios from "axios";
import dayjs from "dayjs";
import { router } from "expo-router";

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const EXPIRES_AT_KEY = "expiresAt";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Fonction générique pour déconnexion
const logoutFromSecureStore = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(EXPIRES_AT_KEY);
  await SecureStore.deleteItemAsync("loggedAt");

  router.replace("/login");
};

const api = axios.create({
  baseURL: apiUrl,
});

let onTokenRefreshed: ((newToken: string) => void) | null = null;

export const setOnTokenRefreshed = (callback: (newToken: string) => void) => {
  onTokenRefreshed = callback;
};

api.interceptors.request.use(async (config: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  const expiresAt = await SecureStore.getItemAsync(EXPIRES_AT_KEY);
  const loggedAt = await SecureStore.getItemAsync("loggedAt");
  const now = new Date();

  if (!token || !refreshToken || !expiresAt || !loggedAt) {
    console.log("🔥 Token ou refresh manquant → déconnexion");
    await logoutFromSecureStore();
    return config;
  }

  const lastLogin = new Date(loggedAt);
  const diffInSeconds = Math.floor(
    (now.getTime() - lastLogin.getTime()) / 1000
  );
  console.log(
    `⏱️ Temps écoulé depuis la connexion : ${diffInSeconds} secondes`
  );

  const isExpired = dayjs().isAfter(dayjs.unix(Number(expiresAt)));

  if (isExpired) {
    console.warn("❌ Refresh token expiré. Déconnexion.");
    await logoutFromSecureStore();
    return;
  }

  if (diffInSeconds > 59) {
    try {
      console.log("🔁 Token expiré, tentative de refresh...");
      const result = await axios.post(`${apiUrl}/api/token/refresh`, {
        refresh_token: refreshToken,
      });

      const newToken = result.data.token;
      const newExpiresAt = String(result.data.refresh_token_expiration);

      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
      await SecureStore.setItemAsync(EXPIRES_AT_KEY, newExpiresAt);
      await SecureStore.setItemAsync("loggedAt", new Date().toISOString());

      config.headers.Authorization = `Bearer ${newToken}`;

      if (onTokenRefreshed) {
        onTokenRefreshed(newToken);
      }
    } catch (error) {
      console.warn("❌ Refresh échoué → déconnexion forcée");
      await logoutFromSecureStore();
      return config;
    }
  } else {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
