import { UserRegister } from "./User";

export interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (user: UserRegister) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  on2FA?: (code: number) => Promise<any>;
  onLogout?: () => Promise<any>;
}