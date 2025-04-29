import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export function createCar(car: {model: string, user: string}) {
  return axios.post<any>(`${apiUrl}/api/cars`, car);
}

export function deleteCar(id: number) {
  return axios.delete(`${apiUrl}/api/cars/${id}`);
}
