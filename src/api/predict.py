from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import pandas as pd
import dill
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from models.LogisticRegression import LogisticRegressionCustom
import os
import subprocess
from sklearn.preprocessing import StandardScaler
import numpy as np
from collections import Counter
from fastapi.responses import JSONResponse
from typing import List, Dict, Any

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))
checkpoints_dir = os.path.join(current_dir, 'checkpoints')

# Ensure checkpoints directory exists
os.makedirs(checkpoints_dir, exist_ok=True)

# List of required models with their corresponding command line names
required_models = [
    ('svm_model.pkl', 'SVM'),
    ('logisticregression_model.pkl', 'LogisticRegression'),
    ('decisiontree_model.pkl', 'DecisionTree'),
    ('randomforest_model.pkl', 'RandomForest')
]

def check_and_train_models():
    missing_models = []
    for model_file, _ in required_models:
        model_path = os.path.join(checkpoints_dir, model_file)
        if not os.path.exists(model_path):
            missing_models.append((model_file, _))
    
    if missing_models:
        print("Some model files are missing. Training required models...")
        # Change to the api directory
        os.chdir(current_dir)
        
        # Train each missing model
        for model_file, model_name in missing_models:
            print(f"Training {model_name}...")
            try:
                subprocess.run(['python', 'train_model.py', f'--model={model_name}'], check=True)
                print(f"Successfully trained {model_name}")
            except subprocess.CalledProcessError as e:
                print(f"Error training {model_name}: {str(e)}")
                raise Exception(f"Failed to train {model_name} model")

# Check and train models at startup
check_and_train_models()

# Load all models at startup
models = {}
for model_file, model_name in required_models:
    model_path = os.path.join(checkpoints_dir, model_file)
    try:
        with open(model_path, 'rb') as f:
            model_data = dill.load(f)
            if isinstance(model_data, dict):
                models[model_name] = {
                    'model': model_data['model'],
                    'scaler': model_data.get('scaler')
                }
            else:
                models[model_name] = {
                    'model': model_data,
                    'scaler': None
                }
        print(f"Model {model_name} loaded successfully")
    except Exception as e:
        print(f"Error loading model {model_name}: {str(e)}")

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
        "models_loaded": {name: model['model'] is not None for name, model in models.items()}
    }

