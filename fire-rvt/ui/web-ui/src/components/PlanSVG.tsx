// TODO: Props to be changed based on result output of AI model. Shared between check and infer result props.
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

const PlanSVG = ({ resultData }: { resultData: ResultProps }) => {
  const roomPoints = resultData.room_vertices
    .map((vertex) => vertex.join(","))
    .join(" ");
  const pathPoints = resultData.path_vertices
    .map((vertex) => vertex.join(","))
    .join(" ");

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
          {/* Draw the room */}
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
