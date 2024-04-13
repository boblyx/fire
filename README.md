# Fire
A prototype AI service stack for the 2024 [YAL hackathon](aihackathon.pro).

The stack comprises 5 services, namely:

- `fire-route`: API server for generating Travel Routes in a room with obstacles.
- `fire-rvt`: Revit 2024 plugin for interfacing with Fire APIs
- `fire-opt`: Optimisation API server for generating extinguisher placements and evaluating whether a set of placements for a given room is acceptable or not.
- `fire-infer`: API server for inference requests, and code for training base AI model.
- `fire-synth`: Program for generating synthetic data for training AI model.

## Usage
The application is split into 2 main parts:
- Frontend: `fire-rvt` plugin for frontend interaction with BIM software
- Backend: `fire-opt` and `fire-route` services for doing heavy computation.

### Requirements
- To build the plugin, Windows 10 or above is required.
- To use this plugin, Autodesk Revit 2023 or later is required.
- To run backend services, Python 3.8 and above is required.
- The instructions below use `bash` commands, which may be harnessed through MinGW-w64 which is typically available on Windows by installing Git Bash.

### Frontend
#### Building the Plugin
1. Install the following development software:
    - Visual Studio 2017 Express or later
    - .NET Framework 4.8 SDK
    - NodeJS + pnpm (pnpm is recommended for faster package download)
2. Build the web app. Make sure to change any IP addresses in the source files (will be changed later to read from .env files)
```bash
cd fire-rvt/ui/web-ui
pnpm i .
pnpm build
```
3. Copy the web app over to the plugin's ui folder
```bash
rm -r ../../fire-rvt/ui
cp -r build/* ../../fire-rvt/ui
```
4. Open `fire-rvt/fire-rvt.sln`.
5. Run the Build command. This will build the binaries and automatically transfer them to your Revit 2023 plugin folder. Alternatively, built binaries may be found in `fire-rvt/fire-rvt/bin`

### Backend
#### Setting up the Server
1. Create a virtualenv, install Python dependencies, and activate it.
```bash
python -m venv venv
# on Linux:
source venv/bin/activate
# on Windows:
source venv/Scripts/activate
pip install -r requirements.txt
```
2. Install pm2 through npm
```
npm i -g pm2
```
3. Run `start-server.sh`
```
bash start-server.sh
```
4. You may see the server log using:
```
pm2 log all
```
5. You may also check the API docs at:
    - `fire-route`: http://localhost:41982/docs
    - `fire-opt`: http://localhost:41983/docs

## Contributors and Roles (Team 🔥)
- Atenn Neoh: Team Lead
- Yvonne Zhang: Fire Engineering Subject Matter Expert
- Bob YX Lee: Systems Integration, Full Stack Development
- Tang Minjing: BIM Specialist
- Evangelina Ong: BIM Specialist
- Yuji Fujinami: UI/UX, Frontend Development, Machine Learning Implementation
