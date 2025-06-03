import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ExcelUpload.css';

const ExcelUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (
            selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            selectedFile.type === 'text/csv' ||
            selectedFile.name.endsWith('.csv')
        )) {
            setFile(selectedFile);
            setError('');
        } else {
            setFile(null);
            setError('Vui lòng chọn file Excel (.xlsx) hoặc CSV (.csv)');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Vui lòng chọn file');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/predict/excel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }); 
            setResults(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Có lỗi xảy ra khi xử lý file');
        } finally {
            setLoading(false);
        }
    };

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = results ? results.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = results ? Math.ceil(results.length / itemsPerPage) : 0;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="excel-upload-container">
            <h2>Đánh giá nguy cơ đột quỵ từ file Excel/CSV</h2>
            
            <div className="guide-section">
                <h3>Hướng dẫn chuẩn bị file Excel/CSV</h3>
                <div className="guide-content">
                    <p>File của bạn cần có các cột sau theo đúng thứ tự và định dạng:</p>
                    <table className="guide-table">
                        <thead>
                            <tr>
                                <th>Tên cột</th>
                                <th>Ý nghĩa</th>
                                <th>Kiểu dữ liệu</th>
                                <th>Giá trị</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>age</td>
                                <td>Tuổi</td>
                                <td>Số</td>
                                <td>Ví dụ: 45</td>
                            </tr>
                            <tr>
                                <td>gender</td>
                                <td>Giới tính</td>
                                <td>Text</td>
                                <td>"Male" hoặc "Female"</td>
                            </tr>
                            <tr>
                                <td>chest_pain</td>
                                <td>Đau ngực</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                            <tr>
                                <td>high_blood_pressure</td>
                                <td>Cao huyết áp</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                            <tr>
                                <td>irregular_heartbeat</td>
                                <td>Nhịp tim không đều</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                            <tr>
                                <td>shortness_of_breath</td>
                                <td>Khó thở</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                            <tr>
                                <td>fatigue_weakness</td>
                                <td>Mệt mỏi, yếu sức</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                            <tr>
                                <td>dizziness</td>
                                <td>Chóng mặt</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                            <tr>
                                <td>swelling_edema</td>
                                <td>Phù nề</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                            <tr>
                                <td>neck_jaw_pain</td>
                                <td>Đau cổ/hàm</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                            <tr>
                                <td>excessive_sweating</td>
                                <td>Đổ mồ hôi nhiều</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                            <tr>
                                <td>persistent_cough</td>
                                <td>Ho dai dẳng</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                            <tr>
                                <td>nausea_vomiting</td>
                                <td>Buồn nôn/nôn</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                            <tr>
                                <td>chest_discomfort</td>
                                <td>Khó chịu ở ngực</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                            <tr>
                                <td>cold_hands_feet</td>
                                <td>Tay chân lạnh</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                            <tr>
                                <td>snoring_sleep_apnea</td>
                                <td>Ngáy/ngưng thở khi ngủ</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                            <tr>
                                <td>anxiety_doom</td>
                                <td>Lo lắng/cảm giác sắp chết</td>
                                <td>Số</td>
                                <td>1 (Có) hoặc 0 (Không)</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="guide-notes">
                        <h4>Lưu ý quan trọng:</h4>
                        <ul>
                            <li>Tất cả các cột phải có đúng tên như trong bảng trên</li>
                            <li>Các cột phải được sắp xếp đúng thứ tự như trong bảng</li>
                            <li>Đối với các triệu chứng (từ cột chest_pain đến anxiety_doom), sử dụng 1 cho "Có" và 0 cho "Không"</li>
                            <li>Giới tính (gender) phải được nhập là "Male" hoặc "Female"</li>
                            <li>Tuổi (age) phải là số</li>
                        </ul>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="upload-form">
                <div className="file-input-container">
                    <input
                        type="file"
                        accept=".xlsx,.csv"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                    <button type="submit" disabled={loading || !file} className="upload-button">
                        {loading ? 'Đang xử lý...' : 'Tải lên và đánh giá'}
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </form>

            {results && (
                <div className="results-container">
                    <h3>Kết quả đánh giá</h3>
                    <div className="table-container">
                        <table className="results-table">
                            <thead>
                                <tr>
                                    {Object.keys(results[0]).map((header) => (
                                        <th key={header}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((value, i) => (
                                            <td key={i}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination controls */}
                    <div className="pagination">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-button"
                        >
                            Trước
                        </button>
                        <span className="page-info">
                            Trang {currentPage} / {totalPages}
                        </span>
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="pagination-button"
                        >
                            Sau
                        </button>
                    </div>

                    <button 
                        onClick={() => {
                            const csvContent = "data:text/csv;charset=utf-8," 
                                + Object.keys(results[0]).join(",") + "\n"
                                + results.map(row => Object.values(row).join(",")).join("\n");
                            const encodedUri = encodeURI(csvContent);
                            const link = document.createElement("a");
                            link.setAttribute("href", encodedUri);
                            link.setAttribute("download", "ket_qua_danh_gia.csv");
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                        className="download-button"
                    >
                        Tải xuống kết quả
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExcelUpload; 