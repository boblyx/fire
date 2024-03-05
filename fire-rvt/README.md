# fire-rvt
Revit Plugin for interfacing with Fire services.

## Suggested Tech
- WebView2 for opening up a web dialog in Revit
- Web interface will use SolidJS for quick prototyping and send API calls to relevant `fire-opt` endpoints.

## Procedure
1. Start plugin from Revit ribbon
1. Plugin runs a command which opens a Webview2 window.
1. Webview2 window connects to a webpage containing a Javascript app
1. App allows user to search for a particular floor / level to conduct studies with.
1. App has 2 tabs which allow choice between `Hosereel` and `Extinguisher` pages.

### Extinguisher Page
1. User selects a room in the level.
1. Revit plugin sends over room's finish boundary as a JSON payload
1. Web app calls fire-svg API to convert it into SVG
1. Webview2 renders SVG and shows button for user to press to begin inference / solve using rules based method
1. When button is pressed, request is sent to server to infer based on given info.

### Hosereel Page
1. User selects a level. Get 1x contiguous collection of rooms connected to each other.
1. Revit sends collection of rooms' finish boundary, door positions and hosereel positions as JSON payload
1. Web app calls fire-svg API to convert it into SVG
1. WebView2 renders SVG and shows button for user to press to begin inference / solve using rules based method
1. When button is pressed, request is sent to the server to infer based on given info.








