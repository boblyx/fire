"""
Poly2D.py
Convenience functions for polygon related
operations
"""
__author__ = "Bob YX Lee"

import numpy as np
import drawsvg as dw
from .Line2D import Line2D
from copy import deepcopy


def drawCoverage(drawing, pt, SCALE = 100):
    """
    Draws circle coverage of an extinguisher.
    """
    drawing.append(dw.Circle(pt[0]/SCALE, -pt[1]/SCALE, 15000/SCALE, fill='yellow', fill_opacity=0.3))
    drawing.append(dw.Circle(pt[0]/SCALE, -pt[1]/SCALE, 5, fill='red'))
    pass

def polyArea(path):
    """
    :param path: List of vertices.
    :return: Area of a polygon formed by vertices.
    :rtype: float
    """
    if len(path == 0): return 0
    x = np.array([point[0] for point in path])
    y = np.array([point[1] for point in path])
    return 0.5 * np.abs(np.dot(x, np.roll(y, 1)) - np.dot(y, np.roll(x, 1))) 

def drawPath(dwg, path, closed = False, SCALE= 100, fill="yellow", fill_opacity = 0.3, stroke = "black"):
    """
    Draws a path using drawsvg.
    """
    dpath = dw.Path(fill = fill, fill_opacity = fill_opacity, stroke = stroke)
    for i, v in enumerate(path):
        if i == 0: 
            dpath.M(v[0]/SCALE, -v[1]/SCALE) 
            continue
        dpath.L(v[0]/SCALE, -v[1]/SCALE)
        if closed == True and i == len(path) - 1:
            dpath.L(path[0][0]/SCALE, - path[0][1]/SCALE)
    dwg.append(dpath)

def circle2D(radius, nv, center = (0,0), endpoint = False):
    """
    Return vertices of a circle.
    """
    theta = np.linspace(0, 2 * np.pi, nv, endpoint=endpoint)
    x = radius * np.cos(theta)
    y = radius * np.sin(theta)

    vertices = np.vstack((x,y)).T
    moved_verts = []
    for v in vertices:
        moved_verts.append((v[0]+center[0], v[1] + center[1]))
    return moved_verts

def rect2D(width, depth, origin = [0,0]):
    """
    Return vertices of a rectangle.
    """
    A = origin
    B = [origin[0], origin[1] + depth]
    C = [origin[0] + width, origin[1] + depth]
    D = [origin[0] + width, origin[1]]

    return [A,B,C,D]

MIR_IDX = {"X": 0, "Y": 1}

def mirror(poly, origin = [0,0], axis = "X"):
    midx = MIR_IDX[axis]
    mirrored = []
    for p in poly:
        if abs(p[midx] - origin[midx]) < 1: 
            mirrored.append(p)
            continue
        mp = deepcopy(p)
        mp[midx] = -p[midx]  + origin[midx]
        mirrored.append(mp)
    mirrored.reverse()
    return mirrored

def getLines(poly, closed = False):
    """
    Return lines of a polygon.
    """
    lines = []
    for i, p in enumerate(poly):
        if i == len(poly) - 1 : break
        pt = list(p)
        start = [pt[0], pt[1]]
        if closed == True and i == len(poly) - 1:
            end = [list(poly[0])[0], list(poly[0])[1]]  
        else:
            end = [list(poly[i+1])[0], list(poly[i+1])[1]]
        lines.append(Line2D(start, end))
    return lines
