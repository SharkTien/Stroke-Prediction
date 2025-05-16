from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import dill
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from models.LogisticRegression import LogisticRegressionCustom
import os
from sklearn.preprocessing import StandardScaler
import numpy as np

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'checkpoints', 'logisticregression_model.pkl')

# Load the model and scaler
try:
    with open(model_path, 'rb') as f:
        model_data = dill.load(f)
        if isinstance(model_data, dict):
            model = model_data['model']
            scaler = model_data.get('scaler')
        else:
            model = model_data
            scaler = None
    print(f"Model loaded successfully from {model_path}")
except Exception as e:
    print(f"Error loading model from {model_path}: {str(e)}")
    model = None
    scaler = None

class StrokeData(BaseModel):
    age: float
    gender: int
    chest_pain: int
    high_blood: int
    irregular_h: int
    shortness_of: int
    fatigue_we: int
    dizziness: int
    swelling_e: int
    neck_jaw_r: int
    excessive_: int
    persistent: int
    nausea_vo: int
    chest_disc: int
    cold_hands: int
    snoring_sl: int
    anxiety_do: int

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy", 
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None
    }

@app.post("/api/predict")
async def predict(data: StrokeData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded properly")
        
    try:
        # Convert input data to DataFrame
        input_data = pd.DataFrame([{
            'age': data.age,
            'gender': data.gender,
            'chest_pain': data.chest_pain,
            'high_blood': data.high_blood,
            'irregular_h': data.irregular_h,
            'shortness_of': data.shortness_of,
            'fatigue_we': data.fatigue_we,
            'dizziness': data.dizziness,
            'swelling_e': data.swelling_e,
            'neck_jaw_r': data.neck_jaw_r,
            'excessive_': data.excessive_,
            'persistent': data.persistent,
            'nausea_vo': data.nausea_vo,
            'chest_disc': data.chest_disc,
            'cold_hands': data.cold_hands,
            'snoring_sl': data.snoring_sl,
            'anxiety_do': data.anxiety_do
        }])

        # Check if model is a pipeline
        if hasattr(model, 'steps'):
            # For pipeline models (RandomForest, KNN)
            prediction = model.predict(input_data)
            probability = model.predict_proba(input_data)[0][1] if hasattr(model, 'predict_proba') else None
        else:
            # For non-pipeline models
            # Scale the input data if scaler is available
            if scaler is not None:
                # Convert to numpy array without feature names
                input_array = input_data.values
                input_data_scaled = scaler.transform(input_array)
                print("Data scaled before prediction")
            else:
                input_data_scaled = input_data.values
                print("Warning: No scaler found, using raw data for prediction")

            # Make prediction
            prediction = model.predict(input_data_scaled)
            
            # Get prediction probability if available
            probability = None
            if hasattr(model, 'predict_proba'):
                probas = model.predict_proba(input_data_scaled)
                probability = float(probas[0]) if probas.ndim == 1 else float(probas[0][1])
        
        # Since we're only predicting for one sample, we can safely take the first element
        prediction = int(prediction[0]) if isinstance(prediction, (np.ndarray, list)) else int(prediction)
        
        return {
            "prediction": prediction,
            "probability": probability
        }
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def start():
    """Launched with `poetry run start` at root level"""
    uvicorn.run("predict:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    uvicorn.run("predict:app", host="0.0.0.0", port=8000, reload=True, reload_includes=["*.py"]) 