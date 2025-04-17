type Shape = Marker | Polygon;

type Coords = { lat: number; lng: number }[][];

type Polygon = {
  type: "polygon";
  coords: Coords;
  title: string;
  number?: number;
  description: string;
  images?: string[];
};

type Marker = {
  type: "marker";
  coords: number[];
  title: string;
  number?: number;
  description: string;
  images?: string[];
};
