export type BorneType = {
  id: number;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  power: string;
  tarif: string;
  name: string;
  address: string;
  description: string;
  type: string;
  image: string;
};
