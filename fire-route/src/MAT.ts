/**
 * MAT.ts
 * Provides packaged functions for MAT/SAT compute.
 * TODO:
 * 
 * @author Bob YX Lee
 */

import { findMats, getPathsFromStr, Mat, traverseEdges, toScaleAxis, isTerminating, matCurveToNextVertex, getCurveToNext } from 'flo-mat';
const NS = 'http://www.w3.org/2000/svg'; // Svg namespace

/**
 * Returns an SVG path string of a line.
 * @param ps The line endpoints.
 * @author Floris Steenkamp
 */
function getLinePathStr(ps: number[][]) {
    let [[x0,y0],[x1,y1]] = ps;
    return `M${x0} ${y0} L${x1} ${y1}`;
}

/**
 * Returns an SVG path string of a quadratic bezier curve.
 * @param ps The quadratic bezier control points.
 * @author Floris Steenkamp
 */
function getQuadBezierPathStr(ps: number[][]) {
    let [[x0,y0],[x1,y1],[x2,y2]] = ps;
    return `M${x0} ${y0} Q${x1} ${y1} ${x2} ${y2}`;
}

/**
 * Returns an SVG path string of a cubic bezier curve.
 * @param ps The cubic bezier control points.
 * @author Floris Steenkamp
 */
function getCubicBezierPathStr(ps: number[][]) {
    let [[x0,y0],[x1,y1],[x2,y2],[x3,y3]] = ps;
    return `M${x0} ${y0} C${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`;
}


/**
 * Returns a function that draws an array of MAT curves on an SVG element.
 * @param mats An array of MATs to draw.
 * @param svg The SVG element on which to draw.
 * @param type The type of MAT to draw. This simply affects the class on the 
 * path element.
 * @author Floris Steenkamp
  */
export function drawMats(
        mats: Mat[],
        svg: SVGSVGElement,
        type: string /* 'mat' | 'sat' */) {

    let beziers = [];
    mats.forEach(f);
    /**
     * Draws a MAT curve on an SVG element.
     */
     function f(mat: Mat) {
       let cpNode = mat.cpNode;
       console.log(cpNode);
        
        if (!cpNode) { return; }

        let fs = [,,getLinePathStr, getQuadBezierPathStr, getCubicBezierPathStr];

        traverseEdges(cpNode, function(cpNode) {
            if (isTerminating(cpNode)){return}
            let bezier = getCurveToNext(cpNode);
            if (!bezier) { return; }
            //console.log(bezier);
            let $path = document.createElementNS(NS, 'path');
            $path.setAttributeNS(
                null, 
                "d", 
                fs[bezier.length](bezier)
            );
            $path.setAttributeNS(null, "class", type);

            svg.appendChild($path);
            beziers.push(bezier);
        });
     }
     console.log(beziers.length)
     toGraph(beziers);
}

/**
 * Converts to a node-link graph for NetworkX
 */
function toGraph(beziers : number[][]){
  let out : any = {"nodes": [], "links": []}
  let vertex_set = new Set();
  let edges : any = [];
  let count = 0;
  for(let i = 0; i < beziers.length; i++){
    let curr_bez = beziers[i];
    let start = curr_bez[0];
    let end = curr_bez[curr_bez.length - 1];
    vertex_set.add(start);
    vertex_set.add(end);
  }

  let vertices : any = [... vertex_set];

  // console.log(vertices);

  for(let i = 0; i < beziers.length; i++){
    let curr_bez = beziers[i];
    let start = curr_bez[0];
    let end = curr_bez[curr_bez.length - 1];
    let sid = vertices.indexOf(start);
    let eid = vertices.indexOf(end);
    edges.push({"id": "e" + String(i), "source": sid, "target": eid});
  }

  //console.log(edges);

  for(let i = 0; i < vertices.length; i++){
    let cv = vertices[i];
    let d : any = {"id": i, "x": cv[0], "y": cv[1]}
    out["nodes"].push(d);
  }

  out["links"] = edges;
  console.log(out);
}
