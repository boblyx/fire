"""
coverage.py

Synthetic dataset generator for coverage checks

"""
__author__ = "Bob YX Lee"

import sys
import os
import random
import pprint
from copy import deepcopy
from uuid import uuid4
import json
from datetime import date
from time import time

sys.path.append("../fire-opt/packages")
from geom.Room import Room

import numpy as np
import pyclipper

out_dict = {"date_generated": str(date.today()) ,"data":[]}

def gData():
    room = Room.random(2)
    room.gExtSlots(1000)
    pick_num = random.randint(1,3)
    exts = random.sample(room.ext_slots, pick_num)
    exts_clean = []
    for e in exts:
        exts_clean.append(e.tolist())
    chk = room.extCoverChk(exts)
    data = {"id": str(uuid4()), "room": room.vertices, 
            "extinguishers": exts_clean, "comply": int(chk["result"])}
    return data

if __name__ == "__main__":
    for i in range(0,10000):
        out_dict["data"].append(gData())
        print("Data point %d created." % i)
        pass
    out_dir = os.path.join(os.getcwd(), "dataset")
    os.makedirs(out_dir, exist_ok = True)
    filename = "%s_%s.json" % (str(int(time())), str(uuid4()))
    filepath =os.path.join(out_dir, filename)
    print("Writing dataset to %s..." % filepath)
    with open(filepath, 'w') as f:
        f.write(json.dumps(out_dict))
    print("Dataset Generation completed.")
