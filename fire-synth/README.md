# fire-synth
Tools for creating datasets for `fire-infer`, and for creating test cases for `fire-opt` and `fire-route`

## navmesh.dyn
Dynamo script for Revit 2024 to create and export a Navmesh definition for use in `fire-route`. 
### Instructions
1. Create an enclosed room with walls.
1. Assign the room as a Revit Room.
1. Go to `Manage > Dynamo`
1. Open the Dynamo script.
1. Scroll to the far right and click True.
1. Open your file explorer and go to `C:/temp/fire-synth`
1. Your data should be exported as a JSON file.

Results are exported to `C:/temp/fire-synth`.

Requires the [Dynamo Mesh Toolkit](https://github.com/DynamoDS/Dynamo/wiki/Dynamo-Mesh-Toolkit) package.
