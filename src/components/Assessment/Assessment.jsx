import React from 'react';
import { Link } from 'react-router-dom';
import './Assessment.css';

const Assessment = () => {
    const handleDownloadTemplate = () => {
        // Tạo nội dung CSV mẫu
        const headers = [
            'age', 'gender', 'chest_pain', 'high_blood_pressure', 'irregular_heartbeat', 'shortness_of_breath', 'fatigue_weakness', 'dizziness', 'swelling_edema', 'neck_jaw_pain', 'excessive_sweating', 'persistent_cough', 'nausea_vomiting', 'chest_discomfort', 'cold_hands_feet', 'snoring_sleep_apnea', 'anxiety_doom'
        ];
        
        const sampleData = [
            '45', 'Male', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'
        ];
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + sampleData.join(",");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "mau_du_lieu_danh_gia.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="assessment-container">
            <h2>Đánh giá nguy cơ đột quỵ</h2>
            <div className="assessment-options">
                <Link to="/assessment-form" className="assessment-option">
                    <div className="option-content">
                        <h3>Đánh giá cá nhân</h3>
                        <p>Điền thông tin cá nhân để được đánh giá nguy cơ đột quỵ</p>
                    </div>
                </Link>
                <div className="assessment-option">
                    <div className="option-content">
                        <h3>Đánh giá hàng loạt</h3>
                        <p>Upload file Excel để đánh giá nguy cơ đột quỵ cho nhiều người</p>
                        <div className="option-actions">
                            <Link to="/excel-upload" className="action-button">
                                Upload Excel
                            </Link>
                            <button onClick={handleDownloadTemplate} className="action-button secondary">
                                Tải mẫu CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assessment; 