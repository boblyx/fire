# fire-opt
- Optimisation API server.

## Suggested Tech
- [x] `pyclipper` library for obtaining boolean difference 
- [x] When required, call `fire-route` API to get travel paths.
- [ ] Compile algorithms into binaries that operate on JSON manifest linking to JSON definition of various shapes. Alternatively, may keep the shape definition in the same JSON file.
- [ ] Create a FastAPI server to execute the relevant binary with path of JSON manifest as subprocess when API is called.

# Workloads
## Extinguisher Placement
### Individual Generation
- [x] Given polylines representing a room's boundaries and columns / obstacles partitioned in separate lists:
1. Divide each of the polylines' segments into 5m
1. Get midpoints of each segment and put into a list
1. Generate a combination of N midpoints of the above segments.

### Evaluation
#### First Pass
- [x] For a given combination of N points, draw a 15m radius circle using it as a center
- [x] Calculate the area of the boolean difference of the room and the union of all circles.
- [ ] Rank is higher if:
	- [x] Area of boolean difference is = 0. (If this condition fails, the layout is not acceptable)
	- [ ] Extinguishers are close to a door.
	- [ ] N is closer to 1.

#### Second Pass
- For each N points and their 15m radius circle, get the points on the circle which may be close to a wall / obstacle.
- [x] Call fire-route API to get the travel path network
- [x] From the point on the circle close to an obstacle, travel along the shortest route from path network to the extinguisher point.
- [x] Measure distance of travel
- [x] If distance > 15m, layout is not acceptable
- [ ] Otherwise rank higher if:
	- [ ] Point is close to a door (accessible)
	- [ ] Distance is close to 15m (efficient)

## Hosereel Placement
### Individual Generation
- [x] Given polylines representing all rooms in a single contiguous floor:
1. For rooms that are escape stair stacks, place a hosereel near the door
1. Find the wall segments that comprise any common corridors and split them into 5m segments
1. Get midpoints of each segment and put it in a list alongside the point where stair hosereels are.
1. Generate a combination of N midpoints.

### Evaluation
- [x] Call API to get the travel path network (already accounts for obstacles such as columns and voids)
- [ ] From hosereel point to a door to a room, get the travel distance along the path network
- [ ] Find the most remote point from entrance of the room.
- [ ] Continue travel to the remote point of the room.
- [ ] Measure distance of travel
- [ ] If distance > 36m, layout is not acceptable








