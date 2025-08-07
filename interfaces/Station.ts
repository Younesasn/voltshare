import { ApiResponse } from "./ApiListResponse";
import { Reservation } from "./Reservation";
import { User } from "./User";

export interface Station extends ApiResponse {
  id: number;
  name: string;
  description: string;
  picture: string;
  latitude: number;
  longitude: number;
  power: number;
  price: number;
  adress: string;
  defaultMessage: string;
  type: string;
  user: User;
  active: boolean;
  reservations: Reservation[];
}

export interface StationRegister {
  name: string
  latitude: number
  longitude: number
  adress: string
  price: number
  power: number
  imageFile?: any
  defaultMessage: string
  description: string
}