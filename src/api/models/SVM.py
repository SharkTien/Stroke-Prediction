import numpy as np

class LinearSVM:
    """
    Mô hình SVM tuyến tính (Linear Support Vector Machine) được cài đặt từ đầu
    bằng Mini-Batch Gradient Descent và sử dụng hàm mất mát Hinge Loss.

    🎯 Mục tiêu:
    - Phân loại nhị phân với SVM tuyến tính.
    - Tối ưu hóa hàm Hinge Loss bằng thuật toán mini-batch GD.
    - Hỗ trợ điều chuẩn L2 để tránh overfitting.

    Thuộc tính:
    -----------
    - learning_rate (float): tốc độ học (alpha) trong gradient descent.
    - lambda_param (float): hệ số điều chuẩn L2.
    - n_iters (int): số vòng lặp huấn luyện toàn bộ tập dữ liệu.
    - batch_size (int): kích thước mỗi mini-batch khi huấn luyện.
    - weights (np.ndarray): vector trọng số của mô hình (học được).
    - bias (float): hệ số chệch (intercept).
    - loss_history (list): danh sách giá trị mất mát sau mỗi vòng lặp, để theo dõi quá trình học.

    Phương thức:
    -----------
    - fit(X, y): huấn luyện mô hình từ dữ liệu đầu vào.
    - predict(X): dự đoán nhãn lớp (0 hoặc 1) từ dữ liệu đầu vào.
    - predict_proba(X): dự đoán xác suất của lớp dương (dạng gần đúng).
    """

    def __init__(self, learning_rate=0.001, lambda_param=0.01, n_iters=2000, batch_size=32):
        """
        Khởi tạo các siêu tham số và biến lưu trạng thái mô hình.
        """
        self.lr = learning_rate              # Tốc độ học
        self.lambda_param = lambda_param     # Điều chuẩn L2
        self.n_iters = n_iters               # Số vòng lặp (epoch)
        self.batch_size = batch_size         # Số mẫu mỗi batch

        self.weights = None                  # Trọng số mô hình
        self.bias = None                     # Bias (intercept)
        self.loss_history = []               # Lưu lại loss sau mỗi epoch

    def fit(self, X, y, verbose=False):
        """
        Huấn luyện mô hình bằng mini-batch gradient descent.
        """
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)  # Trọng số khởi tạo
        self.bias = 0                        # Bias ban đầu

        # Chuyển nhãn từ 0 → -1 để phù hợp với công thức SVM
        y_ = np.where(y <= 0, -1, 1)

        for i in range(self.n_iters):
            # Xáo trộn dữ liệu mỗi epoch
            indices = np.random.permutation(n_samples)
            X_shuffled = X[indices]
            y_shuffled = y_[indices]

            # Duyệt từng mini-batch
            for start in range(0, n_samples, self.batch_size):
                end = start + self.batch_size
                X_batch = X_shuffled[start:end]
                y_batch = y_shuffled[start:end]

                # Kiểm tra điều kiện margin: y(w.x + b) ≥ 1
                condition = y_batch * (np.dot(X_batch, self.weights) + self.bias) >= 1

                dw = np.zeros(n_features)  # Gradient của weights
                db = 0                    # Gradient của bias

                # Duyệt từng mẫu trong batch để tính gradient
                for idx, cond in enumerate(condition):
                    if cond:
                        # Nếu phân loại đúng và đủ margin, chỉ cần regularization
                        dw += 2 * self.lambda_param * self.weights
                        db += 0
                    else:
                        # Nếu vi phạm margin, thêm phần đạo hàm từ hinge loss
                        dw += 2 * self.lambda_param * self.weights - y_batch[idx] * X_batch[idx]
                        db += -y_batch[idx]

                # Trung bình gradient theo batch
                dw /= len(X_batch)
                db /= len(X_batch)

                # Cập nhật trọng số
                self.weights -= self.lr * dw
                self.bias -= self.lr * db

            # Tính loss toàn bộ sau mỗi epoch (để theo dõi hội tụ)
            hinge_losses = np.maximum(0, 1 - y_ * (np.dot(X, self.weights) + self.bias))
            loss = np.mean(hinge_losses) + self.lambda_param * np.sum(self.weights ** 2)
            self.loss_history.append(loss)

            # In loss nếu bật verbose
            if verbose and i % 100 == 0:
                print(f"Iteration {i}, Loss: {loss:.4f}")

    def predict(self, X):
        """
        Dự đoán nhãn lớp: 1 nếu đầu ra ≥ 0, ngược lại là 0.
        """
        linear_output = np.dot(X, self.weights) + self.bias
        return np.where(linear_output >= 0, 1, 0)

    def predict_proba(self, X):
        """
        Dự đoán xác suất lớp dương bằng sigmoid (xấp xỉ xác suất).
        Dù không đúng về bản chất với SVM, nhưng hữu ích để tính AUC.
        """
        raw_scores = np.dot(X, self.weights) + self.bias
        raw_scores = np.clip(raw_scores, -10, 10)  # Tránh overflow
        return 1 / (1 + np.exp(-raw_scores))

