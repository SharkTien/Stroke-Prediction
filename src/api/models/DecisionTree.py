import numpy as np
from collections import Counter

# Hàm tính Entropy
def entropy(y):
    """
    Tính entropy của một dãy nhãn.
    """
    # Xử lý trường hợp mảng rỗng
    if len(y) == 0:
        return 0

    histogram = np.bincount(y)
    p = histogram / len(y)
    return -np.sum([pi * np.log2(pi) for pi in p if pi > 0])

# Hàm tính Gini Impurity
def gini(y):
    """
    Tính Gini Impurity của một dãy nhãn.
    """
    # Xử lý trường hợp mảng rỗng
    if len(y) == 0:
        return 0

    histogram = np.bincount(y)
    p = histogram / len(y)
    return 1 - np.sum([pi**2 for pi in p])

class Node:
    """
    Parameters:
    -----------
    feature : int or None
        Chỉ số của feature được sử dụng để tách nút.
    threshold : float or int or None
        Ngưỡng tách của feature.
    left : Node
        Nút con bên trái (giá trị nhỏ hơn hoặc bằng threshold).
    right : Node
        Nút con bên phải (giá trị lớn hơn threshold).
    value : int or None
        Giá trị dự đoán nếu đây là nút lá.
    """
    def __init__(self, feature=None, threshold=None, left=None, right=None, *, value=None):
        self.feature = feature
        self.threshold = threshold
        self.left = left
        self.right = right
        self.value = value

    def is_leaf_node(self):
        """Kiểm tra xem nút có phải là nút lá không."""
        return self.value is not None

