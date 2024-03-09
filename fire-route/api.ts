import express from 'express';
//import { v4 as uuid4 } from 'uuid';
//import { config } from 'dotenv';

import { getPathsFromStr, findMats, Mat, toScaleAxis } from 'flo-mat';
import { drawMats } from './src/MAT'

const app = express();
app.use(express.json())

const port = 41414

function getDate(tag=false){
    let date = Date.now();
    let date_o = new Date(date);
    let date_now = `${date_o.getFullYear()}-${date_o.getMonth()}
    -${date_o.getDate()}@${date_o.getHours()}:${date_o.getMinutes()}
    -${date_o.getSeconds()}:${date_o.getMilliseconds()}`;
    if(tag === false){ return date_now }
    return `[${date_now}]`
}

/**
 * `/mat` 
 * Receives a string parameter which is an SVG string
 * Returns node-link graph of the SAT.
 */
app.post('/mat', (req, res) => {
    console.log(`POST request received`);
    console.log(req.body)
    try{
        let svg_str = req.body["svg"];
        let bezier_loops = getPathsFromStr(svg_str);
        let mats = findMats(bezier_loops, 3);
        let sats = mats.map(mat => toScaleAxis(mat, 3));
        let node_link_graph = drawMats(sats, null, 'sat', true);
        res.status(200).send({"status": "success", "out": node_link_graph})
        return
    }catch(err){
        res.status(422).send({"status": "failed"});
        return
    }
    return;
});

app.listen(port, () => {
    console.log(`fire-route server, running on port ${port}`);
});
