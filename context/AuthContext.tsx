import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { AuthProps } from "@/interfaces/AuthProps";
import SecureStore from "expo-secure-store";
import { UserRegister } from "@/interfaces/User";

const TOKEN_KEY = "token";
export const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

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
      console.log({ storedToken: token });
      if (token) {
        setAuthState({ token: token, authenticated: true });
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    };
    loadToken();
  }, []);

  const register = async (user: UserRegister) => {
    try {
      await axios.post(`${apiUrl}/api/users`, { user });
      console.log("user registered");
      login(user.email, user.password);
    } catch (error: any) {
      return { error: true, message: error };
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const result = await axios.post(`${apiUrl}/2fa`, { username, password });
      return { error: false, message: "Voir code 2FA par email" };
    } catch (error: any) {
      return { error: true, message: error.message };
    }
  };

  const on2FA = async (code: number) => {
    try {
      const result = await axios.post(`${apiUrl}/2fa/check`, { code });
      console.log(result.data);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.data.token}`;
      setAuthState({ token: result.data.token, authenticated: true });
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
      return {
        error: false,
        message: "Authentification réussie",
        result: result,
      };
    } catch (error: any) {
      return { error: true, message: error.message };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    axios.defaults.headers.common["Authorization"] = "";
    setAuthState({ token: null, authenticated: false });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    on2FA: on2FA,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
