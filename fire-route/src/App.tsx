/**
 * App.tsx
 * Renders the whole app.
 * TODO:
 * 
 * @author Bob YX Lee
 */

import { onCleanup, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import * as bootstrap from 'bootstrap';
import {SVG} from '@svgdotjs/svg.js';
import { getPathsFromStr, findMats, Mat, traverseEdges, toScaleAxis } from 'flo-mat';
import { drawMats } from './MAT';

let svg_canvas : HTMLDivElement;

function sample(){
  let draw = SVG()
  draw.viewbox(0,0, 900, 500);
  draw.addTo('#svg-canvas');
  let path_str = `
    M 0 0 C 0 0 0 0 200 0 C 200 8 200 8 200 232 C 192 232 8 232 0 232 C 0 8 0 0 0 0 M 80 104 C 96 104 112 104 136 104 C 136 88 136 72 136 64 C 112 64 96 64 80 64 M 61 190 L 91 190 V 158 H 61    `
  
  /*
  path_str = `
        M 144 251
        C 145 169 110 82 227 59 
        C 344 36 429 -46 505 96 
        C 581 238 696 407 554 435 
        C 412 463 191 532 197 442 
        C 203 352 213 363 276 346 
        C 339 329 563 318 437 242 
        C 311 166 302 181 297 314 
        C 292 447 160 585 151 419 
        C 142 253 87.12 312.78 86 314 
        C 87.16 312.74 142.8632 252.2348 144 251 
        z
  `*/
  draw.path(path_str)
  //let rect = draw.rect(100,100).attr({fill:'#f06'});
  let svg = draw.node;
  let path = draw.node.children[0];
  path.classList.add('shape-path');
  console.log(draw.node.children[0]);
  let bezier_loops = getPathsFromStr(path_str);
  let mats = findMats(bezier_loops, 3);
  let sats = mats.map(mat => toScaleAxis(mat, 3));
  //drawMats(mats, svg, 'mat');
  drawMats(sats, svg, 'sat');
}

const App: Component = () => {

  onMount(()=>{
    sample();
  });

  let r = (
    <>
      <div class="m-4">
      <h1>hrchk</h1>
      <div>
        <button type="button" class="btn btn-primary">Upload Floor Representation</button>
      </div>
      <hr/>
        <div ref = {svg_canvas} id = "svg-canvas" style="width: 600px; height:500px"></div>
      </div>
    </>
  )

  return r;

};

export default App;
