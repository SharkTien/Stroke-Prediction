import numpy as np
import pandas as pd
# from models.DecisionTree import DecisionTree

class CustomRandomForest:
    def __init__(self, n_estimators=50, max_depth=10, min_samples_split=5, criterion='gini', n_features=None):
        """
        Khởi tạo mô hình Random Forest tùy chỉnh.

        Parameters:
        -----------
        n_estimators : int, default=50
            Số lượng cây trong rừng.
        max_depth : int, default=10
            Độ sâu tối đa của mỗi cây.
        min_samples_split : int, default=5
            Số mẫu tối thiểu để chia nhánh.
        criterion : str, default='gini'
            Tiêu chí đánh giá chất lượng chia nhánh ("gini" hoặc "entropy").
        n_features : int or None, default=None
            Số lượng feature được chọn ngẫu nhiên tại mỗi bước tách.
        """
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.criterion = criterion
        self.n_features = n_features
        self.trees = []

    def fit(self, X, y):
        """
        Huấn luyện mô hình bằng cách tạo nhiều cây quyết định với dữ liệu bootstrap.

        Parameters:
        -----------
        X : array-like of shape (n_samples, n_features)
            Tập dữ liệu huấn luyện.
        y : array-like of shape (n_samples,)
            Nhãn của tập dữ liệu huấn luyện.
        """
        self.trees = []
        
        # Chuyển đổi dữ liệu sang numpy array
        X_array = X.values if isinstance(X, pd.DataFrame) else X
        y_array = y.values if isinstance(y, pd.Series) else y
        
        # Xác định số lượng features được xem xét tại mỗi split
        if self.n_features is None:
            self.n_features = int(np.sqrt(X_array.shape[1]))  # Mặc định là sqrt(n_features)
        
        # Huấn luyện các cây
        for _ in range(self.n_estimators):
            # Lấy mẫu bootstrap
            X_bootstrap, y_bootstrap = self._bootstrap_sample(X_array, y_array)
            
            # Tạo và huấn luyện cây quyết định
            tree = DecisionTree(
                criterion=self.criterion,
                max_depth=self.max_depth,
                min_samples_split=self.min_samples_split,
                n_features=self.n_features
            )
            tree.fit(X_bootstrap, y_bootstrap)
            self.trees.append(tree)

    def predict(self, X):
        """
        Dự đoán nhãn đầu ra cho X bằng phương pháp voting đa số từ các cây.

        Parameters:
        -----------
        X : array-like of shape (n_samples, n_features)
            Tập dữ liệu cần dự đoán.

        Returns:
        --------
        array : Nhãn dự đoán cho từng mẫu trong X.
        """
        X_array = X.values if isinstance(X, pd.DataFrame) else X
        predictions = np.zeros((len(X_array), self.n_estimators))
        
        for i, tree in enumerate(self.trees):
            predictions[:, i] = tree.predict(X_array)

        # Đa số phiếu (majority voting)
        return np.array([
            np.bincount(predictions[i, :].astype(int)).argmax()
            for i in range(predictions.shape[0])
        ])

    def _bootstrap_sample(self, X, y):
        """
        Tạo mẫu bootstrap từ X và y (lấy ngẫu nhiên có hoàn lại).

        Parameters:
        -----------
        X : array-like
            Tập dữ liệu gốc.
        y : array-like
            Nhãn của tập dữ liệu gốc.

        Returns:
        --------
        tuple : (X_bootstrap, y_bootstrap) là cặp dữ liệu và nhãn được lấy mẫu.
        """
        n_samples = X.shape[0]
        indices = np.random.choice(n_samples, size=n_samples, replace=True)
        return X[indices], y[indices]

    
    def score(self, X, y):
        """
        Tính độ chính xác của mô hình.

        Parameters:
        -----------
        X : array-like
            Tập dữ liệu cần đánh giá.
        y : array-like
            Nhãn thực tế của tập dữ liệu.

        Returns:
        --------
        float : Độ chính xác của mô hình.
        """
        return accuracy_score(y, self.predict(X))
