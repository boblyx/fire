"""
Room.py

functions for generating and checking rooms

TODO:
- [ ] Add random obstacles
"""
__author__ = "Bob YX Lee"

from .Poly2D import rect2D, circle2D, getLines
from .Bool2D import union
from copy import deepcopy

import random
import pyclipper
import numpy as np

def randRect(widths = list(range(5000,10000)),
             depths = list(range(5000,7000)),
             origin = [0,0]):

    return rect2D(random.choice(widths), random.choice(depths), origin)

class Room:
    def __init__(self):
        self.vertices = []
        self.anchors = []
        self.rects = []
        self.ext_slots = []
        self.faces = []
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
            setattr(room, key, value)
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
        """
        lines = getLines(self.vertices, True)
        floor_mids = []
        for l in lines:
            if l.length < div_len:
                floor_mids.append(l.mid)
                continue
            divs = l.divideByLength(div_len)
            floor_mids.extend([s.mid for s in divs])
        self.ext_slots = floor_mids

    def extCoverChk(self, exts):
        """
        PASS 1: Check coverage
        """
        pc = pyclipper.Pyclipper()
        ext_circs = []
        for e in exts:
            ext_circs.append(circle2D(15000, 64, e))
        pc.AddPaths(ext_circs, pyclipper.PT_CLIP, True)
        pc.AddPaths([self.vertices], pyclipper.PT_SUBJECT, True)
        sln = pc.Execute(pyclipper.CT_DIFFERENCE, pyclipper.PFT_POSITIVE, pyclipper.PFT_POSITIVE)
        comply = False
        if len(sln) == 0:
            comply = True
        else:
            comply = False
        return {"result": comply, "coverage": ext_circs ,"diff": sln}

    def extTravelChk(self):
        """
        PASS 2: Check travel distance
        !!TODO!!
        """
        pass
    
    pass
