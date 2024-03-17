# fire-route
- API Server for generating travel paths accounting for various obstacles in a given room.
- For visualising outputs, a client built with Solid + Bootstrap 

## Procedure
- [x] Implement Navmesh pathfinding
- [x] Allow algorithm to be called using FastAPI
- [ ] For hosereel: Given multiple navmeshes, connect them using inserted door nodes

## Development
1. Install all dependencies.
```bash
pip install -r requirements.txt
```
2. Start the API server.
```bash
python api.py
```
3. Run unit tests
```bash
cd unit_tests
python all.py
```


## Procedure (DEPRECATED)
- [x] Generate Scale Axis Transform (SAT) using MAT library (flo-mat by Floris Steenkamp)
- [x] Convert SAT curve to a network graph (simplifying curves as far as possible)
- [x] Return network graph as a JSON dictionary of nodes and edges (to be compatible with NetworkX)
- [ ] For hosereel: Using a python server, load all room SAT networks and connect the closest node to the closest doors
- [ ] Return network graph containing nodes possessing data of the room they're belonging to and whether they are a door or not.

## Development (DEPRECATED)
To visually test SAT algorithms follow the section named **Boilerplate for testing**.

To run the api server:

Install all dependencies.
```bash
pnpm i .
```

Run the server.
```bash 
pnpm api
```

## Boilerplate for testing (DEPRECATED)
### Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

### Available Scripts

In the project directory, you can run:

#### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

#### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)