@app.post("/api/predict")
async def predict(data: StrokeData):
    if not models:
        raise HTTPException(status_code=500, detail="No models loaded")
        
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

        expert_predictions = []
        for model_name, model_data in models.items():
            model = model_data['model']
            scaler = model_data['scaler']
            
            try:
                # Check if model is a pipeline
                if hasattr(model, 'steps'):
                    prediction = model.predict(input_data)
                    probability = model.predict_proba(input_data)[0][1] if hasattr(model, 'predict_proba') else None
                else:
                    # For non-pipeline models
                    if scaler is not None:
                        input_array = input_data.values
                        input_data_scaled = scaler.transform(input_array)
                    else:
                        input_data_scaled = input_data.values

                    prediction = model.predict(input_data_scaled)
                    
                    probability = None
                    if hasattr(model, 'predict_proba'):
                        probas = model.predict_proba(input_data_scaled)
                        probability = float(probas[0]) if probas.ndim == 1 else float(probas[0][1])

                prediction = int(prediction[0]) if isinstance(prediction, (np.ndarray, list)) else int(prediction)
                
                expert_predictions.append({
                    'expert': f"Chuyên gia {len(expert_predictions) + 1}",
                    'model': model_name,
                    'prediction': prediction,
                    'probability': probability,
                    'result': "Có nguy cơ" if prediction == 1 else "Không có nguy cơ"
                })
            except Exception as e:
                print(f"Error with model {model_name}: {str(e)}")
                continue

        # Get final prediction based on majority vote
        predictions = [p['prediction'] for p in expert_predictions]
        final_prediction = Counter(predictions).most_common(1)[0][0]
        
        return {
            "expert_predictions": expert_predictions,
            "final_prediction": final_prediction,
            "final_result": "Có nguy cơ" if final_prediction == 1 else "Không có nguy cơ"
        }
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict/excel")
async def predict_excel(file: UploadFile = File(...)):
    if not (file.filename.endswith('.xlsx') or file.filename.endswith('.csv')):
        raise HTTPException(status_code=400, detail="File phải có định dạng .xlsx hoặc .csv")

    try:
        # Đọc file dựa vào định dạng
        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(file.file)
        else:
            df = pd.read_csv(file.file)
        # Kiểm tra các cột cần thiết
        required_columns = ['age', 'gender', 'chest_pain', 'high_blood_pressure', 'irregular_heartbeat', 'shortness_of_breath',
                          'fatigue_weakness', 'dizziness', 'swelling_edema', 'neck_jaw_pain', 'excessive_sweating', 'persistent_cough',
                          'nausea_vomiting', 'chest_discomfort', 'cold_hands_feet', 'snoring_sleep_apnea', 'anxiety_doom']
        
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400, 
                detail=f"Thiếu các cột: {', '.join(missing_columns)}"
            )

        # Chỉ giữ lại các cột cần thiết
        df = df[required_columns]


        # Tiền xử lý dữ liệu
        # Chuyển đổi gender: Male -> 1, Female -> 0
        df = df.dropna()
        df['gender'] = df['gender'].map({'Male': 1, 'Female': 0})

        # # Xóa các cột gốc đã được chuyển đổi
        # df = df.drop(['chest_pain', 'high_blood_pressure', 'irregular_heartbeat', 'shortness_of_breath',
        #               'fatigue_weakness', 'dizziness', 'swelling_edema', 'neck_jaw_pain', 'excessive_sweating', 'persistent_cough',
        #               'nausea_vomiting', 'chest_discomfort', 'cold_hands_feet', 'snoring_sleep_apnea', 'anxiety_doom'], axis=1)
        
        # Chuyển các đặc trưng nhị phân/thang đo thành kiểu category
        categorical_features = [
            'gender', 'chest_pain', 'high_blood_pressure', 'irregular_heartbeat',
            'shortness_of_breath', 'fatigue_weakness', 'dizziness', 'swelling_edema',
            'neck_jaw_pain', 'excessive_sweating', 'persistent_cough', 'nausea_vomiting',
            'chest_discomfort', 'cold_hands_feet', 'snoring_sleep_apnea', 'anxiety_doom'
        ]
        for col in categorical_features:
            if col in df.columns:
                df[col] = df[col].astype('category')
                
        # Đảm bảo thứ tự các cột giống với dữ liệu huấn luyện
        expected_columns = ['age', 'gender', 'chest_pain', 'high_blood_pressure', 'irregular_heartbeat', 'shortness_of_breath',
                          'fatigue_weakness', 'dizziness', 'swelling_edema', 'neck_jaw_pain', 'excessive_sweating', 'persistent_cough',
                          'nausea_vomiting', 'chest_discomfort', 'cold_hands_feet', 'snoring_sleep_apnea', 'anxiety_doom']
        
        # Thêm các cột còn thiếu với giá trị 0
        for col in expected_columns:
            if col not in df.columns:
                df[col] = 0
        
        # Sắp xếp lại các cột theo thứ tự mong muốn
        df = df[expected_columns]
        
        # Chuẩn hóa dữ liệu
        scaler = None
        for model_data in models.values():
            if model_data['scaler'] is not None:
                scaler = model_data['scaler']
                break

        if scaler is not None:
            X = scaler.transform(df)
        else:
            X = df.values
        # Dự đoán với tất cả các mô hình
        predictions = {}
        for model_name, model_data in models.items():
            model = model_data['model']
            if model_name == 'RandomForest':
                predictions[model_name] = model.predict(X)
            else:
                predictions[model_name] = model.predict(X)
        # Thực hiện majority voting
        final_predictions = np.zeros(len(X))
        for i in range(len(X)):
            votes = [pred[i] for pred in predictions.values()]
            final_predictions[i] = Counter(votes).most_common(1)[0][0]
        
        # Thêm kết quả dự đoán vào DataFrame gốc
        file.file.seek(0)
        if file.filename.endswith('.xlsx'):
            original_df = pd.read_excel(file.file)
        else:
            original_df = pd.read_csv(file.file)
            
        # Chỉ giữ lại các cột cần thiết và thêm cột kết quả
        result_df = original_df[required_columns].copy()
        result_df['at_risk'] = final_predictions.astype(int)
        
        # Chuyển đổi DataFrame thành danh sách các từ điển
        results = result_df.to_dict('records')
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý file: {str(e)}")

def start():
    """Launched with `poetry run start` at root level"""
    uvicorn.run("predict:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    uvicorn.run("predict:app", host="0.0.0.0", port=8000, reload=True, reload_includes=["*.py"]) 