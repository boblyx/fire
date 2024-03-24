"""
Math2D.py
Convenience functions for basic math.
"""
import numpy as np
import drawsvg as dw


def furthest(point, others):
    others = np.array(others)
    distances = np.linalg.norm(point - points, axis = 1)
    furthest_idx = np.argmax(distances)
    return points[furthest_idx]

def most_remote(points = [], bounding = []):
    if len(points) == 1: return furthest(points[0], bounding);
    else: return np.mean(points, axis = 0)
