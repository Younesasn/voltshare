import { apiUrl } from "@/context/AuthContext";
import axios from "axios";

export function createCar(car: {model: string, user: string}) {
  return axios.post<any>(`${apiUrl}/api/cars`, car);
}

export function deleteCar(id: number) {
  return axios.delete(`${apiUrl}/api/cars/${id}`);
}
