import api from "@/api/AuthAxios";
import { apiUrl } from "@/context/AuthContext";
import { Reservation } from "@/interfaces/Reservation";

export function createReservation(reservation: {
  date: Date;
  startTime: Date;
  endTime: Date;
  station: string;
  user: string;
  car: string;
  price: number;
}) {
  return api.post<Reservation>(`${apiUrl}/api/reservations`, reservation);
}