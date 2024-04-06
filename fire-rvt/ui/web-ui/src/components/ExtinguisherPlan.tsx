import { useState, useEffect, useContext } from "react";
import { ResultContext } from "../contexts/ResultContext";
import PlanSVG from "./PlanSVG";

// TODO: Props to be changed based on result output of AI model
interface CheckResultProps {
  id: string;
  room_name: string;
  room_area: number;
  room_vertices: number[][];
  extinguisher_vertices: number[][];
  path_vertices: number[][];
  rating: number;
  result: string;
}

// TODO: Props to be changed based on result output of AI model
interface InferResultProps {
  id: string;
  room_name: string;
  room_area: number;
  room_vertices: number[][];
  extinguisher_vertices: number[][];
  path_vertices: number[][];
  rating: number;
  result: string;
}

// Dummy Check Result Data
const checkResultList: CheckResultProps[] = [
  {
    id: "6754c9a9-9a41-4860-885d-c0500c4160c8",
    room_name: "2F - Office",
    room_area: 70,
    room_vertices: [
      [0, 0],
      [8000, 0],
      [8000, 5000],
      [5000, 5000],
      [5000, 19000],
      [8000, 19000],
      [8000, 23000],
      [0, 23000],
      [0, 0],
    ],
    extinguisher_vertices: [
      [500, 0],
      [8000, 3500],
      [0, 19000],
    ],
    path_vertices: [
      [500, 0],
      [8000, 3500],
      [0, 19000],
    ],
    rating: 70,
    result: "PASS",
  },
];

// Dummy Infer Result Data
const inferResultList: InferResultProps[] = [
  {
    id: "6754c9a9-9a41-4860-885d-c0500c4160c8",
    room_name: "2F - Office",
    room_area: 70,
    room_vertices: [
      [0, 0],
      [8000, 0],
      [8000, 5000],
      [5000, 5000],
      [5000, 19000],
      [8000, 19000],
      [8000, 23000],
      [0, 23000],
      [0, 0],
    ],
    extinguisher_vertices: [
      [500, 0],
      [8000, 3500],
      [0, 19000],
    ],
    path_vertices: [
      [500, 0],
      [8000, 3500],
      [0, 19000],
    ],
    rating: 70,
    result: "PASS",
  },
];

const ExtinguisherPlan = () => {
  const [results, setResults] = useState<
    CheckResultProps[] | InferResultProps[]
  >([]);

  const context = useContext(ResultContext);

  let chkdata : any;

  const {
    checkResultData,
    setCheckResultData,
    inferResultData,
    setInferResultData,
    allFloors,
    setAllFloors,
    allRooms,
    setAllRooms,
    currentRoom,
    setCurrentRoom,
    currentFloor,
    setCurrentFloor
  } = context;

  /*
  // UseEffect method should checkResults get updated.
  useEffect(() => {
    setResults(checkResultData);
  }, [checkResultData]);

  // UseEffect method should checkResults get updated.
  useEffect(() => {
    setResults(inferResultData);
  }, [inferResultData]);

  // TO REMOVE: DUMMY Useeffect method for dummy data.
  useEffect(() => {
    setResults(checkResultList);
  }, []);
  useEffect(() => {
    setResults(inferResultList);
  }, []);
  */
    
  useEffect(()=>{
    console.log(results);
    let main_verts = currentRoom.vertices[0];
    let obstacle_verts : number[][][][] = [];
    if(currentRoom.vertices.length > 1){
        obstacle_verts = currentRoom.vertices.slice(1);
        // reverse the vertices to allow the 
        // svg to create a cutout.
        obstacle_verts.map((arr) => {arr.reverse();});
    }
    let room_array = [];
    for(let i = 0; i < main_verts.length; i++){
        let cvert : number[][] = main_verts[i];
        room_array.push([cvert[0][0] * 100, cvert[0][1] * 100]);
        if(i == main_verts.length - 1){
            room_array.push([cvert[1][0] * 100, cvert[1][1] * 100]);
        }
    }
    for(let i = 0; i < obstacle_verts.length; i++){
        let cverts : number[][][] = obstacle_verts[i] ;
        for (let n = 0; n < cverts.length; n++){
            let cvert : number[][] = cverts[n]
            room_array.push([cvert[0][0] * 100, cvert[0][1] * 100]);
            if(n == cverts.length - 1){
                room_array.push([cvert[1][0] * 100, cvert[1][0] * 100]);
            }
        }
    }
    console.log(room_array);
    chkdata = {
        "id": currentRoom.id,
        "room_name": currentRoom.name,
        "room_area": 0,
        "room_vertices": room_array,
        "extinguisher_vertices" : [],
        "path_vertices": [],
        "rating": 0,
        "result": "NA"
    }
    setResults([chkdata]);
  }, [currentRoom]);

  return (
    <div className="border border-primary/10 rounded-md flex justify-center items-center"
      style={{ height: "calc(100vh - 180px)", overflow: "hidden" }}>

      {results.length !== 0 ? (
        <PlanSVG resultData={results[0]} />
      ) : (
        <div className="text-2xl text-gray-200 font-bold"> Loading ...</div>
      )}

    </div>
  );
};

export default ExtinguisherPlan;
