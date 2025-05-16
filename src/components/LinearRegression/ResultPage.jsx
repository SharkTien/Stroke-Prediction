import React, { useEffect } from 'react';
import { Card, Button } from 'antd';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeartOutlined, WarningOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const ResultContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.1);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
    animation: ${pulseAnimation} 10s infinite ease-in-out;
  }
`;

const ResultCard = styled(Card)`
  width: 100%;
  max-width: 800px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(24, 144, 255, 0.1));
    clip-path: circle(70% at 95% 5%);
  }

  .ant-card-body {
    position: relative;
    z-index: 1;
  }
`;

const ResultTitle = styled.h1`
  color: ${props => props.risk ? '#ff4d4f' : '#52c41a'};
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  animation: ${fadeIn} 1s ease-out;
`;

const ResultIcon = styled.div`
  font-size: 4rem;
  text-align: center;
  margin-bottom: 2rem;
  color: ${props => props.risk ? '#ff4d4f' : '#52c41a'};
  animation: ${pulseAnimation} 2s infinite ease-in-out;
`;

const AdviceSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${props => props.risk ? 'rgba(255, 77, 79, 0.1)' : 'rgba(82, 196, 26, 0.1)'};
  border-radius: 12px;
  animation: ${fadeIn} 1.2s ease-out;
`;

const AdviceTitle = styled.h3`
  color: #1890ff;
  margin-bottom: 1rem;
`;

const AdviceList = styled.ul`
  list-style-type: none;
  padding: 0;

  li {
    margin-bottom: 0.8rem;
    padding-left: 1.5rem;
    position: relative;

    &::before {
      content: '•';
      color: #1890ff;
      position: absolute;
      left: 0;
    }
  }
`;

const BackButton = styled(Button)`
  margin-top: 2rem;
  
  &:hover {
    transform: translateX(-5px);
  }
`;

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Kiểm tra và lấy kết quả từ location state hoặc dùng giá trị mặc định
  // Đây là dữ liệu mẫu để trang luôn hiển thị khi không có dữ liệu thực
  const result = location.state?.result !== undefined ? location.state.result : 0; 
  
  // Thông báo trong console để debug
  useEffect(() => {
    console.log("Location state:", location.state);
    console.log("Result value:", result);
  }, [location, result]);

  const isHighRisk = result === 1;

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

  return (
    <ResultContainer>
      <ResultCard>
        <ResultIcon risk={isHighRisk}>
          {isHighRisk ? <WarningOutlined /> : <HeartOutlined />}
        </ResultIcon>
        <ResultTitle risk={isHighRisk}>
          {isHighRisk 
            ? "⚠️ Cảnh Báo: Nguy Cơ Cao" 
            : "✅ Kết Quả Khả Quan"}
        </ResultTitle>
        <p style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '2rem' }}>
          {isHighRisk
            ? "Kết quả sàng lọc cho thấy bạn có nguy cơ cao về đột quỵ. Vui lòng thực hiện theo các khuyến nghị dưới đây."
            : "Các yếu tố nguy cơ đột quỵ của bạn ở mức thấp. Hãy duy trì lối sống lành mạnh với các lời khuyên sau."}
        </p>

        <AdviceSection risk={isHighRisk}>
          <AdviceTitle>{currentAdvice.title}</AdviceTitle>
          <AdviceList>
            {currentAdvice.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </AdviceList>
        </AdviceSection>

        <BackButton 
          type="primary" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          block
        >
          Quay Lại Trang Chủ
        </BackButton>
      </ResultCard>
    </ResultContainer>
  );
};

export default ResultPage; 