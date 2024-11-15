# fire-rvt-ui

UI for web application lauched from created Revit plugin. 

## TODO
- [x] Update viewer when a new room is chosen.
- [x] Implement zoom.
- [x] Allow entire floor rooms to be visualized when floor is chosen.
- [x] Fix polygon preview by changing to SVG path.
- [x] Reflect result properly in result panel.
- [x] Render extinguisher placements
- [x] Send a payload to server.
- [ ] Fix payload. For some reason doesn't work.
- [ ] Render failure explanation (coverage diff) from server.
- [ ] Render travel paths from server.

## Installation

In the project directory, run the following scripts:

### `npm i`

Once you have forked the repo, run "npm i" in the terminal to download all the relevant dependencies.

## Starting the application 

In the project directory, run the following scripts:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000/index.html](http://localhost:3000/index.html) to view it in the browser.

The app has to be mounted on index.html route in order to work with Revit WebView2.

## Deployment
1. Build using `docker compose build`, modifying env variables as needed.
2. To host on a path e.g., `/fire`, a reverse proxy is required. For NGINX, it can be something like:
```
location /fire  {
    proxy_set_header X-Real-IP  $remote_addr;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header Host $host;
    proxy_redirect     off;
    proxy_set_header   Host $host;
    rewrite /app/(.*) /$1 break;
    proxy_pass http://127.0.0.1:41984/fire;
}
```
3. Then run using `docker compose up -d`

## Contributors
- Yuji Fujinami: UI / UX implementation
- Bob YX Lee: Integration with Revit & API
