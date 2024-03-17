"""
Graph.py

Graph functions for checking node-link networks.

"""
from .Mesh import closestPoint, closestVertex, getTriangles, ptInsideTriangle
from rhino3dm import Line, Point3d, Intersection

__author__ = "Bob YX Lee"

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
    next_pt = fnodes[closestPoint(fnodes, target)]
    next_id = nodes.index(next_pt)
    return next_id

def getGraphPath(start, end, xedges, nodes):
    """
    Get path along a graph given an start and end point.

    :return: List of node indices
    :rtype: list[int]

    """

    cid = closestPoint(nodes, start)
    n1 = getNeighbors(cid, xedges)
    path = [cid]
    cnode = cid
    end_id = closestPoint(nodes, end)
    while(cnode != end_id):
        neigh = getNeighbors(cnode, xedges)
        next_id = getTowardsTarget(neigh, end, nodes)
        path.append(next_id)
        cnode = next_id
        pass
    return path
    pass

def simplifyPath(path, start , target, nodes, nedges, mesh):
    """
    Simplifies sets of 3 points into 2 points across a path of at least 3 points.

    :param path: list of node indices.
    :param start: coordinates of the start point.
    :param target: coordinates of the end point.
    :param nodes: coordinates of points.
    :param nedges: naked edges in the navmesh as list of indices.
    :param mesh: the navmesh.

    :return: Path defined by list of node indices.
    :rtype: list[int]

    """
    if(len(path) < 3): return path

    if not start in nodes:
        nodes.append(start)
        path[0] = len(nodes) - 1

    if not target in nodes: 
        nodes.append(target)
        path.append(len(nodes) - 1)
    
    vertices = mesh["vertices"]
    
    # Convert naked edges to rhino3dm so we can use 
    # their Line intersection function to save time.
    rnedges = []
    for n in nedges:
        p1 = vertices[n[0]]
        p2 = vertices[n[1]]
        p1r = Point3d(p1[0], p1[1], 0)
        p2r = Point3d(p2[0], p2[1], 0)
        l = Line(p1r, p2r)
        rnedges.append(l)
    #return None
    # Check if we can just go straight
    st = nodes[path[0]]
    fl = Line(Point3d(st[0], st[1], 0), Point3d(target[0], target[1], 0))
    fitx_count = 0
    for n in rnedges:
        itx = Intersection.LineLine(fl, n, tolerance = 1.0, finiteSegments=True)
        if itx[0] == False: continue
        if itx[1] == 0.0 or itx[1] == 1.0 : continue
        fitx_count += 1
    # Just return from start to end if there are no obstacles in the way.
    if(fitx_count == 0): return [path[0], path[len(path) -1]]
    
    triangles = getTriangles(mesh)
    # Compute shortcut
    shortcut = []
    skip_next = False
    for i, p in enumerate(path):
        # Skip if beyond last 3 points.
        if i > len(path) -3:
            if len(nodes) -1 in shortcut: continue
            shortcut.append(len(nodes) - 1)
            break
        # Skip the next point if a shortcut was drawn previously.
        if skip_next: 
            skip_next = False
            continue 
        
        #candidates = [path[i], path[i+1], path[i+2]]
        #print(candidates) # For DEBUG
        
        st = nodes[path[i]]
        en = nodes[path[i+2]]
        l = Line(Point3d(st[0], st[1], 0), Point3d(en[0], en[1], 0))

        # Need to check if this line is
        # part of a triangle or inside a triangle of the navmesh
        chkpt = l.PointAt(0.5)

        num_tri_inside = 0
        for t in triangles:
            if not (ptInsideTriangle([chkpt.X, chkpt.Y], t)): continue
            num_tri_inside += 1


        # Check if line to the point 2 indices away collides
        # with any obstacles (naked edges)
        itx_count = 0
        for n in rnedges:
            itx = Intersection.LineLine(l, n, tolerance = 1, finiteSegments=True)
            if itx[0] == False: continue
            if itx[1] == 0.0 or itx[1] == 1.0 : continue
            itx_count += 1
        
        # Add the first point if we're at the first point.
        if i == 0: shortcut.append(path[i])
        
        # If the midpoint of the path is not on any face of the navmesh,
        # Means it is inside the obstacle, and we continue onto the next.
        if num_tri_inside == 0: 
            skip_next = False
            shortcut.append(path[i+1])
            continue
        
        # If there are no intersections, means that there's no collision
        # with obstacles en route. So we add the point 2 indices away.
        if itx_count == 0:
            shortcut.append(path[i+2])
            skip_next = True
        # Otherwise, we continue onto the next.
        else:
            shortcut.append(path[i+1])
            skip_next = False
        pass

    return shortcut

def reSimplifyPath(path, start, end, nodes, nedges, mesh):
    """
    Repeatedly simplifies a path until there can be 
    no more improvements.

    """
    prev_count = None
    curr_count = len(path)
    shortcut = path
    loops = 0
    while(curr_count != prev_count):
        if loops > 100: break
        loops += 1
        print("Path Simplify Loop: %d" % loops)
        curr_count = len(shortcut)
        #FIXME: Find out why we need to do it twice...
        shortcut = simplifyPath(shortcut, start, end, nodes, nedges, mesh)
        shortcut = simplifyPath(shortcut, start, end, nodes, nedges, mesh)
        prev_count = len(shortcut)
    return shortcut
