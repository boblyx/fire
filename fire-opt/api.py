"""
fire-opt FastAPI server
For rule based solving of extinguisher problems.

"""
__author__ = "Bob YX Lee"

import json
import sys
import os
from uuid import uuid4

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

class RoomModel(BaseModel):
    faces: list[list[int]]
    vertices: list[list[float]]
    model_config = \
            {
            "json_schema_extra": {
                "examples":
                [
                    {
                        "faces": [[0,1,2]]
                        ,"vertices": [[0,0], [1,1], [2,0]]
                    }
                ]
                }
            }
    pass

"""
COVERAGE ENDPOINTS
"""

@app.post("/check/coverage")
async def check_coverage(
        room_dict : RoomModel
        ,exts : list[list[float]] = [[0.5,0.5]]
        ):
    """
    For a given room and extinguisher slots,
    compute whether pass 1 succeeds
    """
    room = Room.fromDict(room_dict.__dict__)
    compliance = room.extCoverChk(room.ext_slots)
    result = compliance
    return result

@app.post("/solve/coverage")
async def solve_coverage():
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
async def check_travel():
    """For evaluation of travel distance.
    STUB
    """
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
