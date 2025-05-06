import axios from "axios";

const apiLocation = process.env.EXPO_PUBLIC_ADRESSE_API;

export type Location = {
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
  return axios.get<Location>(`${apiLocation}/search/?q=${newQuery}`);
}