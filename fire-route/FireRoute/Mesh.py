"""
Mesh.py

"""

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

def triArea(t = [[0,0], [0,1], [1,1]]):
    """
    Returns triangular area given a triangle
    defined by a list of coordinates.

    """
    area = abs(
    (t[0][0] * (t[1][1] - t[2][1])
    + t[1][0] * (t[2][1] - t[0][1])
    + t[2][0] * (t[0][1] - t[1][1]))
    /2.0
    )

    return area

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
    #print(abs(area - (area_p12 + area_p02 + area_p01)))
    return (abs(area - (area_p12 + area_p02 + area_p01)) < tolerance)
