"""
Math2D.py
Convenience functions for paths.
"""
import numpy as np
import drawsvg as dw

FIRE_ROUTE = "http://localhost:41982/travel"

def pathLength(path):
    dist = 0
    for i, l, in enumerate(path):
        if i == len(path) - 1: continue
        dist += distance2D(l, path[i+1])
        pass
    return dist

def drawTravel(drawing, start, end, SCALE = 100, stroke = "blue", failstroke = "orange", fill="none", API = FIRE_ROUTE):
    mesh = data["navmesh"]
    start = list(start[0:2])
    end = list(end[0:2])
    payload = {"mesh": mesh, "start":start, "end": end}
    res = requests.post(API, json = payload)

    travel = res.json()["result"]
    distance = pathLength(travel)
    if(distance > 15000): stroke = failstroke
    tpath = dw.Path(stroke = 'blue', fill = 'none')
    for i, p in enumerate(travel):
        if(i == 0): tpath.M(p[0]/SCALE, -p[1]/SCALE); continue
        tpath.L(p[0]/SCALE, -p[1]/SCALE)
        pass
    drawing.append(tpath)
    return pathLength(travel)
