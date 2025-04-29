import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_ADRESSE_API;

type Location = {
  type: string;
  version: string;
  features: {
    type: string;
    geometry: {
      type: string;
      coordinates: number[];
    };
    properties: {
      label: string;
      score: number;
      housenumber: string;
      id: string;
      banId: string;
      _type: string;
      name: string;
      postcode: string;
      citycode: string;
      x: number;
      y: number;
      city: string;
      context: string;
      importance: number;
      street: string;
    };
  }[];
  attribution: string;
  licence: string;
  query: string;
  limit: number;
};

export function searchLocation(query: string) {
  const array = query.split(" ");
  const newQuery = array.join("+");
  return axios.get<Location>(`${apiUrl}/search/?q=${newQuery}`);
}