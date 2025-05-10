import api from "@/api/AuthAxios";
import { apiUrl } from "@/context/AuthContext";

export function createCar(car: {model: string, user: string}) {
  return api.post<any>(`${apiUrl}/api/cars`, car);
}

export function deleteCar(id: number) {
  return api.delete(`${apiUrl}/api/cars/${id}`);
}
