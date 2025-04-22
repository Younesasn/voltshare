import { User, UserRegister } from "./User";

export interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: ({firstname, lastname, email, password, adress, tel}: UserRegister) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  on2FA?: (code: number) => Promise<any>;
  onLogout?: () => Promise<any>;
  user?: User;
  onDeleteAccount?: (id: any) => Promise<any>;
  onUpdating?: (id: any, userUpdated: UserRegister) => Promise<any>;
  onRefreshing?: () => Promise<any>;
}