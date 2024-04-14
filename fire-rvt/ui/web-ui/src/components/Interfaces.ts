import { FloorProps } from "@/contexts/ResultContext";

// TODO: Props to be changed based on result output of AI model
export interface CheckResultProps {
  id: string;
  room_name: string;
  room_area: number;
  room_vertices: number[][];
  obstacle_vertices : number[][][];
  extinguisher_vertices: number[][];
  paths: TravelPath[];
  rating: number;
  result: string;
  floor: FloorProps;
  uncovered: number[][][];
}

// TODO: Props to be changed based on result output of AI model
export interface InferResultProps {
  id: string;
  room_name: string;
  room_area: number;
  room_vertices: number[][];
  obstacle_vertices: number[][][];
  extinguisher_vertices: number[][];
  paths: TravelPath[];
  rating: number;
  result: string;
  floor: FloorProps;
  uncovered: number[][][];
}

export interface ResultProps {
    id: string;
    room_name: string;
    room_area: number;
    room_vertices: number[][];
    obstacle_vertices : number[][][];
    extinguisher_vertices: number[][];
    paths: TravelPath[];
    rating: number;
    result: string;
    floor: FloorProps;
    uncovered: number[][][];
}

export interface TravelPath {
    distance : number;
    path: number[][];
}
