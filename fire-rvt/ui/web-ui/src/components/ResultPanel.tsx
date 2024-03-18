import React from 'react'

// TODO: Props to be changed based on result output of AI model
interface CheckResultProps {
  id: string;
  room_name: string;
  room_area: string;
  room_vertices: [number, number][];
  extinguisher_vertices: [number, number][];
  path_vertices: [number, number][];
  rating: number; 
  result: string; 
}

// TODO: Props to be changed based on result output of AI model
interface InferResultProps {
  id: string;
  room_name: string;
  room_area: string;
  room_vertices: [number, number][];
  extinguisher_vertices: [number, number][];
  path_vertices: [number, number][];
  rating: number;
  result: string;
}

// TODO: Props to be changed based on result output of AI model
interface ResultProps {
  checkResults: CheckResultProps[]; 
  inferResults: InferResultProps[];
}

// Dummy Check Result Data 

const ResultPanel: React.FC<ResultProps> = ({checkResults, inferResults}) => {
  return (
    <div
      className="border border-primary/10 rounded-md bg-white drop-shadow-md h-full"
    >
      ResultPanel
    </div>
  );
}

export default ResultPanel