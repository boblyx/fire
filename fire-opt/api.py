"""
fire-opt FastAPI server
For rule based solving of extinguisher problems.

"""
__author__ = "Bob YX Lee"

import json
import sys
import os
from time import time
from uuid import uuid4
from pprint import pprint

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

sys.path.append("./packages")

from geom.Room import Room

app = FastAPI()
host = "0.0.0.0"
port = 41983

origins =["*"]
app.add_middleware(
        CORSMiddleware,
        allow_origins = origins,
        allow_credentials = True,
        allow_methods = ["*"],
        allow_headers = ["*"]
        )

class NavMesh(BaseModel):
    vertices: list[list[float]]
    faces: list[list[float]]
    model_config = \
            {
            "json_schema_extra": {
                "examples":
                    [
                        {
                            "vertices": [[0,0], [1,1], [2,0]]
                            ,"faces": [[0,1,2]]
                        }
                    ]
                }
            }
    pass

class RoomModel(BaseModel):
    vertices: list[list[float]]
    obstacles: list[list[list[float]]]
    model_config = \
            {
            "json_schema_extra": {
                "examples":
                    [
                        {
                            "vertices": [[0,0], [1,1], [2,0]]
                            ,"obstacles":[
                                [[0.1,0.1],[0.1,0.2],[0.2,0.2]]
                                         ]
                        }
                    ]
                }
            }
    pass

class SlotResolution(BaseModel):
    units: int
    model_config = \
            {
            "json_schema_extra": {
                    "examples":
                    [
                        {
                            "units": 1000
                        }
                    ]
                }
            }
    pass

class SolveOptions(BaseModel):
    skip_travel: bool
    model_config = \
            {
            "json_schema_extra": {
                    "examples":
                    [
                        {
                            "skip_travel": True
                        }
                    ]
                }
            }
    pass

"""
SOLVER ENDPOINTS
"""
@app.post("/ext_solve_all")
async def ext_solve_all(
        room_dict : RoomModel = {"vertices": [[0,0], [1,1], [2,0]], "obstacles": []}
        ,navmesh : NavMesh = {"vertices": [[0,0], [1,1], [2,0]],"faces": [[0,1,2]]}
        ,exts : list[list[float]] = [[0,0]]
        ,resolution : SlotResolution = {"units": 1000}
        ,solve_options : SolveOptions = {"skip_travel": True}
        ):
    """
    Use rule based solver to propose extinguisher locations.
    """
    st = time()
    rm = Room.fromDict(room_dict.__dict__)
    res = {"exts": []}
    exslt = rm.gExtSlots(resolution.__dict__["units"])
    try:
        res["exts"] = rm.extSolve(navmesh.__dict__, exslt, exts, solve_options["skip_travel"])
        et = time()
        rt = (et - st) * 1000
        print("Extinguisher placement completed in %1.2fms!" % rt)
    except Exception as e:
        print(e)
        result = {"error": "Error occured...!"}
        return result
    return res

"""
COVERAGE ENDPOINTS
"""
@app.post("/check/coverage")
async def check_coverage(
        room_dict : RoomModel
        ,navmesh : NavMesh
        ,exts : list[list[float]]
        ):
    """
    For a given room and extinguisher slots,
    compute whether pass 1 succeeds
    """
    st = time()
    room = Room.fromDict(room_dict.__dict__)
    try:
        cover_compliance = room.extCoverChk(exts)
        travel_compliance = room.extTravelChk({"vertices": navmesh.vertices, "faces": navmesh.faces}, exts)
    except Exception as e:
        print(e);
        result = {"error": "Error occured...!"}
        return result
    res = {"cover": cover_compliance, 
           "travel": travel_compliance,
           "comply": False}
    #print(res)
    print("\t1.Coverage Compliance %s" % str(cover_compliance["result"]))
    print("\t2.Travel Compliance %s" % travel_compliance["result"])
    if(travel_compliance["result"] == "PASS" and cover_compliance["result"] == True):
        res["comply"] = True
    # Then check route
    et = time()
    rt = (et - st) * 1000
    print("Coverage checks completed in %1.2fms!" % rt)
    return res

@app.post("/solve/coverage")
async def solve_coverage(
        room_dict : RoomModel
        ,navmesh : NavMesh
        ,exts : list[list[float]]
        ):
    """For rule based solving.
    STUB
    """
    return {}

@app.post("/infer/coverage")
async def infer_coverage():
    """For AI based solving.
    STUB
    """
    return {}

"""
TRAVEL ENDPOINTS
"""
@app.post("/check/travel")
async def check_travel(
        room_dict : RoomModel
        ,navmesh: NavMesh
        ,exts: list[list[float]]
        ):
    """For evaluation of travel distance.
    STUB
    """
    room = Room.fromDict(room_dict.__dict__)
    room.navmesh = navmesh;
    return {}

@app.post("/solve/travel")
async def solve_travel():
    """For rule based solving.
    STUB
    """
    return {}

@app.post("/infer/travel")
async def infer_travel():
    """For AI based checking?
    STUB
    """
    return {}

"""
Run API Server
"""
if __name__ == "__main__":
    print("fire-opt API")
    uvicorn.run("api:app", host = host, port = port, log_level = "info", reload = True)
