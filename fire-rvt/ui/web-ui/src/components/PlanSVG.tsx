/**
 * PlanSVG.tsx
 * Component for rendering floorplans as SVGs.
 */
import { useEffect } from "react";
// TODO: Props to be changed based on result output of AI model. Shared between check and infer result props.
// Bob: vertices may not have to be supplied at the start

interface ResultProps {
  id: string;
  room_name: string;
  room_area: number;
  room_vertices: [number, number][];
  extinguisher_vertices: [number, number][];
  path_vertices: [number, number][];
  rating: number;
  result: string;
}

/**
 * Loading only the room as a polyline.
 * Data are a list of polylines.
 * Polylines are composed of multiple line segments
 * Polylines in the 0th index is the largest
 * 1st index onwards are columns / other obstacles
 * whose vertices have to be reversed to render properly
 * @author Bob YX Lee
 */
function loadRoom(data : any){
    let room = data["detail"];
    console.log(room);
}

const PlanSVG = ({ resultData }: { resultData: ResultProps }) => {
  let roomPoints = resultData.room_vertices
    .map((vertex) => vertex.join(","))
    .join(" ");
  let pathPoints = resultData.path_vertices
    .map((vertex) => vertex.join(","))
    .join(" ");

  useEffect(()=>{
    document.addEventListener("draw-room", (data)=>{
        loadRoom(data)
    }); 
  });

  return (
    <div>
      {!resultData || !resultData.room_vertices ? (
        <div>Loading...</div>
      ) : (
        <svg
          viewBox="0 0 12000 24000"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "100%", height: "auto" }}
        >
          {/* Draw the room 
          MUST be an SVG path*/}
          <polygon
            points={roomPoints}
            fill="lightblue"
            stroke="blue"
            strokeWidth="100"
          />
          {/* Draw the extinguisher points */}
          {resultData.extinguisher_vertices.map((vertex, index) => (
            <circle
              key={index}
              cx={vertex[0]}
              cy={vertex[1]}
              r="300"
              fill="red"
            />
          ))}
          {/* Drawing the path with a polyline as a dotted line */}
          <polyline
            points={pathPoints}
            fill="none"
            stroke="red"
            strokeWidth="100"
            strokeDasharray="200,200" // This creates the dotted pattern
          />
        </svg>
      )}
    </div>
  );
};

export default PlanSVG;
