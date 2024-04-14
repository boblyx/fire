"""
Room.py

functions for generating and checking rooms

TODO:
- [ ] Add random obstacles for synth
"""
__author__ = "Bob YX Lee"

from .Poly2D import rect2D, circle2D, getLines
from .Bool2D import union
from .PointCloud import most_remote
from .Path2D import getTravelPath2D
from .Line2D import slotsFromLines

from copy import deepcopy
from pprint import pprint
import random
import pyclipper
import numpy as np
import requests

FIRE_ROUTE = "http://localhost:41982/travel"; # TODO: Transfer to .env

def randRect(widths = list(range(5000,10000)),
             depths = list(range(5000,7000)),
             origin = [0,0]):

    return rect2D(random.choice(widths), random.choice(depths), origin)

class Room:
    def __init__(self):
        self.vertices = []
        self.obstacles = []
        self.anchors = []
        self.rects = []
        self.ext_slots = []
        self.faces = []
        self.navmesh = {}
        pass

    @staticmethod
    def fromDict(room_dict : dict):
        """ 
        Generates a room object from 
        a dictionary
        """
        room = Room()
        for key, value in room_dict.items():
            if not hasattr(room, key): continue
            print(key)
            setattr(room, key, value)
        return room

    @staticmethod
    def fromLines(line_sets : list):
        """
        Generates a Room object from
        a list of sets of lines
        e.g. [ main, obs1, obs2 ...]
        main => [line1, line2, ...]
        line1 => [start, end]
        start => [0,0,0]
        """
        vertices = []
        for i, ls in enumerate(line_sets):
            for n, l in enumerate(ls):
                vertices.append(l[0])
                if(n == len(ls) - 1):
                    vertices.append(ls[0][0])
                pass
            pass
        room = Room()
        room.vertices = vertices
        return room

    @staticmethod
    def random(iters = 1, div_len = 2000):
        """
        Generates a random room
        TODO: Auto generate navmesh!
        """
        cit = 0
        result = []
        anchors = []
        rects = []
        while(cit < iters):
            if len(result) == 0:
                rect_a = randRect()
                rects.append(rect_a)
            else:
                rect_a = result
            lines = getLines(rect_a, True)
            side = random.choice(list(range(len(lines))))
            divvy = []
            divvy.extend(lines[side].divideByLength(div_len))
            if len(divvy) == 0:
                if len(result) == 0: result = rect_a; break;
                else: break;
            pts = [l.mid for l in divvy]
            next_pt = random.choice(pts)
            anchors.append(next_pt)
            rect_b = randRect(origin = next_pt)
            result = union([rect_a], [rect_b])
            rects.append(rect_b)
            result = result[0]
            cit += 1
        room = Room()
        room.vertices = result
        room.anchors = anchors
        room.rects = rects
        return room

    def gExtSlots(self, div_len = 1000):
        """
        Generate places where extinguishers may be placed.
        TODO: add for obstacles
        """
        blines = getLines(self.vertices, True)
        olines = []
        for o in self.obstacles:
            olines.extend(getLines(o, True))
        slots = []

        slots.extend(slotsFromLines(blines))
        slots.extend(slotsFromLines(olines))

        self.ext_slots = slots
        return self.ext_slots

    def extCoverChk(self, exts):
        """
        PASS 1: Check coverage
        """
        pc = pyclipper.Pyclipper()
        
        ext_circs = []
        for e in exts:
            ext_circs.append(circle2D(15000, 32, e))
        
        pc.AddPaths([self.vertices], pyclipper.PT_SUBJECT, True)
        pc.AddPaths(ext_circs, pyclipper.PT_CLIP, pyclipper.PFT_POSITIVE)
        sln = pc.Execute(pyclipper.CT_DIFFERENCE, pyclipper.PFT_POSITIVE, pyclipper.PFT_POSITIVE)
        comply = False
        if len(sln) == 0:
            comply = True
        return {"result": comply, "coverage": ext_circs ,"diff": sln}
    
    def extTravelChk(self, navmesh, exts):
        """
        PASS 2: Check travel distance from remote point
        to each extinguisher. If one of the paths
        is < 15m, it passes.
        """
        # Find remote point using exts 
        boundary2d = []
        for b in self.vertices:
            boundary2d.append(b[0], b[1])

        for o in self.obs:
            o.reverse()
        for o in self.obs: boundary2d += o;
        blines = getLines(boundary2d)
        
        # Most remote point out of all extinguishers
        rp = most_remote(exts, boundary2d)
        payload = {"paths": [], "result": "FAIL"}
        for pt in exts:
            path = getTravelPath2D(navmesh, pt, rp)
            # If one of the paths are within 15m, it passes.
            if(path["distance"] < 15000): payload["result"]  = "PASS"
            payload["paths"].append(path)
        return payload
    pass
pass
