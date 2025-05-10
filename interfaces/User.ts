import { ApiResponse } from "./ApiListResponse";
import { Car } from "./Car";
import { Reservation } from "./Reservation";
import { Station } from "./Station";

export interface User extends ApiResponse {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  adress: string;
  avatar?: string;
  roles: string[];
  tel: string;
  cars?: Car[];
  stations?: Station[];
  stationsStarred?: Station[];
  reservations?: Reservation[];
}

export interface UserRegister {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  adress?: string;
  tel?: string;
  avatar?: string;
  isDeleted?: boolean;
}

export interface UserPasswordToken {
  expired: boolean;
  expiresAt: Date;
  id: number;
  token: string;
  user: User;
}
