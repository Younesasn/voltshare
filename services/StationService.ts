import api from "@/api/AuthAxios";
import { apiUrl } from "@/context/AuthContext";
import { ApiListResponse } from "@/interfaces/ApiListResponse";
import { Station } from "@/interfaces/Station";

export function getAllStations() {
  return api.get<ApiListResponse<Station>>(`${apiUrl}/api/stations`);
}

export function getStationById(id: number) {
  return api.get<Station>(`${apiUrl}/api/stations/${id}`);
}