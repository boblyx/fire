import {useState, useEffect} from "react";
import { Flame, FireExtinguisher, CircleDot} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import SelectForm from "../components/SelectForm";
import ResultPanel from "../components/ResultPanel";

import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";

const Landing = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); 

  return (
    <div className="w-full h-full py-5 px-10 overflow-hidden">
      <div className="flex justify-start space-x-3 mb-4 font-bold text-3xl">
        <div>Fire AI</div>
        <Flame size={36} />
      </div>
      <Separator />
      <div className="grid grid-cols-5 mt-4 space-x-4">
        <div className="flex flex-col space-y-4">
          <div className="font-bold text-2xl text-start">Select</div>
          <div className="flex-1">
            <SelectForm />
          </div>
          <div className="font-bold text-2xl text-start">Results</div>
          <div className="flex-1">
            <ResultPanel />
          </div>
        </div>
        <div className="col-span-4 space-y-4">
          <div className="flex flex-wrap justify-start space-x-4">
            <div className="font-bold text-2xl text-start">Viewer</div>
            <Button
              size="sm"
              disabled={isLoading}
              onClick={() => {
                navigate("/extinguisher-plan");
              }}
            >
              Extinguisher <FireExtinguisher className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="sm"
              disabled={isLoading}
              onClick={() => {
                navigate("/hosereel-plan");
              }}
            >
              Hosereel <CircleDot className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Landing;
