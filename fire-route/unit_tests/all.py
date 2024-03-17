import sys
import json
sys.path.append("../")

from FireRoute.Compute import routeFromNavmesh
with open("./assets/example_mesh.json", "r") as f:
    mesh = json.loads(f.read())
result = routeFromNavmesh(mesh)
print(result)
