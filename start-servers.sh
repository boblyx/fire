#!/bin/bash
RDIR=$PWD
cd $RDIR/fire-opt && pm2 start api.py --interpreter ../venv/bin/python --name fire-opt
cd $RDIR//fire-route && pm2 start api.py --interpreter ../venv/bin/python --name fire-route
