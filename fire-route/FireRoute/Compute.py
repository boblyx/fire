"""
Compute.py

Computation logic for tasks.

"""
from .Mesh import nakedEdges, getEdges, closestPoint
from .Graph import getNeighbors, getTowardsTarget, getGraphPath, reSimplifyPath

__author__ = "Bob Lee"

def routeFromNavmesh(mesh = {"faces": [[0,1,2]], "vertices": [[0,0], [1,1], [2,0]]}, 
                     start = [-2625.874756, -22096.14453], 
                     end = [10258.994267, 4673.240059]):
    """
    Generate shortest path given a navmesh
    and start and end points

    """
    
    nedges = nakedEdges(mesh)
    edges = getEdges(mesh)
    result = len(edges)
    
    nodes = mesh["vertices"]

    xnodes = list(range(0,len(mesh["vertices"])))

    xedges = []

    for l in edges:
        source = l[0]
        target = l[1]
        xedges.append({"source": source, "target": target})

    path = getGraphPath(start, end, xedges, nodes)
    shortcut = reSimplifyPath(path, start, end, nodes, nedges, mesh)
    polyline = [nodes[i] for i in shortcut]
    return polyline
