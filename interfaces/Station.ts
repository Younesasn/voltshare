import { ApiResponse } from "./ApiListResponse";
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
}