import json
import requests

with open("./assets/example_mesh.json", "r") as f:
    mesh = json.loads(f.read())

start = [-2625.874756, -22096.14453] 
end = [10258.994267, 4673.240059]
payload = {"start": start, "end": end, "mesh": mesh}
url = "http://127.0.0.1:41982/travel"
#print(payload)
result = requests.post(url, json=payload)
print(result.json())
