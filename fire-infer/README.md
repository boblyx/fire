# fire-infer
This part of the repo contains 2 parts:
- API server for processing inference requests.
- Code for training base model.

## Suggested Tech
- `FastAPI` as API framework
- `pytorch` as neural network tooling

# Model 1: Extinguisher Placement Evaluation
## Layer 1.a: First pass - Coverage Inference
- Purpose:
	- For many obstacles, boolean difference might be expensive.
	- Otherwise, for convenience, this layer may use `fire-opt` API
	
- Inputs:
	- JSON representation of: 
		- Room boundaries' vertices
		- Extinguisher placement points
	
- Outputs:
	- JSON representation of:
		- 15m circles around each extinguisher points
		- Percentage of area covered

## Layer 1.b.: Second pass - Travel Inference
- Purpose:
	- Path generation algorthm is O(n^2) in worst case, and O(nlog(n)) in best case.
	- May be more computationally efficient to infer travel path.

- Inputs:
	- JSON representation of: 
		- Room boundaries' vertices
		- Extinguisher placement points

- Outputs:
	- JSON representation of:
		- Travel Path to extinguisher from most remote point.

## Layer 1.c: Suggestion
- Purpose:
	- Given a failed scenario, suggest a layout that may work
	- KIV as potentially very complicated.

# Model 2: Hosereel Placement Evaluation
## Layer 2.a.: Travel inference
- Similar to Layer 1.b, but with additional output.

- Inputs:
	- JSON representation of: 
		- Room boundaries' vertices
		- Hosereel placement points
		- Door center points

- Outputs:
	- JSON representation of:
		- Travel Path from hosereel to each room's most remote point.
		- Radial curve from last 6m.

## Layer 2.b: Suggestion
- Purpose:
	- Given a failed scenario / empty scenario, suggest a layout that may work
	- KIV

# Dataset
- May generate synthetic dataset from random floor plans to offer ground truth outputs

# Technical Notes
## Neural Vectorisation of Vector Shapes
- Due to the need to vectorise data, we may only be able to take a limited no. polyline shape vertices. 
- For hackathon and purposes of economics, let's limit to 32 vertices.

### Polygon Shapes
- 2D polyline vertices could then be vectorized as a 3 x 32 matrix. For example, a 7 by 7 square could be:
```bash
(id) |	0 1 2 3 4 5 ... 31
--------------------------
a 	 |	1 1 1 1 0 0 ... 0
x 	 |	0 0 7 7 0 0 ... 0
y 	 |	0 7 7 0 0 0 ... 0
```
- `a` refers to whether the vertex is active, if it's 0, the model should ignore everything else in the following indices.

### Points
- Similarly, point vertices will have 0 for all indices after 0:
```bash
(id) |	0 1 ... 31
--------------------------
a 	 |	1 0 ... 0
x 	 |	5 0 ... 0
y 	 |	5 0 ... 0
```

### Ellipses
- The first column represents the center of the ellipse
- The second represents the x dimension and the y dimension
- `a` of 2 is used to signify it is an ellipse.
- Alternatively, a low res polyline version of an ellipse may be used instead...
```bash
(id) |	0 1 ... 31
--------------------------
a 	 |	1 0 ... 0
x 	 |	5 0 ... 0
y 	 |	5 0 ... 0
```

### Training
- Model may have to infer possible boolean difference shapes

## Neural Vectorisation of Routes as Graphs
- May share polyline / point definition for each edge / node
- Instead of doing the whole route, the workload will be split into just finding the Graphified Scale Axis Transform given x numbers of shapes.
- After that, rule based method will be used to link each each rooms' entry doors with the nearest SAT, to obtain the travel route.
- Following principles from typical Graph Neural Networks (GNN) we vectorize the travel network using tensor = adjacency array, and list of nodes and edges with maximum limit of 32 edges, nodes and links.

### Nodes
```bash
[[0,0], [1,2], [4,5], ...]
```
Where each array is the coordinates of each node.

### Adjacency
```bash
[[0,1], [4,2] ..., [5,1]]
```
Where each number in each adjacency refers to each index

### Training
- GNN will have to predict additional nodes and edges based on a graph representation of 2D polylines, and only entrance nodes as initial graph.


 
