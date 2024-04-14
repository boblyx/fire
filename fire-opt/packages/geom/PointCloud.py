"""
PointCloud.py

For operations regarding multiple points
"""
__author__ = "Bob YX Lee"

import numpy as np

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
