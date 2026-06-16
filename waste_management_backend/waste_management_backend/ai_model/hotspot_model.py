import pandas as pd
from sklearn.cluster import KMeans
import joblib

# Example dataset
data = {
    "area": ["Area25","Area18","Area49","Area30","Area3","Area24","Area9","Area12"],
    "complaints": [15,10,5,7,3,12,9,6],
    "population_density": [900,800,400,500,300,850,600,450]
}

df = pd.DataFrame(data)

X = df[["complaints","population_density"]]

# Train clustering model
model = KMeans(n_clusters=3)

df["cluster"] = model.fit_predict(X)

# Save model
joblib.dump(model,"ai_model/hotspot_model.pkl")

print("Hotspot AI model trained successfully")