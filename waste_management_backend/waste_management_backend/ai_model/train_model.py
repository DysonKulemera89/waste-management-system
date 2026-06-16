import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor

# Training dataset
data = {
    "complaints": [2,5,10,7,3,12,8,4],
    "days_since_collection": [1,3,5,4,2,6,4,2],
    "population_density": [200,500,900,700,300,1000,800,400],
    "waste_level": [1,2,5,4,2,6,5,3]
}

df = pd.DataFrame(data)

# Features
X = df[["complaints","days_since_collection","population_density"]]

# Target
y = df["waste_level"]

# Train model
model = RandomForestRegressor(n_estimators=100)

model.fit(X, y)

# Save model correctly
joblib.dump(model, "ai_model/waste_model.pkl")

print("Model trained and saved successfully!")