import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import recall_score, classification_report, accuracy_score, precision_score, f1_score, roc_auc_score, confusion_matrix
import dill
import os
import argparse
from sklearn.preprocessing import StandardScaler
from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.over_sampling import SMOTE

# Import các mô hình từ thư mục models
# from models.DecisionTree import DecisionTree
# from models.RandomForest import CustomRandomForest
from models.SVM import LinearSVM
from models.LogisticRegression import LogisticRegressionCustom



# Set random state for reproducibility
RANDOM_STATE = 42

def load_and_clean_data(data_path):
    """
    Đọc và tiền xử lý dữ liệu từ file CSV
    """
    print("Loading data...")
    df = pd.read_csv(data_path)
    
    print("\nHandling missing values...")
    df = df.dropna()
    df['gender'] = df['gender'].map({'Male': 1, 'Female': 0})
    
    df = df.drop(['stroke_risk_percentage'], axis=1)
    return df

def prepare_data(data_path):
    """
    Chuẩn bị dữ liệu cho mô hình
    """
    df = load_and_clean_data(data_path)
    X = df.drop(['at_risk'], axis=1)
    y = df['at_risk']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=RANDOM_STATE, stratify=y
    )
    
    return X_train, X_test, y_train, y_test


def train_and_evaluate_model(model, X_train, X_test, y_train, y_test, model_name):
    """
    Huấn luyện và đánh giá mô hình
    """
    print(f"\nTraining {model_name}...")
    
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test) if hasattr(model, "predict_proba") else None
    
    metrics = {
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred, zero_division=0),
        'recall': recall_score(y_test, y_pred, zero_division=0),
        'f1': f1_score(y_test, y_pred, zero_division=0),
        'confusion_matrix': confusion_matrix(y_test, y_pred),
        'report': classification_report(y_test, y_pred, zero_division=0)
    }

    if y_proba is not None:
        metrics['roc_auc'] = roc_auc_score(y_test, y_proba)

    # In kết quả
    print(f"\n=== KẾT QUẢ ĐÁNH GIÁ MÔ HÌNH {model_name.upper()} ===")
    print(f"✅ Accuracy:     {metrics['accuracy']:.4f}")
    print(f"✅ Precision:    {metrics['precision']:.4f}")
    print(f"✅ Recall:       {metrics['recall']:.4f}")
    print(f"✅ F1 Score:     {metrics['f1']:.4f}")
    if 'roc_auc' in metrics:
        print(f"✅ ROC AUC:      {metrics['roc_auc']:.4f}")

    # Vẽ confusion matrix
    
    print(f"\n📊 Báo cáo phân loại:\n{metrics['report']}")

    return model

def save_model(model, scaler, save_path):
    """
    Lưu mô hình và scaler
    """
    save_dir = 'checkpoints'
    os.makedirs(save_dir, exist_ok=True)
    model_data = {
        'model': model,
        'scaler': scaler
    }
    with open(save_path, 'wb') as f:
        dill.dump(model_data, f)
    print(f"\nModel and scaler saved as '{save_path}'")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Train a model for stroke prediction')
    parser.add_argument('--model', type=str, default='LogisticRegression',
                      choices=['SVM', 'LogisticRegression'],
                      help='Chọn mô hình để huấn luyện')

    args = parser.parse_args()
    
    # Chuẩn bị dữ liệu
    print("Loading and preparing data...")
    data_path = os.path.join('models','src', 'data', 'stroke_risk_dataset_v2.csv')
    X_train, X_test, y_train, y_test = prepare_data(data_path)
    
    # Chuẩn hóa dữ liệu
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Khởi tạo mô hình với tham số tương ứng
    if args.model == 'LogisticRegression':
        model = LogisticRegressionCustom(
            learning_rate=0.01,      # Learning rate for gradient descent
            n_iters=2000,           # Number of training iterations
            threshold=0.4,          # Classification threshold
            regularization='l2',    # L2 regularization
            lambda_param=0.1        # Regularization strength
        )
    # elif args.model == 'RandomForest':
    #     model = ImbPipeline([
    #         ('smote', SMOTE(random_state=42)),
    #         ('classifier', CustomRandomForest(
    #             n_estimators=50,     # Số lượng cây vừa phải
    #             max_depth=10,        # Giới hạn độ sâu để tránh overfitting
    #             min_samples_split=5, # Số mẫu tối thiểu để split
    #             criterion='gini',    # Sử dụng Gini impurity
    #             n_features=None      # Tự động chọn sqrt(n_features)
    #         ))
    #     ])
    elif args.model == 'SVM':
        model = LinearSVM(learning_rate=0.001, lambda_param=0.01, n_iters=1000)

    # Huấn luyện và đánh giá mô hình
    trained_model = train_and_evaluate_model(model, X_train_scaled, X_test_scaled, y_train, y_test, args.model)
    
    # Lưu mô hình và scaler
    save_model(trained_model, scaler, f'checkpoints/{args.model.lower()}_model.pkl')