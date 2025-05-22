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
  type: string;
  user: User;
  reservations: Reservation[];
}

export interface StationRegister {
  name: string
  latitude: number
  longitude: number
  adress: string
  picture: string
  price: number
  power: number
  description: string
  type: string
  user: string
}