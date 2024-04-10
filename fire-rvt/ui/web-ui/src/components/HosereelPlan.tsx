import { useState, useEffect, useContext } from "react";
import { FloorProps, ResultContext } from "../contexts/ResultContext";
import PlanSVG from "./PlanSVG";
import { InferResultProps, CheckResultProps } from "./Interfaces";

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
    obstacle_vertices: [],
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
    floor: {"id":"", "name": "", "rooms":[]},
    uncovered: []
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
    obstacle_vertices: [],
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
    floor: {"id":"", "name": "", "rooms":[]},
    uncovered: []
  },
];

const HosereelPlan = () => {
  const [results, setResults] = useState<
    CheckResultProps[] | InferResultProps[]
  >([]);

  const context = useContext(ResultContext);

  const {
    checkResultData,
    setCheckResultData,
    inferResultData,
    setInferResultData,
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
  }, []);*/

  return (
    <div
      className="border border-primary/10 rounded-md flex justify-center items-center"
      style={{ height: "calc(100vh - 180px)", overflow: "hidden" }}
    >
      {results.length !== 0 ? (
        <PlanSVG resultData={results[0]} />
      ) : (
        <div className="text-2xl text-gray-200 font-bold"> Loading ...</div>
      )}
    </div>
  );
};

export default HosereelPlan;
