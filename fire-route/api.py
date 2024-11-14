"""
fire-route python API server
This is made due to discovering SAT may not be
the most appropriate for finding shortest path.
Instead, we use the Navmesh method.

"""

__author__ = "Bob YX Lee"
import os
import json
from uuid import uuid4

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from FireRoute import Compute

env = os.environ

app = FastAPI()
host = "0.0.0.0"

port = int(env["API_PORT"])


origins =["*"]
app.add_middleware(
        CORSMiddleware,
        allow_origins = origins,
        allow_credentials = True,
        allow_methods = ["*"],
        allow_headers = ["*"]
        )

class Mesh(BaseModel):
    faces: list[list[int]]
    vertices: list[list[float]]

    model_config = \
            {
            "json_schema_extra":{
                "examples": 
                    [
                        {
                            "faces": [[0, 1, 2]]
                            ,"vertices": [[0,0], [1,1], [2, 0]]

                        }
                    ]
                }
            }
    pass


@app.post("/travel")
async def travel(
        mesh : Mesh
        ,start : list[float]
        ,end : list[float]
        ):
    """
    Returns list of points forming the shortest path between 2 points
    given a Navmesh, start point and end point.

    """
    m = json.loads(mesh.json())
    #result = {"x":"x"}
    result = {"result": Compute.routeFromNavmesh(m, start, end)}
    return result

@app.post("/svg_path")
async def svg_path(
        path : list[list[float]]
        ):
    """
    (WIP) Returns an SVG path given a list of vertices.
    Input coordinate system assumes +X+Y as opposed to SVG's +X-Y system.

    """
    pass

if __name__ == "__main__":
    print("fire-route API")
    uvicorn.run("api:app", host=host, port = port, log_level="info", reload=True)
    pass
