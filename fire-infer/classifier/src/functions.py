import numpy as np
from shapely.geometry import Polygon
from sklearn.metrics.pairwise import euclidean_distances

# Calculate room area 
def calculate_area(coords):
    return Polygon(coords).area

# Calculate distances between extinguisher positions and room centroid 
def calculate_distances_to_center(room_coords, ext_coords):
    room_center = np.mean(room_coords, axis = 0)
    distances = euclidean_distances(ext_coords, [room_center]).flatten()
    return np.min(distances), np.max(distances), np.mean(distances)

# Calculate room perimeter
def calculate_perimeter(coords):
    return Polygon(coords).length

# Calculate variability of distances from all extinguishers to room centroid
def calculate_std_dev_distances_to_center(room_coords, ext_coords):
    distances = euclidean_distances(ext_coords, [np.mean(room_coords, axis=0)]).flatten()
    std_dev = np.std(distances)
    return std_dev

# Calculate distances between extinguisher positions and room vertices 
def vertex_to_extinguisher_distances(room_coords, ext_coords):
    distances = euclidean_distances(room_coords, ext_coords).flatten()
    return np.min(distances), np.max(distances), np.mean(distances)