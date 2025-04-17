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
import { UserRegister } from "@/interfaces/User";

const TOKEN_KEY = "token";
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

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({ token, authenticated: true });
      } else {
        setAuthState({ token: null, authenticated: false });
      }
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
      await axios.post(`${apiUrl}/api/users`, {
        firstname,
        lastname,
        email,
        password,
        adress,
        tel,
      });
      return login(email, password);
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

  const on2FA = async (code: number) => {
    try {
      const result = await axios.post(`${apiUrl}/2fa/check`, { code });
      const token = result.data.token;
      if (!token) {
        return { error: true, message: "Code invalide" };
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await SecureStore.setItemAsync(TOKEN_KEY, token);
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

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    axios.defaults.headers.common["Authorization"] = "";
    setAuthState({ token: null, authenticated: false });
  };

  return (
    <AuthContext.Provider
      value={{
        onRegister: register,
        onLogin: login,
        on2FA,
        onLogout: logout,
        authState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
