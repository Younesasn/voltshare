import { ApiResponse } from "./ApiListResponse";
import { Car } from "./Car";
import { Station } from "./Station";

export interface Reservation extends ApiResponse {
  id: number;
  station: Station;
  car: Car;
  date: Date;
  startTime: Date;
  endTime: Date;
  price: number;
}