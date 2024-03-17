"""
Compute.py

Computation logic for tasks.

"""
from .Mesh import nakedEdges

__author__ = "Bob Lee"

def routeFromNavmesh(mesh = {"faces": [[0,1,2]], "vertices": [[0,0], [1,1], [2,0]]}, 
                     start = [0, 1], 
                     end = [1,0]):
    """
    Generate shortest path given a navmesh
    and start and end points

    """
    
    nedges = nakedEdges(mesh)
    result = nedges
    return result
