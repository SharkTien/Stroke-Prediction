import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResultPage.css';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!location.state?.formData) {
        console.log('No form data found, redirecting to assessment');
        navigate('/assessment');
        return;
      }

      try {
        console.log('Sending form data:', location.state.formData);
        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(location.state.formData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to get prediction');
        }

        const data = await response.json();
        console.log('Received prediction result:', data);
        setResult(data);
      } catch (err) {
        console.error('Error fetching prediction:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [location.state, navigate]);

  if (loading) {
    return (
      <div className="result-container">
        <div className="loading">Đang phân tích...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-container">
        <div className="error">Có lỗi xảy ra: {error}</div>
        <div className="result-actions">
          <button onClick={() => navigate('/assessment')} className="back-button">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const isHighRisk = result.final_prediction === 1;

  const adviceData = {
    highRisk: {
      title: "Các Biện Pháp Khẩn Cấp và Phòng Ngừa",
      points: [
        "Liên hệ ngay với bác sĩ hoặc cơ sở y tế gần nhất để được thăm khám chi tiết",
        "Theo dõi và kiểm soát huyết áp thường xuyên",
        "Duy trì chế độ ăn giảm muối, giàu rau xanh và trái cây",
        "Tập thể dục nhẹ nhàng theo hướng dẫn của bác sĩ",
        "Hạn chế stress và nghỉ ngơi hợp lý",
        "Tuân thủ nghiêm ngặt các đơn thuốc được kê (nếu có)",
        "Tránh các chất kích thích như rượu, bia, thuốc lá"
      ]
    },
    lowRisk: {
      title: "Lời Khuyên Duy Trì Sức Khỏe",
      points: [
        "Duy trì lối sống lành mạnh và cân bằng",
        "Tập thể dục đều đặn, ít nhất 30 phút mỗi ngày",
        "Ăn uống đầy đủ chất dinh dưỡng, giàu rau xanh và trái cây",
        "Kiểm tra sức khỏe định kỳ 6 tháng/lần",
        "Giữ cân nặng ở mức hợp lý",
        "Hạn chế ăn mặn và thực phẩm chế biến sẵn",
        "Ngủ đủ giấc và quản lý stress hiệu quả"
      ]
    }
  };

  const currentAdvice = isHighRisk ? adviceData.highRisk : adviceData.lowRisk;

  const getExpertNote = (expert) => {
    if (expert.model === 'SVM') {
      return "Chuyên gia được đánh giá cao về độ chính xác và độ tin cậy.";
    }
    return null;
  };

  return (
    <div className="result-container">
      <h1>Kết quả đánh giá</h1>
      
      <div className="expert-predictions">
        {result.expert_predictions && result.expert_predictions.filter(expert => expert.model !== 'RandomForest').length > 0 ? (
          result.expert_predictions.filter(expert => expert.model !== 'RandomForest').map((expert, index) => (
            <div key={index} className={`expert-card ${expert.prediction === 1 ? 'risk' : 'no-risk'}`}>
              <h3>{expert.expert}</h3>
              <p className="model-name">Model: {expert.model}</p>
              <p className="prediction">Kết quả: {expert.result}</p>
            </div>
          ))
        ) : (
          <div className="no-expert-result">Không có kết quả dự đoán từ chuyên gia.</div>
        )}
      </div>

      <div className="final-result">
        <h2>Kết quả cuối cùng</h2>
        <div className={`final-card ${result.final_prediction === 1 ? 'risk' : 'no-risk'}`}>
          <p>{result.final_result}</p>
        </div>
      </div>

      <div className="advice-section">
        <h2>{currentAdvice.title}</h2>
        <ul className="advice-list">
          {currentAdvice.points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>

      <div className="result-actions">
        <button onClick={() => navigate('/assessment')} className="back-button">
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default ResultPage; 