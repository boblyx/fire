"""
Graph.py

Graph functions for checking node-link networks.

"""

__author__ = "Bob Lee"

def getOther(node = 0, edge = {"source":0, "target": 1}):
    """
    Get other side of the edge.
    """
    if node == edge["source"]:
        return edge["target"]
    return edge["source"]

def getNeighbors(id = 0, xedges = [[0,1], [1,2], [2,0]]):
    """
    Get neighbors of the node given its id and
    edge list.

    """
    neighbors = []
    for e in xedges:
        v = e.values()
        if not id in v: continue
        neighbors.append(getOther(id, e))
    return neighbors

def getEdges(id, xedges):
    """
    Get edges connected to a given node id.

    """
    edges = []
    for e in xedges:
        v = e.values()
        if not id in v: continue
        edges.append(e)
    return edges

def getNodes(edge, nodes):
    """
    Get nodes given an edge and a list of nodes in the graph

    """
    return [nodes[edge["source"]], nodes[edge["target"]]]
    pass

def getTowardsTarget(node_ids, target, nodes):
    """
    Get the node id of given a list of candidate node ids
    and the target point defined by its coordinates.

    """
    fnodes = [nodes[i] for i in node_ids]
    pc = PointCloud(fnodes)
    next_pt = fnodes[pc.ClosestPoint(target)]
    next_id = nodes.index(next_pt)
    return next_id

def simplifyPath(path, target = [0,1], nodes = [], nedges = []):
    """
    :param nedges: naked edges in the navmesh.
    :return: Path defined by list of node indices.
    """
    pass
