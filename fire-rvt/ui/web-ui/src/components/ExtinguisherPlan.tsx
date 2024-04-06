/**
 * Controls contents of Plan view for Extinguishers
 */
import { useState, useEffect, useContext } from "react";
import { ResultContext, RoomProps } from "../contexts/ResultContext";
import PlanSVG from "./PlanSVG";
import { CheckResultProps, InferResultProps } from "./Interfaces";

function linesToVerts(cverts : number[][][]){
    let oset : number[][] = []
    for (let n = 0; n < cverts.length; n++){
        let cvert : number[][] = cverts[n]
        oset.push([cvert[0][0] * 100, -cvert[0][1] * 100]);
        if(n == cverts.length - 1){
            oset.push([cverts[0][0][0] * 100, -cverts[0][0][1] * 100]);
        }
    }
    return oset
}

export function roomToRoomObs(room : RoomProps){
    let main_verts = room.vertices[0];
    let obstacle_verts : number[][][][] = [];
    if(room.vertices.length > 1){
        obstacle_verts = room.vertices.slice(1);
        //obstacle_verts.map((arr) => {arr.reverse();});
    }
    let room_array = [];
    let obs_array = [];
    room_array = linesToVerts(main_verts);
    for(let i = 0; i < obstacle_verts.length; i++){
        let cverts : number[][][] = obstacle_verts[i] ;
        let oset = linesToVerts(cverts)
        obs_array.push(oset);
    }
    return {"room_array": room_array, 
    "obs_array": obs_array}
}

const ExtinguisherPlan = () => {
  let chkdata : any;
  const [results, setResults] = useState<
    CheckResultProps[] | InferResultProps[]
  >([]);
  const context = useContext(ResultContext);
  const {
    setCheckResultData,
    currentRoom,
    currentFloor,
  } = context;
  useEffect(()=>{
    let {room_array, obs_array} = roomToRoomObs(currentRoom);
    chkdata = {
        "id": currentRoom.id,
        "room_name": currentRoom.name,
        "room_area": 0,
        "room_vertices": room_array,
        "obstacle_vertices": obs_array,
        "extinguisher_vertices" : [],
        "path_vertices": [],
        "rating": 0,
        "result": "NA",
        "floor": currentFloor
    }
    setResults([chkdata]);
    setCheckResultData([chkdata]);
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
