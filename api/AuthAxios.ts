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

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const notifySubscribers = (newToken: string) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

const refreshTokenRequest = async (
  refreshToken: string
): Promise<string | null> => {
  try {
    const response = await axios.post(`${apiUrl}/api/token/refresh`, {
      refresh_token: refreshToken,
    });

    const newToken = response.data.token;
    const newExpiresAt = String(response.data.refresh_token_expiration);

    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    await SecureStore.setItemAsync(EXPIRES_AT_KEY, newExpiresAt);
    await SecureStore.setItemAsync("loggedAt", new Date().toISOString());

    if (onTokenRefreshed) onTokenRefreshed(newToken);

    notifySubscribers(newToken);
    return newToken;
  } catch (error) {
    console.warn("❌ Refresh échoué → déconnexion forcée");
    await logoutFromSecureStore();
    return null;
  } finally {
    isRefreshing = false;
  }
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
    return config;
  }

  if (diffInSeconds > 59) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenRequest(refreshToken);
    }

    return new Promise((resolve) => {
      subscribeTokenRefresh((newToken) => {
        config.headers.Authorization = `Bearer ${newToken}`;
        resolve(config);
      });
    });
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("🔒 Requête non autorisée (401), déconnexion...");
      await logoutFromSecureStore();
    } else if (status === 403) {
      console.warn("⛔ Accès refusé (403)");
    } else if (status >= 500) {
      console.warn(
        "💥 Erreur serveur :",
        error.response?.data || error.message
      );
    } else {
      console.warn("⚠️ Erreur HTTP :", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
