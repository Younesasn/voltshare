import api from "@/api/AuthAxios";
import { apiUrl } from "@/context/AuthContext";
import { ApiListResponse } from "@/interfaces/ApiListResponse";
import { Station, StationRegister } from "@/interfaces/Station";

export function getAllStations() {
  return api.get<ApiListResponse<Station>>(`${apiUrl}/api/stations`);
}

export function getStationById(id: number) {
  return api.get<Station>(`${apiUrl}/api/stations/${id}`);
}

export function getStarredStations() {
  return api.get<Station[]>(`${apiUrl}/api/stations-starred`);
}

export function addFavouriteStation(id: number) {
  return api.post(`${apiUrl}/api/stations/${id}/starred`);
}

export function removeFavouriteStation(id: number) {
  return api.post(`${apiUrl}/api/stations/${id}/unstarred`);
}

export function createStation(station: StationRegister) {
  return api.post(`${apiUrl}/api/stations`, station);
}

export function updateStation(id: number, station: StationRegister) {
  return api.patch(`${apiUrl}/api/stations/${id}`, station, {
    headers: { "Content-Type": "application/merge-patch+json" },
  });
}
