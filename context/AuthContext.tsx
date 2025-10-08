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
import dayjs from "dayjs";
import "dayjs/locale/fr";
import Toast from "react-native-toast-message";
import { createRandomString } from "@/lib/createRandomString";
import api, { setOnTokenRefreshed } from "@/api/AuthAxios";
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

  const loadToken = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    const expiresAt = await SecureStore.getItemAsync(EXPIRES_AT_KEY);

    if (!token || !refreshToken || !expiresAt) {
      await logout();
      setAuthState({ token: null, authenticated: false });
      return;
    }

    const now = dayjs();
    const expiration = dayjs.unix(Number(expiresAt));

    if (now.isAfter(expiration)) {
      console.warn("❌ Refresh token expiré. Déconnexion.");
      await logout();
      setAuthState({ token: null, authenticated: false });
      return;
    }

    setAuthState({ token, authenticated: true });

    try {
      const res = await api.get<User>("/api/me");
      setUser(res.data);
    } catch (error) {
      console.warn("❌ Échec de récupération des infos utilisateur.");
      await logout();
      setAuthState({ token: null, authenticated: false });
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    setOnTokenRefreshed((newToken: string) => {
      console.log("🔐 Nouveau token reçu via interceptor !");
      setAuthState((prev) => ({
        ...prev,
        token: newToken,
        authenticated: true,
      }));
    });
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
      await api.post<UserRegister>("/api/users", {
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
      return await api.patch(
        `/api/users/${id}`,
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
      const result = await api.get("/api/me");
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
    setUser(undefined);
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
      const anonymeUser: UserRegister = {
        firstname: "Anonyme",
        lastname: "Utilisateur",
        email: "anonyme@anonyme.com",
        password: createRandomString(12),
        adress: "Anonyme",
        tel: "0000000000",
        isDeleted: true,
      };

      await api.patch(`/api/users/${id}`, anonymeUser, {
        headers: {
          "Content-Type": "application/merge-patch+json",
        },
      });

      await logout();

      Toast.show({
        type: "success",
        text1: "Compte supprimé",
        text2: "Votre compte a été supprimé avec succès.",
        position: "top",
        visibilityTime: 4000,
      });

      return { error: false };
    } catch (error: any) {
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

  const onForgotPassword = async (email: string) => {
    try {
      await axios.post(`${apiUrl}/forgot-password/`, { email });
      Toast.show({
        type: "success",
        text1: "Email envoyé",
        text2: "Un lien de réinitialisation de mot de passe vous a été envoyé.",
        position: "top",
        visibilityTime: 10000,
      });
      return { error: false };
    } catch (error: any) {
      console.error("❌ Erreur lors de l'envoi du mail :", error);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2:
          error?.response?.data?.message ||
          "Impossible d'envoyer le mail de réinitialisation de mot de passe.",
        position: "top",
        visibilityTime: 5000,
      });
      return { error: true, message: error.message };
    }
  };

  const inProgressChangingPassword = async (token: string) => {
    try {
      const result = await axios.get(`${apiUrl}/forgot-password/${token}`);
      return result.data;
    } catch (error: any) {
      if (error.response?.status === 404) return false;
      return false;
    }
  };

  const onChangePassword = async (token: any, password: string) => {
    try {
      await axios.post(`${apiUrl}/forgot-password/${token}`, { password });
      return { error: false };
    } catch (error: any) {
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
        onForgotPassword,
        inProgressChangingPassword,
        onChangePassword,
        loadToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
