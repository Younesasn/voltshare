import api from "@/api/AuthAxios";
import { apiUrl } from "@/context/AuthContext";
import { ApiListResponse } from "@/interfaces/ApiListResponse";
import { Station, StationRegister } from "@/interfaces/Station";
import { getFilenameFromUri } from "@/utils/getFilenameFromUri";

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
  const formData = new FormData();

  formData.append("name", station.name);
  formData.append("adress", station.adress);
  formData.append("latitude", station.latitude.toString());
  formData.append("longitude", station.longitude.toString());
  formData.append("price", station.price.toString());
  formData.append("power", station.power.toString());
  formData.append("description", station.description);
  formData.append("defaultMessage", station.defaultMessage);

  if (station.imageFile) {
    formData.append("imageFile", {
      uri: station.imageFile.uri,
      name: getFilenameFromUri(station.imageFile.uri),
      type: station.imageFile.mimeType,
    } as any);
  }

  return api.post(`${apiUrl}/api/stations`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function updateStation(id: number, station: StationRegister) {
  return api.patch(`${apiUrl}/api/stations/${id}`, station, {
    headers: { "Content-Type": "application/merge-patch+json" },
  });
}

export function deleteStation(id: number) {
  return api.delete(`${apiUrl}/api/stations/${id}`);
}

export function exportDataStation(id: number) {
  return api.get(`${apiUrl}/api/stations/${id}/export`);
}