class DecisionTree:
    """
    Parameters:
    -----------
    criterion : str, default='entropy'
        Tiêu chí đo độ hỗn độn, lựa chọn 'entropy' hoặc 'gini'.
    min_samples_split : int, default=2
        Số mẫu tối thiểu để có thể tách tiếp một nút.
    max_depth : int, default=100
        Độ sâu tối đa của cây.
    n_features : int or None, default=None
        Số lượng feature được chọn ngẫu nhiên tại mỗi bước tách.
        Nếu là None, sẽ sử dụng toàn bộ các feature.
    """
    def __init__(self, criterion='entropy', min_samples_split=2, max_depth=100, n_features=None):
        self.criterion = criterion
        self.min_samples_split = min_samples_split
        self.max_depth = max_depth
        self.n_features = n_features
        self.root = None

    def fit(self, X, y):
        """
        Huấn luyện cây bằng cách xây dựng cấu trúc cây từ dữ liệu X và y.

        Parameters:
        -----------
        X : array-like of shape (n_samples, n_features)
            Tập dữ liệu huấn luyện.
        y : array-like of shape (n_samples,)
            Nhãn của tập dữ liệu huấn luyện.

        Returns:
        --------
        self : DecisionTree
            Đối tượng đã được huấn luyện.
        """

        # Thiết lập số lượng features sẽ xem xét tại mỗi lần tách
        self.n_features = X.shape[1] if self.n_features is None else min(self.n_features, X.shape[1])

        # Bắt đầu xây dựng cây
        self.root = self._grow_tree(X, y)

    def predict(self, X):
        """
        Dự đoán nhãn cho tập dữ liệu mới.

        Parameters:
        -----------
        X : array-like of shape (n_samples, n_features)
            Tập dữ liệu cần dự đoán

        Returns:
        --------
        array : Nhãn dự đoán cho từng mẫu trong X
        """
        X = np.array(X)
        # Kiểm tra số chiều của dữ liệu
        if X.ndim == 1:
            X = X.reshape(1, -1)

        # Dự đoán từng mẫu
        return np.array([self._traverse_tree(x, self.root) for x in X])


    def _calculate_impurity(self, y):
        """
        Tính độ hỗn độn dựa trên tiêu chí lựa chọn.

        Parameters:
        -----------
        y : array-like
            Mảng nhãn cần tính độ hỗn độn

        Returns:
        --------
        float : Giá trị độ hỗn độn
        """
        if self.criterion == 'entropy':
            return entropy(y)
        elif self.criterion == 'gini':
            return gini(y)
        else:
            raise ValueError("Unsupported criterion: choose 'entropy' or 'gini'")

    def _grow_tree(self, X, y, depth=0):
        """
        Phương thức đệ quy để xây dựng cây quyết định.

        Parameters:
        -----------
        X : array-like
            Tập dữ liệu tại nút hiện tại
        y : array-like
            Nhãn của tập dữ liệu tại nút hiện tại
        depth : int
            Độ sâu hiện tại của cây

        Returns:
        --------
        Node : Nút gốc của cây con được tạo
        """
        num_samples, num_features = X.shape
        n_classes = len(np.unique(y))

        # Các tiêu chí dừng:
        if (self.max_depth and depth >= self.max_depth) or n_classes == 1 or num_samples < self.min_samples_split:
          return Node(value=self._most_common_label(y))

        # Chọn số lượng feature cần sử dụng
        n_features_to_use = min(self.n_features, num_features)
        feature_indices = np.random.choice(num_features, n_features_to_use, replace=False)

        # Tìm điểm tách tốt nhất theo Information Gain (dựa trên độ giảm hỗn độn)
        best_feature, best_threshold = self._best_criteria(X, y, feature_indices)

        # Nếu không tìm thấy điểm tách tốt, trả về nút lá
        if best_feature is None:
            leaf_value = self._most_common_label(y)
            return Node(value=leaf_value)

        # Tách dữ liệu theo điểm tách tốt nhất
        left_indices, right_indices = self._split(X[:, best_feature], best_threshold)

        # Nếu một trong hai tập con rỗng, trả về nút lá
        if len(left_indices) == 0 or len(right_indices) == 0:
            leaf_value = self._most_common_label(y)
            return Node(value=leaf_value)

        # Xây dựng đệ quy các cây con
        left_subtree = self._grow_tree(X[left_indices], y[left_indices], depth + 1)
        right_subtree = self._grow_tree(X[right_indices], y[right_indices], depth + 1)

        return Node(feature=best_feature, threshold=best_threshold,
                   left=left_subtree, right=right_subtree)

    def _best_criteria(self, X, y, feature_indices):
        """
        Tìm feature và ngưỡng tốt nhất để tách dữ liệu.

        Parameters:
        -----------
        X : array-like
            Tập dữ liệu tại nút hiện tại
        y : array-like
            Nhãn của tập dữ liệu tại nút hiện tại
        feature_indices : array-like
            Chỉ số các feature được xem xét

        Returns:
        --------
        tuple : (feature_index, threshold) là cặp feature và ngưỡng tốt nhất để tách
                Nếu không tìm thấy điểm tách tốt, trả về (None, None)
        """
        best_gain = -np.inf  # Khởi tạo với giá trị âm vô cùng
        split_index, split_threshold = None, None

        # Lặp qua các feature được chọn
        for feature_index in feature_indices:
            # Lấy cột feature hiện tại
            X_column = X[:, feature_index]
            # Tìm các ngưỡng duy nhất trong cột feature
            thresholds = np.unique(X_column)

            # Nếu chỉ có một giá trị duy nhất trong feature, bỏ qua feature này
            if len(thresholds) == 1:
                continue

            for threshold in thresholds:
                # Tính information gain cho ngưỡng này
                gain = self._information_gain(y, X_column, threshold)

                # Cập nhật nếu tìm thấy gain tốt hơn
                if gain > best_gain:
                    best_gain = gain
                    split_index = feature_index
                    split_threshold = threshold

        # Nếu không tìm thấy điểm tách có information gain dương, trả về None
        if best_gain <= 0:
            return None, None

        return split_index, split_threshold

    def _information_gain(self, y, X_column, split_threshold):
        """
        Tính information gain khi tách dữ liệu theo ngưỡng.

        Parameters:
        -----------
        y : array-like
            Nhãn của tập dữ liệu
        X_column : array-like
            Một cột feature dùng để tách
        split_threshold : float
            Ngưỡng tách

        Returns:
        --------
        float : Information gain đạt được khi tách theo ngưỡng này
        """
        # Tính độ hỗn độn của nút cha
        parent_impurity = self._calculate_impurity(y)

        # Tách dữ liệu thành hai nhánh trái và phải dựa trên ngưỡng
        left_indices, right_indices = self._split(X_column, split_threshold)

        # Nếu một trong hai tập con rỗng, không có information gain
        if len(left_indices) == 0 or len(right_indices) == 0:
            return 0

        # Tính toán trọng số cho mỗi tập con
        n = len(y)
        n_left, n_right = len(left_indices), len(right_indices)
        weight_left = n_left / n
        weight_right = n_right / n

        # Tính độ hỗn độn của các tập con
        impurity_left = self._calculate_impurity(y[left_indices])
        impurity_right = self._calculate_impurity(y[right_indices])

        # Tính độ hỗn độn trung bình có trọng số của các tập con
        weighted_child_impurity = weight_left * impurity_left + weight_right * impurity_right

        # Information gain = độ hỗn độn cha - độ hỗn độn con có trọng số
        return parent_impurity - weighted_child_impurity

    def _split(self, X_column, split_threshold):
        """
        Tách dữ liệu dựa trên một ngưỡng.

        Parameters:
        -----------
        X_column : array-like
            Một cột feature dùng để tách
        split_threshold : float
            Ngưỡng tách

        Returns:
        --------
        tuple : (left_indices, right_indices) là các chỉ số của mẫu thuộc nhánh trái/phải
        """

        left_indices = np.argwhere(X_column <= split_threshold).flatten()
        right_indices = np.argwhere(X_column > split_threshold).flatten()
        return left_indices, right_indices


    def _traverse_tree(self, x, node):
        """
        Duyệt cây để dự đoán nhãn cho một mẫu.

        Parameters:
        -----------
        x : array-like
            Một mẫu cần dự đoán
        node : Node
            Nút hiện tại đang xét

        Returns:
        --------
        int : Nhãn dự đoán cho mẫu x
        """
        # Nếu là nút lá, trả về giá trị dự đoán
        if node.is_leaf_node():
            return node.value

        # Nếu không phải nút lá, tiếp tục duyệt theo điều kiện tách
        if x[node.feature] <= node.threshold:
            return self._traverse_tree(x, node.left)
        return self._traverse_tree(x, node.right)

    def _most_common_label(self, y):
        """
        Tìm nhãn phổ biến nhất trong tập dữ liệu.

        Parameters:
        -----------
        y : array-like
            Tập nhãn cần xét

        Returns:
        --------
        int : Nhãn phổ biến nhất
        """
        counter = Counter(y)
        most_common = counter.most_common(1)[0][0]
        return most_common

