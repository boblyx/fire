"""
Bool2D.py
Boolean functions.
"""

__author__ = "Bob YX Lee"

import numpy as np
import pyclipper

def difference(sub_from = [], sub_with = []):
    """
    Executes boolean difference.
    :param sub_from: List of paths to subtract from
    :param sub_with: List of paths to subtract with
    :return: Series of paths indicating difference.
    :rtype: list[list[float]]
    """
    pc = pyclipper.Pyclipper()
    pc.AddPaths(sub_from, pyclipper.PT_SUBJECT, True)
    pc.AddPaths(sub_with, pyclipper.PT_CLIP, True)
    sln = pc.Execute(pyclipper.CT_DIFFERENCE, pyclipper.PFT_POSITIVE, pyclipper.PFT_POSITIVE)
    return sln

def union(sub_from = []):
    """
    Executes boolean union
    """
    pc = pyclipper.Pyclipper()
    pc.AddPaths(sub_from, pyclipper.PT_SUBJECT, True)
    sln = pc.Execute(pyclipper.CT_UNION, pyclipper.PFT_NONZERO)
    return sln

