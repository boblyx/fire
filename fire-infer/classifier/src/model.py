import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split
import xgboost as xgb
from sklearn.preprocessing import StandardScaler
from functions import calculate_area, calculate_distances_to_center, calculate_perimeter, calculate_std_dev_distances_to_center, vertex_to_extinguisher_distances
import joblib

# Load synthetic dataset 

file_path = '../data/dataset.json'
df = pd.read_json(file_path)

# Deconstruct data column into separate dataframe 

df = pd.json_normalize(df['data'])

# New features 

new_features = df.apply(lambda row: pd.Series({
    'room_area': calculate_area(np.array(row['room'])),
    'ext_count': len(row['extinguishers']),
    'min_dist_to_center': calculate_distances_to_center(np.array(row['room']), np.array(row['extinguishers']))[0],
    'max_dist_to_center': calculate_distances_to_center(np.array(row['room']), np.array(row['extinguishers']))[1],
    'avg_dist_to_center': calculate_distances_to_center(np.array(row['room']), np.array(row['extinguishers']))[2],
    'room_perimeter': calculate_perimeter(np.array(row['room'])),
    'std_dev_dist_to_center': calculate_std_dev_distances_to_center(np.array(row['room']), np.array(row['extinguishers'])),
    # Additional new features 
    'vertex_min_dist_to_ext': vertex_to_extinguisher_distances(np.array(row['room']), np.array(row['extinguishers']))[0],
    'vertex_max_dist_to_ext': vertex_to_extinguisher_distances(np.array(row['room']), np.array(row['extinguishers']))[1],
    'vertex_avg_dist_to_ext': vertex_to_extinguisher_distances(np.array(row['room']), np.array(row['extinguishers']))[2],
}), axis=1)

df = pd.concat([df, new_features], axis=1)

# Drop unnecessary features

df.drop(['id','room','extinguishers'], axis=1, inplace=True)

# Split data into train and test sets 
y = df['comply']
X = df.drop(columns=['comply'])
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standard scaling 
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Create DMatrix for XGBoost
dtrain = xgb.DMatrix(X_train_scaled, label=y_train)

# Hyperparameters based on evaluation of model and comparison with other models 
params = {'max_depth': 3, 'eta': 0.2, 'objective': 'binary:logistic'}

# Number of boosting rounds 
num_rounds = 100 

# Train model 
model = xgb.train(params, dtrain, num_rounds)

# For testing purposes
# dtest = xgb.DMatrix(X_test_scaled) 

# y_pred_prob = model.predict(dtest)

# y_pred = (y_pred_prob >= 0.5).astype(int)

# print(accuracy_score(y_test, y_pred))
# print(f1_score(y_test, y_pred))

# Export model
model.save_model('xgb_model.model')

# Save scaler for use in app 
joblib.dump(scaler, 'scaler.pkl')