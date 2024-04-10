import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

import { CheckResultProps, InferResultProps } from "@/components/Interfaces";
export interface RoomProps {
  id : string;
  name : string;
  level : string;
  vertices: number[][][][];
  extinguisher_vertices: number[][];
  refresh?: boolean;
}

export interface FloorProps {
  id: string;
  name: string;
  rooms : RoomProps[] | null; // TODO: change to RoomProps
}

interface ResultContextType {
  checkResultData: CheckResultProps[];
  setCheckResultData: Dispatch<SetStateAction<CheckResultProps[]>>;
  inferResultData: InferResultProps[];
  setInferResultData: Dispatch<SetStateAction<InferResultProps[]>>;
  
  allRooms : RoomProps[];
  setAllRooms : Dispatch<SetStateAction<RoomProps[]>>;
  allFloors : FloorProps[];
  setAllFloors : Dispatch<SetStateAction<FloorProps[]>>;

  currentRoom : RoomProps;
  setCurrentRoom : Dispatch<SetStateAction<RoomProps>>;
  currentFloor : FloorProps;
  setCurrentFloor : Dispatch<SetStateAction<FloorProps>>;
}

interface Props {
  children: ReactNode;
}

export const ResultContext = createContext<ResultContextType>({
  checkResultData: [],
  setCheckResultData: () => {},
  inferResultData: [],
  setInferResultData: () => {},
  
  allFloors: [],
  setAllFloors : () => {},
  allRooms : [],
  setAllRooms : () => {},

  currentRoom : {"id":"", "name":"", 
  "level":"", "vertices":[[[[0,0]]]],
  "extinguisher_vertices": []},
  setCurrentRoom : () => {},
  currentFloor: {"id":"", "name":"", "rooms":[]},
  setCurrentFloor : () => {}

});

export const ResultContextProvider: React.FC<Props> = ({ children }) => {
  const [checkResultData, setCheckResultData] = useState<CheckResultProps[]>(
    [],
  );
  const [inferResultData, setInferResultData] = useState<InferResultProps[]>(
    [],
  );
  const [allFloors, setAllFloors] = useState<FloorProps[]>([]);
  const [allRooms, setAllRooms] = useState<RoomProps[]>([]);

  const [currentRoom, setCurrentRoom] = useState<RoomProps>(
    {"id":"", "name":"", "level":"", 
    "vertices":[[[[0,0]]]], "extinguisher_vertices": []}
  );
  const [currentFloor, setCurrentFloor] = useState<FloorProps>(
    {"id":"", "name":"", "rooms":[]}
  );
  return (
    <ResultContext.Provider
      value={{
        checkResultData,setCheckResultData,
        inferResultData,setInferResultData,
        allFloors, setAllFloors,
        allRooms, setAllRooms,
        currentRoom, setCurrentRoom,
        currentFloor, setCurrentFloor
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};
