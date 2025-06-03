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
                    <p><b>Bạn có thể để bất kỳ cột nào bạn muốn</b> (ví dụ: tên, mã số, căn cước, địa chỉ, ...).</p>
                    <p><b>Bắt buộc phải có đầy đủ các cột sau</b> (có thể nằm ở bất kỳ vị trí nào trong file, không cần đúng thứ tự):</p>
                    <ul>
                        <li>age</li>
                        <li>gender <i>("Male" hoặc "Female")</i></li>
                        <li>chest_pain</li>
                        <li>high_blood_pressure</li>
                        <li>irregular_heartbeat</li>
                        <li>shortness_of_breath</li>
                        <li>fatigue_weakness</li>
                        <li>dizziness</li>
                        <li>swelling_edema</li>
                        <li>neck_jaw_pain</li>
                        <li>excessive_sweating</li>
                        <li>persistent_cough</li>
                        <li>nausea_vomiting</li>
                        <li>chest_discomfort</li>
                        <li>cold_hands_feet</li>
                        <li>snoring_sleep_apnea</li>
                        <li>anxiety_doom</li>
                    </ul>
                    <ul>
                        <li>Các cột triệu chứng (từ chest_pain đến anxiety_doom) dùng giá trị <b>1</b> cho "Có" và <b>0</b> cho "Không".</li>
                        <li>Các dòng thiếu dữ liệu ở các cột bắt buộc sẽ không được dự đoán (cột at_risk sẽ để trống).</li>
                        <li><b>Kết quả trả về sẽ giữ nguyên tất cả các cột gốc và thêm cột <span style={{color: 'red'}}>at_risk</span> ở cuối.</b></li>
                    </ul>
                    <div className="guide-notes">
                        <h4>Ví dụ file mẫu:</h4>
                        <table className="guide-table">
                            <thead>
                                <tr>
                                    <th>name</th>
                                    <th>id</th>
                                    <th>age</th>
                                    <th>gender</th>
                                    <th>chest_pain</th>
                                    <th>...</th>
                                    <th>anxiety_doom</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>An</td>
                                    <td>01</td>
                                    <td>45</td>
                                    <td>Male</td>
                                    <td>1</td>
                                    <td>...</td>
                                    <td>0</td>
                                </tr>
                                <tr>
                                    <td>Bình</td>
                                    <td>02</td>
                                    <td>52</td>
                                    <td>Female</td>
                                    <td>0</td>
                                    <td>...</td>
                                    <td>1</td>
                                </tr>
                            </tbody>
                        </table>
                        <p><b>Kết quả trả về:</b> sẽ giữ nguyên mọi cột gốc và thêm cột <b>at_risk</b> ở cuối.</p>
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