/**
 * PlanSVG.tsx
 * Component for rendering floorplans as SVGs.
 */
import { Zoom } from '@visx/zoom';
import { FloorProps } from '@/contexts/ResultContext';
import {roomToRoomObs} from './ExtinguisherPlan';

interface ResultProps {
id: string;
room_name: string;
room_area: number;
room_vertices: number[][];
obstacle_vertices : number[][][];
extinguisher_vertices: number[][];
path_vertices: number[][];
rating: number;
result: string;
floor: FloorProps;
}

const width = 2400;
const height = 2400;
const ext_rad = 300;

const initial_transform = {
    scaleX : 0.008
    ,scaleY : 0.008
    ,translateX: 50
    ,translateY: 1200
    ,skewX: 0
    ,skewY: 0
}

function vToPath(verts : number[][]){
    let path_string = "";
    for(let i = 0; i < verts.length; i++){
        let cvert = verts[i];
        let ostr = ""
        if(i == 0){
            ostr += "M "
        }else{
            ostr += "L "
        }
        ostr += `${cvert[0]} ${-cvert[1]} `
        path_string += ostr;
    }
    return path_string;
}

function roomToPath(room_verts : number[][], obs_verts: number[][][]){
    let path_string = vToPath(room_verts);
    for(let i = 0; i < obs_verts.length; i++){
        path_string += vToPath(obs_verts[i]);
    }
    //console.log(path_string);
    return path_string;
}

function floorToPath(floor : FloorProps){
    let path_string = "";
    if(floor.rooms === null){ return }
    for (let i = 0; i < floor.rooms.length; i++){
        let room = floor.rooms[i];
        let rmobs = roomToRoomObs(room);
        path_string += roomToPath(rmobs.room_array, rmobs.obs_array);
    }
    //console.log(path_string);
    return path_string;
}

const PlanSVG = ({ resultData }: { resultData: ResultProps }) => {
    // Draw Extinguisher Circles
    let roomPath = roomToPath(resultData.room_vertices, resultData.obstacle_vertices);
    let floorPath = floorToPath(resultData.floor);
    let exts = resultData.extinguisher_vertices;

    return (
            <div style={{width:"100%"}}>
            {!resultData || !resultData.room_vertices ? (
                    <div>Loading...</div>
                    ) : (
                        <Zoom<SVGSVGElement> 
                        width = {width} 
                        height = {height} 
                        scaleXMin = {1/200} 
                        scaleXMax = {1}
                        scaleYMin = {1/200}
                        scaleYMax = {1}
                        initialTransformMatrix = {initial_transform}
                        >
                        {(zoom)=>
                        <div className="relative">
                        <svg width = {width} height = {height} 
                        style={{cursor : zoom.isDragging? 'grabbing' : 'grab', touchAction: 'none'}}
                        ref = {zoom.containerRef}>
                        <g transform = {zoom.toString()}>
                            <path
                            id = "floor-plan"
                            d = {floorPath}
                            fill="lightgray"
                            stroke="gray"
                            strokeWidth="100"
                            />

                            <path
                            id = "room-plan"
                            d = {roomPath}
                            fill="lightblue"
                            stroke="blue"
                            strokeWidth="100"
                            />

                           {exts.map((vertex, index) => (
                               <circle
                               key={index}
                               cx={vertex[0]}
                               cy={-vertex[1]}
                               r={ext_rad}
                               fill="red"
                               />
                           ))}
                            
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
