"""
Room.py

functions for generating and checking rooms

TODO:
- [ ] Add random obstacles for synth
"""
__author__ = "Bob YX Lee"

from .Poly2D import rect2D, circle2D, getLines
from .Bool2D import union

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
        """
        lines = getLines(self.vertices, True)
        floor_mids = []
        for l in lines:
            if l.length < div_len:
                floor_mids.append(l.mid.tolist())
                continue
            divs = l.divideByLength(div_len)
            floor_mids.extend([s.mid.tolist() for s in divs])
        self.ext_slots = floor_mids

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
        else:
            comply = False
        return {"result": comply, "coverage": ext_circs ,"diff": sln}

    def closestPt(point, others):
        """
        Computes the point from a point cloud closest to
        a test point.
        """
        others = np.array(others)
        distances = np.linalg.norm(others - point, axis = 1)
        c_idx = np.argmin(distances)
        return others[c_idx]

    def furthestPt(point, others):
        """
        Computes the point from a point cloud furthest from
        a test point.
        """
        others = np.array(others)
        distances = np.linalg.norm(others - point, axis = 1)
        furthest_idx = np.argmax(distances)
        return others[furthest_idx]

    def closestOnLine(line, pt):
        """
        Computes point on line closest to a test point.
        """
        pl = Polyline(2)
        pl.Add(line[0][0], line[0][1], 0)
        pl.Add(line[1][0], line[1][1], 0)
        #print(dir(pl))
        cp = pl.ClosesPoint(Point3d(pt[0], pt[1], 0))
        return [cp.X, cp.Y]
    
    def most_remote(points = [], bounding = []):
        """
        TODO: Check if inside obstacle
        Check if the point is inside any obstacles
        If inside, find the point on the obstacle edges closest to the
        current point
        Then loop through all lines and get closest point on the line 
        """
        if len(points) == 1: 
            return furthestPt(points[0], bounding);
        else:
            fp = np.mean(points, axis = 0)
            candidates = []
            blines = getLines(bounding)
            for l in blines:
                candidates.append(closestOnLine(l.to_np(), fp))
            return furthestPt(fp, candidates)

    def pathLength(path):
        """
        Measures travel path length
        """
        dist = 0
        for i, l, in enumerate(path):
            if i == len(path) - 1: continue
            dist += distance2D(l, path[i+1])
            pass
        return dist

    def getTravelPath2D(navmesh, start, end):
        """
        Get the travel path given a navmesh, start and end point
        """
        start = list(start[0:2]) # In case start & end are 3 dimensional
        end = list(end[0:2])
        payload = {"mesh": mesh, "start": start, "end": end}
        res = requests.post(FIRE_ROUTE, json = payload);
        travel = res.json()["result"]
        distance = pathLength(travel);
        return{"path": travel, "distance": distance };

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
