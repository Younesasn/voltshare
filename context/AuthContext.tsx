import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { AuthProps } from "@/interfaces/AuthProps";
import * as SecureStore from "expo-secure-store";
import { User, UserRegister } from "@/interfaces/User";
import * as dayjs from "dayjs";
import "dayjs/locale/fr";
import Toast from "react-native-toast-message";
import { createRandomString } from "@/utils/createRandomString";
dayjs.locale("fr");

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const EXPIRES_AT_KEY = "expiresAt";
export const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const expiresAt = await SecureStore.getItemAsync(EXPIRES_AT_KEY);
      const loggedAt = await SecureStore.getItemAsync("loggedAt");
      const now = new Date();

      // Si un des éléments critiques est manquant, l'utilisateur est déconnecté
      if (!token || !refreshToken || !expiresAt || !loggedAt) {
        setAuthState({ token: null, authenticated: false });
        return;
      }

      const lastLogin = new Date(loggedAt);
      const diffInSeconds = Math.floor(
        (now.getTime() - lastLogin.getTime()) / 1000
      );
      console.log(
        `⏱️ Temps écoulé depuis la connexion : ${diffInSeconds} secondes`
      );

      // Vérifie si le refresh token est dépassé
      const expires = new Date(dayjs.unix(Number(expiresAt)).toISOString());
      if (now > expires) {
        console.warn("❌ Refresh token expiré. Déconnexion.");
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(EXPIRES_AT_KEY);
        await SecureStore.deleteItemAsync("loggedAt");
        Toast.show({
          type: "info",
          text1: "Session expirée",
          text2: "Vous avez été déconnecté automatiquement.",
          position: "bottom",
        });
        setAuthState({ token: null, authenticated: false });
        return;
      }

      // Si plus d'1min se sont écoulées → on tente de refresh le token
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

          axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          setAuthState({ token: newToken, authenticated: true });

          console.log("✅ Token rafraîchi avec succès");
        } catch (error) {
          console.warn("❌ Échec du refresh token. Déconnexion.");
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
          await SecureStore.deleteItemAsync(EXPIRES_AT_KEY);
          await SecureStore.deleteItemAsync("loggedAt");
          setAuthState({ token: null, authenticated: false });
          return;
        }
      } else {
        // Sinon, on continue avec le token actuel
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({ token, authenticated: true });
      }

      Toast.show({
        type: "success",
        text1: "Bienvenue à VoltShare ! ⚡️",
        text2: "Vous êtes connecté avec succès.",
        position: "top",
        autoHide: true,
        visibilityTime: 5000,
      });

      // Charger les infos utilisateur
      axios.get<User>(`${apiUrl}/api/me`).then((res) => {
        setUser(res.data);
      });
    };
    loadToken();
  }, []);

  const register = async ({
    firstname,
    lastname,
    email,
    password,
    adress,
    tel,
  }: UserRegister) => {
    try {
      await axios.post<UserRegister>(`${apiUrl}/api/users`, {
        firstname,
        lastname,
        email,
        password,
        adress,
        tel,
        isDeleted: false,
      });
      return login(email as string, password as string);
    } catch (error: any) {
      return { error: true, message: error.message };
    }
  };

  const login = async (username: string, password: string) => {
    try {
      await axios.post(`${apiUrl}/2fa`, { username, password });
      return { error: false, message: "Code 2FA envoyé par email" };
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || error.message,
      };
    }
  };

  const on2FA = async (code: number | undefined) => {
    try {
      const result = await axios.post(`${apiUrl}/2fa/check`, { code });
      const token = result.data.token;
      const refreshToken = result.data.refresh_token;
      const expiresAt = String(result.data.refresh_token_expiration);
      if (!token) {
        return { error: true, message: "Code invalide" };
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const loginDate = new Date().toISOString();
      await SecureStore.setItemAsync("loggedAt", loginDate);
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      await SecureStore.setItemAsync(EXPIRES_AT_KEY, expiresAt);
      setAuthState({ token, authenticated: true });
      return {
        error: false,
        message: "Authentification réussie",
      };
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || error.message,
      };
    }
  };

  const onUpdating = async (id: any, userUpdated: UserRegister) => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return await axios.patch(
        `${apiUrl}/api/users/${id}`,
        {
          firstname: userUpdated.firstname ?? user?.firstname,
          lastname: userUpdated.lastname ?? user?.lastname,
          email: userUpdated.email ?? user?.email,
          adress: userUpdated.adress ?? user?.adress,
          tel: userUpdated.tel ?? user?.tel,
        },
        {
          headers: { "Content-Type": "application/merge-patch+json" },
        }
      );
    } catch (error: any) {
      return { error: true, message: error.message };
    }
  };

  const onRefreshing = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const result = await axios.get(`${apiUrl}/api/me`);
      setUser(result.data);
      return { error: false };
    } catch (error: any) {
      return { error: true, message: error.message };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(EXPIRES_AT_KEY);
    await SecureStore.deleteItemAsync("loggedAt");
    axios.defaults.headers.common["Authorization"] = "";
    setAuthState({ token: null, authenticated: false });
    Toast.show({
      type: "info",
      text1: "Au revoir ! 👋",
      text2: "Nous espérons que vous revoir bientôt.",
      position: "top",
      autoHide: true,
      visibilityTime: 5000,
    });
  };

  const onDeleteAccount = async (id: any) => {
    try {
      console.log("🔨 Suppression du compte...");

      // Assure que le token est présent
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const anonymeUser: UserRegister = {
        firstname: "Anonyme",
        lastname: "Utilisateur",
        email: "anonyme@anonyme.com",
        password: createRandomString(12),
        adress: "Anonyme",
        tel: "0000000000",
        isDeleted: true,
      };

      await axios.patch(`${apiUrl}/api/users/${id}`, anonymeUser, {
        headers: {
          "Content-Type": "application/merge-patch+json",
        },
      });
      console.log("✅ Utilisateur supprimé");

      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(EXPIRES_AT_KEY);
      await SecureStore.deleteItemAsync("loggedAt");
      console.log("🧹 Tokens supprimés");

      setAuthState({ token: null, authenticated: false });
      console.log("🔓 Déconnecté");

      Toast.show({
        type: "success",
        text1: "Compte supprimé",
        text2: "Votre compte a été supprimé avec succès.",
        position: "top",
        visibilityTime: 4000,
      });

      return { error: false };
    } catch (error: any) {
      console.error("❌ Erreur lors de la suppression :", error);

      Toast.show({
        type: "error",
        text1: "Erreur",
        text2:
          error?.response?.data?.message ||
          "Impossible de supprimer le compte.",
        position: "top",
        visibilityTime: 5000,
      });

      return { error: true, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        onRegister: register,
        onLogin: login,
        on2FA,
        onLogout: logout,
        authState,
        user,
        onDeleteAccount,
        onUpdating,
        onRefreshing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
