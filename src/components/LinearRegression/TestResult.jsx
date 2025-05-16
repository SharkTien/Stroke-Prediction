import React from 'react';
import { Button, Space, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const TestContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  padding: 2rem;
`;

const TestCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const TestResult = () => {
  const navigate = useNavigate();

  const handleNavigateToResult = (result) => {
    // Chuyển đến trang kết quả với dữ liệu giả định
    navigate('/result', { state: { result } });
  };

  return (
    <TestContainer>
      <TestCard title="Kiểm tra trang kết quả">
        <p>Nhấn nút bên dưới để xem trước các kết quả có thể có:</p>
        
        <Space direction="vertical" style={{ width: '100%', marginTop: '1rem' }}>
          <Button 
            type="primary" 
            block 
            onClick={() => handleNavigateToResult(0)}
          >
            Xem kết quả: Nguy cơ thấp
          </Button>
          
          <Button 
            type="danger" 
            block 
            onClick={() => handleNavigateToResult(1)}
          >
            Xem kết quả: Nguy cơ cao
          </Button>
        </Space>
      </TestCard>
    </TestContainer>
  );
};

export default TestResult; 