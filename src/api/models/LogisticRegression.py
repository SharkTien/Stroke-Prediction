import numpy as np

class LogisticRegressionCustom:
    """
    Triển khai Logistic Regression.

    Các tham số:
    -------------
    learning_rate : float, mặc định=0.01
        Tốc độ học của thuật toán Gradient Descent.

    n_iters : int, mặc định=1000
        Số vòng lặp Gradient Descent.

    threshold : float, mặc định=0.5
        Ngưỡng phân loại. Nếu xác suất lớn hơn ngưỡng, dự đoán là 1, ngược lại là 0.

    regularization : str, mặc định=None
        Loại điều chuẩn ('l1', 'l2' hoặc None).

    lambda_param : float, mặc định=0.1
        Tham số điều chuẩn.

    Thuộc tính:
    -----------
    weights : numpy.ndarray
        Các trọng số học được của mô hình Logistic Regression.

    bias : float
        Giá trị bias (hệ số chệch) của mô hình.

    loss_history : list
        Danh sách các giá trị mất mát (loss) qua các vòng lặp.

    Các phương thức:
    ----------------
    fit(X, y, verbose=False)
        Huấn luyện mô hình Logistic Regression bằng thuật toán Gradient Descent.

    predict_proba(X)
        Dự đoán xác suất của lớp dương cho đầu vào.

    predict(X)
        Dự đoán nhãn lớp (0 hoặc 1) cho đầu vào.
    """

    def __init__(self, learning_rate=0.01, n_iters=1000, threshold=0.5, regularization=None, lambda_param=0.1):
        self.lr = learning_rate
        self.n_iters = n_iters
        self.threshold = threshold
        self.weights = None
        self.bias = None
        self.regularization = regularization
        self.lambda_param = lambda_param
        self.loss_history = []

    def _sigmoid(self, z):
        return 1 / (1 + np.exp(-z))

    def _compute_loss(self, y_true, y_pred):
        epsilon = 1e-15
        y_pred = np.clip(y_pred, epsilon, 1 - epsilon)
        loss = -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))

        if self.regularization == 'l1':
            loss += self.lambda_param * np.sum(np.abs(self.weights))
        elif self.regularization == 'l2':
            loss += self.lambda_param * np.sum(self.weights**2)
        return loss

    def fit(self, X, y, verbose=False):
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0

        for i in range(self.n_iters):
            linear_model = np.dot(X, self.weights) + self.bias
            y_pred = self._sigmoid(linear_model)

            dw = (1 / n_samples) * np.dot(X.T, (y_pred - y))
            db = (1 / n_samples) * np.sum(y_pred - y)

            if self.regularization == 'l1':
                dw += self.lambda_param * np.sign(self.weights)
            elif self.regularization == 'l2':
                dw += 2 * self.lambda_param * self.weights

            self.weights -= self.lr * dw
            self.bias -= self.lr * db

            loss = self._compute_loss(y, y_pred)
            self.loss_history.append(loss)

            if verbose and i % 100 == 0:
                print(f"Iteration {i}, Loss: {loss:.4f}")

    def predict_proba(self, X):
        linear_model = np.dot(X, self.weights) + self.bias
        return self._sigmoid(linear_model)

    def predict(self, X):
        probabilities = self.predict_proba(X)
        return (probabilities > self.threshold).astype(int)


