import { ApiResponse } from "./ApiListResponse";
import { Reservation } from "./Reservation";
import { User } from "./User";

export interface Car extends ApiResponse {
  id: number;
  model: string;
  user: User;
  reservations?: Reservation[];
}