import { apiUrl } from "@/context/AuthContext";
import { ApiListResponse } from "@/interfaces/ApiListResponse";
import { Station } from "@/interfaces/Station";
import axios from "axios";

export function getAllStations() {
  return axios.get<ApiListResponse<Station>>(`${apiUrl}/api/stations`);
}

export function getStationById(id: number) {
  return axios.get<Station>(`${apiUrl}/api/stations/${id}`);
}