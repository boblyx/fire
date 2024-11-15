import { useState, useEffect } from "react";
import {
  Flame,
  FireExtinguisher,
  CircleDot,
  MousePointerClick,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import SelectForm from "../components/SelectForm";
import ResultPanel from "../components/ResultPanel";

import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { CheckResultProps, InferResultProps } from "@/components/Interfaces";

interface FloorProps {
  id: string;
  name: string;
}

/*
 * Updates the state of the floor collection
 * */
function updateFloors(e : any = {}){
  console.log("Updating Floors!");
  console.log(e);
  let floors = e.detail?.Floors;
  if(floors == null) { return };
  document.dispatchEvent(new CustomEvent('setAllFloors', {
    "detail": floors
  }));
}

/**
 * Triggers Revit to get Floor info.
 */
function getFloors(){
  console.log("Getting Floors!");
  let wv2msg = {"action": "getFloors", "payload": String(updateFloors.name)}
  console.log(wv2msg);
  try{
    let w = window as any
    w.chrome?.webview?.postMessage(wv2msg);
  }catch(err){
    // May be able to send the function name.
    console.log("Not in Revit context. Aborting.");
  }
}

const Landing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const [checkResults, setCheckResults] = useState<CheckResultProps[]>([]);
  const [inferResults, setInferResults] = useState<InferResultProps[]>([]);


  const navigate = useNavigate();

  useEffect(()=>{
    // Create listeners for Revit to dispatch events to send data back to frontend.
    document.addEventListener('updateFloors', (e) => {updateFloors(e)});
    document.addEventListener('updateRooms', (e) => {});
    document.addEventListener('show-plan', (e) => {
        navigate("./extinguisher-plan");
        setIsViewing(true);
    });
    
    getFloors(); // On mount, ask Revit to get all the levels.
  });

  return (
    <div className="w-full h-full py-5 px-10 overflow-hidden">
      <div className="flex justify-start space-x-3 mb-4 font-bold text-3xl">
        <div>Fire</div>
        <Flame size={36} />
      </div>
      <Separator />
      <div className="grid grid-cols-5 mt-4 space-x-4">
        <div className="flex flex-col space-y-4">
          <div className="font-bold text-2xl text-start">Select</div>
          <div className="flex-1">
            <SelectForm
              setCheckResults={setCheckResults}
              setInferResults={setInferResults}
            />
          </div>
          <div className="font-bold text-2xl text-start">Results</div>
          <div className="flex-1">
            <ResultPanel
              checkResults={checkResults}
              inferResults={inferResults}
            />
          </div>
        </div>
        <div className="col-span-4 space-y-4">
          <div className="flex flex-wrap justify-start space-x-4">
            <div className="font-bold text-2xl text-start">Viewer</div>
            <Button
              size="sm"
              disabled={isLoading}
              onClick={() => {
                navigate("./extinguisher-plan");
                setIsViewing(true);
              }}>
              Extinguisher <FireExtinguisher className="w-4 h-4 ml-2" />
            </Button>
            {/*
            <Button
              size="sm"
              disabled={isLoading}
              onClick={() => {
                navigate("./hosereel-plan");
                setIsViewing(true);
              }}>
              Hosereel <CircleDot className="w-4 h-4 ml-2" />
            </Button>
            */}
          </div>
            
          {isViewing ? (
            <Outlet />
          ) : (
            <div
              className="border border-primary/10 rounded-md flex flex-col
               justify-center items-center text-2xl text-gray-400 font-semibold"
              style={{ height: "calc(100vh - 180px)" }}>
              Select Room to view.
              <MousePointerClick size={80} className="mt-2"/>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Landing;
