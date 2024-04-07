"""
For adding extinguishers
for datasets without extinguishers
"""
__author__ = "Bob YX Lee"
import sys
import json
import os
from random import sample, randint
from uuid import uuid4
from time import time
from pprint import pprint

sys.path.append("../fire-opt/packages")

from geom.Room import Room

d = {}
divlen = 0.5
with open("./dataset/real.json", "r") as f:
    d = json.loads(f.read())

outpath = os.path.join("./dataset", "EX_%s.json" % uuid4())

for flr in d:
    for rm in flr["rooms"]:
        room = Room.fromLines(rm["vertices"])
        room.gExtSlots(divlen)
        exts = sample(room.ext_slots, randint(1,3))
        rm["exts"] = exts
    pass
pprint(d[0]["rooms"][0])

