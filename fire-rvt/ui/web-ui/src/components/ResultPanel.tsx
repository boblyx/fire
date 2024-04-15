/**
 * UI element for results panel where
 * results of AI evaluation are shown.
 */
import React, { useState, useEffect, useContext} from "react";
import axios from "axios";

import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import { InferResultProps, CheckResultProps } from "./Interfaces";

import { ResultContext } from "../contexts/ResultContext";

// TODO: Props to be changed based on result output of AI model
interface ResultProps {
  checkResults: CheckResultProps[];
  inferResults: InferResultProps[];
}

const ResultPanel: React.FC<ResultProps> = ({ checkResults, inferResults }) => {
  const [results, setResults] = useState<
    CheckResultProps[] | InferResultProps[]
  >([]);

  const { toast } = useToast();
  const context = useContext(ResultContext);

  const {
    checkResultData,
    currentRoom,
  } = context;

  useEffect(()=>{
    console.log(checkResultData);
    if(checkResultData.length <= 0) { return };
    if(checkResultData == undefined){ return };
    setResults(checkResultData);
  }, [checkResultData]);

  const exportExtinguisherPlacement = async () => {
    try {
      // Question: Only export infer results to Revit?
      // TODO: To replace with actual API endpoint
      const payload = inferResults;
      await axios.post(
        "https://your-api-endpoint.com/exportExtinguisher",
        payload,
      );
      toast({
        variant: "success",
        title: "Success!",
        description: "Extinguisher placement data exported successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description:
          "Failure to export extinguisher placement data. Please try again.",
      });
    }
  };

  return (
    <div className="border border-primary/10 rounded-md bg-white drop-shadow-md h-full p-4">
      {results.length === 0 ? (
        <div className="font-bold">
          <div>No Results to Show!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 space-y-4">
          <div className="flex justify-between">
            <div className="font-bold">Room:</div>
            <div>{results[0].room_name}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-bold">Area:</div>
            <div>
              {results[0].room_area}
              <span className="ml-2">
                m<sup>2</sup>
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="font-bold" style={{color:"red"}}>No. 🧯:</div>
            <div>{results[0].extinguisher_vertices.length}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-bold" style={{color:"magenta"}}>No. Suggested 🧯+ :</div>
            <div>{results[0].suggested_exts.length}</div>
          </div>
          {/*
          <div className="flex justify-between">
            <div className="font-bold">Rating:</div>
            <div>{results[0].rating}</div>
          </div>*/}
          <div className="flex justify-between">
            <div className="font-bold">Compliance:</div>
            <div className="border px-2 rounded-md bg-green-400 font-bold">
              {results[0].result}
            </div>
          </div>
          <div className="w-full flex justify-start pt-10">
            <Button
              disabled={results.length === 0}
              onClick={() => {
                exportExtinguisherPlacement();
              }}
            >
              Export to Revit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPanel;
