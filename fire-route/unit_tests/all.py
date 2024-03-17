import sys
sys.path.append("../")
from FireRoute.Compute import routeFromNavmesh

result = routeFromNavmesh()
print(result)
