"""
run.py

Starts Flask API server for inference checking
"""
from flask import Flask, request, jsonify
import numpy as np
import xgboost as xgb
from flask_cors import CORS
import joblib
from time import time
from functions import calculate_area, calculate_distances_to_center, calculate_perimeter, calculate_std_dev_distances_to_center, vertex_to_extinguisher_distances

__author__= "Yuji Fujinami"

app = Flask(__name__)
CORS(app)

# Load trained XGBoost model 
model = xgb.Booster()
model.load_model('xgb_model.model')

# Load standard scaler 
scaler = joblib.load('scaler.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    print("POST Request received on /predict!")
    start_time = time()
    try:
        # Extract data from the received JSON
        data = request.get_json(force=True)

        # Sample data for testing 
        # data = {"id": "78a81cb9-e87e-4799-90fb-ef7d2a92be8f", "room": [[0, 0], [9357, 0], [9357, 6552], [6738, 6552], [6738, 6892], [11655, 6892], [11655, 12592], [3369, 12592], [3369, 6892], [0, 6892]], "extinguishers": [[8702.25, 6552.0]]}
        
        # Extract 'room' and 'extinguishers' features from the JSON, and create new features
        features = {
        'room_area': calculate_area(np.array(data['room'])),
        'ext_count': len(data['extinguishers']),
        'min_dist_to_center': calculate_distances_to_center(np.array(data['room']), np.array(data['extinguishers']))[0],
        'max_dist_to_center': calculate_distances_to_center(np.array(data['room']), np.array(data['extinguishers']))[1],
        'avg_dist_to_center': calculate_distances_to_center(np.array(data['room']), np.array(data['extinguishers']))[2],
        'room_perimeter': calculate_perimeter(np.array(data['room'])),
        'std_dev_dist_to_center': calculate_std_dev_distances_to_center(np.array(data['room']), np.array(data['extinguishers'])),
        'vertex_min_dist_to_ext': vertex_to_extinguisher_distances(np.array(data['room']), np.array(data['extinguishers']))[0],
        'vertex_max_dist_to_ext': vertex_to_extinguisher_distances(np.array(data['room']), np.array(data['extinguishers']))[1],
        'vertex_avg_dist_to_ext': vertex_to_extinguisher_distances(np.array(data['room']), np.array(data['extinguishers']))[2],
        }
        
        # Conversion of features into a scaled numpy array 
        features_list = [features[key] for key in features]
        features_array = np.array([features_list])
        scaled_features_array = scaler.transform(features_array)

        # Convert to DMatrix
        data_matrix = xgb.DMatrix(scaled_features_array)
        
        # Make prediction
        pred_prob = model.predict(data_matrix)
        pred = (pred_prob >= 0.5).astype(int)
        end_time = time()
        runtime = (end_time - start_time) * 1000;
        print("Compliance classification completed in %1.2fms" % runtime)
        return jsonify({'prediction': pred.tolist()})
    except Exception as e:
        print(e);
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
