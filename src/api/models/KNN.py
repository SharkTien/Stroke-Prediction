import numpy as np
from collections import Counter

class KNNClassifier:
    """
    Thuật toán K-Nearest Neighbors (KNN) - phiên bản tối ưu hóa bằng vector hóa.

    Các tham số:
    -------------
    k : int
        Số lượng láng giềng gần nhất cần xét.

    Các phương thức:
    ----------------
    fit(X, y)
        Lưu dữ liệu huấn luyện.

    predict(X)
        Dự đoán nhãn lớp cho tập dữ liệu đầu vào.

    predict_proba(X)
        Dự đoán xác suất lớp dương (chỉ dùng cho bài toán nhị phân).
    """

    def __init__(self, k=3):
        self.k = k
        self.X_train = None
        self.y_train = None

    def fit(self, X, y):
        self.X_train = X
        self.y_train = y

    def _compute_all_distances(self, X):
        # Tính toán toàn bộ ma trận khoảng cách Euclidean giữa X và X_train
        X_square = np.sum(X**2, axis=1).reshape(-1, 1)
        X_train_square = np.sum(self.X_train**2, axis=1).reshape(1, -1)
        cross_term = np.dot(X, self.X_train.T)
        distances = np.sqrt(np.maximum(X_square - 2 * cross_term + X_train_square, 0))
        return distances

    def predict(self, X):
        distances = self._compute_all_distances(X)
        k_indices = np.argsort(distances, axis=1)[:, :self.k]
        k_nearest_labels = self.y_train[k_indices]
        predictions = np.array([Counter(row).most_common(1)[0][0] for row in k_nearest_labels])
        return predictions

    def predict_proba(self, X):
        distances = self._compute_all_distances(X)
        k_indices = np.argsort(distances, axis=1)[:, :self.k]
        k_nearest_labels = self.y_train[k_indices]
        return np.mean(k_nearest_labels, axis=1)

