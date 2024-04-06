/**
 * PlanSVG.tsx
 * Component for rendering floorplans as SVGs.
 */
import { Zoom } from '@visx/zoom';

interface ResultProps {
id: string;
room_name: string;
room_area: number;
room_vertices: number[][];
extinguisher_vertices: number[][];
path_vertices: number[][];
rating: number;
result: string;
}

const width = 2400;
const height = 2400;

const PlanSVG = ({ resultData }: { resultData: ResultProps }) => {
    let roomPoints = resultData.room_vertices
        .map((vertex) => vertex.join(","))
        .join(" ");
    let pathPoints = resultData.path_vertices
        .map((vertex) => vertex.join(","))
        .join(" ");

    let roomPoints2 = [];
    return (
            <div style={{width:"100%"}}>
            {!resultData || !resultData.room_vertices ? (
                    <div>Loading...</div>
                    ) : (
                        <Zoom<SVGSVGElement> 
                        width = {width} 
                        height = {height} 
                        scaleXMin = {1/20} 
                        scaleXMax = {1}
                        scaleYMin = {1/20}
                        scaleYMax = {1}
                        >
                        {(zoom)=>
                        <div className="relative">
                        <svg width = {width} height = {height} 
                        style={{cursor : zoom.isDragging? 'grabbing' : 'grab', touchAction: 'none'}}
                        ref = {zoom.containerRef}>
                        <g transform = {zoom.toString()}>
                            <polygon
                            id = "floor-plan"
                            points={roomPoints}
                            fill="lightblue"
                            stroke="blue"
                            strokeWidth="2"
                            />
                        </g>
                        <rect 
                        width = {width} 
                        height = {height}
                        rx = {0} fill="transparent"
                        onTouchStart={zoom.dragStart}
                        onTouchMove={zoom.dragMove}
                        onTouchEnd={zoom.dragEnd}
                        onMouseDown={zoom.dragStart}
                        onMouseMove={zoom.dragMove}
                        onMouseUp={zoom.dragEnd}
                        onMouseLeave={() => {if (zoom.isDragging) zoom.dragEnd();}}/>
                            </svg>
                            </div>
                        }
                        </Zoom>
                )}
    </div>
        );
};

/*
   <svg
   viewBox="-5000 -5000 12000 12000"
   preserveAspectRatio="xMidYMid meet"
   style={{ width: "100%", height: "auto" }}
   >
   <polygon
   id = "floor-plan"
   points={roomPoints}
   fill="lightblue"
   stroke="blue"
   strokeWidth="2"
   />
   {resultData.extinguisher_vertices.map((vertex, index) => (
   <circle
   key={index}
   cx={vertex[0]}
   cy={vertex[1]}
   r="300"
   fill="red"
   />
   ))}
   <polyline
   points={pathPoints}
   fill="none"
   stroke="red"
   strokeWidth="100"
   strokeDasharray="200,200" // This creates the dotted pattern
   />
   </svg>
*/

export default PlanSVG;
