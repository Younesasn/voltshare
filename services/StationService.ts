import { ApiListResponse } from "@/interfaces/ApiListResponse";
import { Station } from "@/interfaces/Station";
import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export function getAllStations() {
  return axios.get<ApiListResponse<Station>>(`${apiUrl}/api/stations`);
}

export function getStationById(id: number) {
  return axios.get<Station>(`${apiUrl}/api/stations/${id}`);
}