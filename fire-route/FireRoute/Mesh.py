"""
Mesh.py

"""

__author__ = "Bob YX Lee"

import numpy as np

__author__ = "Bob Lee"
def nakedEdges(mesh = {"faces": [], "vertices":[]}):
    """
    Return naked edges of a mesh defined by a face-list of vertex indices
    and a list of vertices containing coordinates.

    """
    vertices = mesh["vertices"]
    faces = mesh["faces"]
    edge_counts = {}
    for f in faces:
        v1, v2, v3 = f
        edges = [(v1, v2), (v2, v3), (v3, v1)]
        for edge in edges:
            sorted_edge = tuple(sorted(edge))
            if sorted_edge in edge_counts:
                edge_counts[sorted_edge] += 1
            else:
                edge_counts[sorted_edge] = 1
    naked_edges = [edge for edge, count in edge_counts.items() if count == 1]
    return naked_edges

def getEdges(mesh):
    """
    Return all edges of a mesh

    """
    es = []
    for f in mesh["faces"]:
        v1, v2,  v3 = f
        edges = [(v1, v2), (v2, v3), (v3, v1)]
        for edge in edges:
            sorted_edge = tuple(sorted(edge))
            if sorted_edge in es: continue
            es.append(sorted_edge)
        pass
    return es

def getTriangles(mesh):
    """
    Get triangles defined as a list of vertex coordincates from a given mesh.
    
    :return: List of triangles.
    :rtype: list[list[float]]

    """
    triangles = []
    verts = mesh["vertices"]
    for f in mesh["faces"]:
        triangles.append([verts[i] for i in f])
    return triangles

def triArea(t = [[0,0], [0,1], [1,1]]):
    """
    Returns triangular area given a triangle
    defined by a list of coordinates.
    
    :return: Area of a triangle
    :rtype: float

    """
    area = abs(
    (t[0][0] * (t[1][1] - t[2][1])
    + t[1][0] * (t[2][1] - t[0][1])
    + t[2][0] * (t[0][1] - t[1][1]))
    /2.0
    )

    return area

def closestPoint(points, target):
    """
    Returns closest point index in a list of points
    given a target point.

    :returns: Point index
    :rtype: int

    """
    pts = np.array(points)
    target_pt = np.array(target)
    distances = np.linalg.norm(pts - target_pt, axis = 1)
    cid = np.argmin(distances)
    return cid

def closestVertex(mesh, target):
    """
    Returns the closest vertex in a mesh given a target point

    :return: Vertex index
    :rtype: int 

    """
    vertices = mesh["vertices"]
    return closestPoint(vertices, target)

def ptInsideTriangle(pt, t = [], tolerance = 5):
    """
    Determines if a given point is inside a triangle for a
    given tolerance.

    :returns: True if inside triangle, False otherwise.

    """
    area = triArea(t)
    area_p12 =triArea([pt, t[1], t[2]])
    area_p02 = triArea([pt, t[0], t[2]])
    area_p01 = triArea([pt, t[0], t[1]])

    return (abs(area - (area_p12 + area_p02 + area_p01)) < tolerance)
