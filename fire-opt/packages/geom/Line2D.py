"""
Line2D.py
Class representation of a 2D line.
"""
__author__ = "Bob YX Lee"

import numpy as np
import drawsvg as dw
from rhino3dm import Polyline, Point3d

def drawPt(drawing, pt, SCALE = 100):
    drawing.append(dw.Circle(pt[0]/SCALE, -pt[1]/SCALE, 5, fill='blue'))

def distance2D(p1, p2):
    """
    Measures distance between two points in 2D
    """
    p1 = np.array([p1[0], p1[1]])
    p2 = np.array([p2[0], p2[1]])
    
    return np.linalg.norm(p2 - p1)

def closestOnLine(line, pt):
    """
    Computes point on line closest to a test point.
    """
    pl = Polyline(2)
    pl.Add(line[0][0], line[0][1], 0)
    pl.Add(line[1][0], line[1][1], 0)
    # Note that rhino3dm typo here is the actual function name
    # from the rhino3dm pypi package.
    # In future, may need to edit this fn name.
    cp = pl.ClosesPoint(Point3d(pt[0], pt[1], 0))
    return [cp.X, cp.Y]

def slotsFromLines(lines, div_len=1000):
    slots = []
    for l in lines:
        if l.length < div_len:
            slots.append(l.mid)
            continue
        divs = l.divideByLength(div_len)
        slots.extend([s.mid for s in divs])
    return slots

class Line2D:
    
    def __init__(self, p1 = [0,0], p2 = [1,1]):
        """
        Initialises a 2D line storing 2 points as np.array objects.
        """
        self.p1 = np.array([p1[0], p1[1]])
        self.p2 = np.array([p2[0], p2[1]])
        pass
    
    @property
    def length(self):
        """
        :returns: the line's length;
        """
        return np.linalg.norm(self.p1 - self.p2)

    @property
    def mid(self):
        """
        :return: the line's midpoint
        """
        direction = self.p2 - self.p1
        scaled = direction * 0.5
        return self.p1 + scaled
    
    def divideByLength(self, div_len):
        """
        Divides a line by the specified distance

        :param div_len: Length with which to divide the line.
        """
        nseg = int(self.length / div_len)
        segs = []
        previous = self.p1
        for l in range( 1, nseg + 1 ):
            t = l/nseg
            direction = self.p2 - self.p1
            scaled = direction * t
            p_t = self.p1 + scaled
            segs.append(Line2D(previous, p_t))
            previous = p_t
        return segs
    
    def to_np(self):
        return np.array([self.p1, self.p2])

    def __str__(self):
        return "<Line: %s to %s>" % (str(self.p1), str(self.p2))

    pass

if __name__ == "__main__":
    line = Line([0,0], [10000, 0])
    lines = line.divideByLength(5000)
    
    for l in lines: print(l.mid)
    pass
