import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, message, Space, Row, Col, Progress } from 'antd';
import styled from 'styled-components';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const FormContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #6A11CB 0%, #2575FC 100%);
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before, &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    pointer-events: none;
  }

  &::before {
    top: -100px;
    left: -100px;
    animation: float 15s infinite ease-in-out;
  }

  &::after {
    bottom: -100px;
    right: -100px;
    width: 250px;
    height: 250px;
    animation: float 18s infinite ease-in-out reverse;
  }

  @keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(30px, 30px) rotate(10deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
`;

const FloatingShape = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  pointer-events: none;
  z-index: 0;

  &.shape1 {
    width: 120px;
    height: 120px;
    top: 20%;
    left: 15%;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    animation: morphing 15s infinite alternate ease-in-out;
  }

  &.shape2 {
    width: 80px;
    height: 80px;
    bottom: 15%;
    right: 10%;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    animation: morphing 12s infinite alternate-reverse ease-in-out;
  }

  &.shape3 {
    width: 60px;
    height: 60px;
    top: 30%;
    right: 20%;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    animation: morphing 20s infinite alternate ease-in-out;
  }

  @keyframes morphing {
    0% {
      border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    }
    25% {
      border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
    }
    50% {
      border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
    }
    75% {
      border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
    }
    100% {
      border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    }
  }
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 1000px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transform: translateY(0);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  z-index: 2;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(90deg, #6A11CB, #2575FC);
  }

  .ant-card-head {
    border-bottom: none;
    padding: 24px;
    
    .ant-card-head-title {
      font-size: 1.8rem;
      font-weight: 700;
      background-image: linear-gradient(135deg, #6A11CB 0%, #2575FC 100%);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      letter-spacing: -0.5px;
    }
  }

  .ant-card-body {
    padding: 0 24px 24px;
    position: relative;
    z-index: 1;
  }
`;

const BlockCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.5s ease;
  border: 1px solid rgba(255, 255, 255, 0.7);
  overflow: hidden;
  position: relative;
  animation: ${props => props.direction === 'next' ? 'slideInRight' : 'slideInLeft'} 0.5s forwards;

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(106, 17, 203, 0.03), rgba(37, 117, 252, 0.03));
    clip-path: polygon(0 70%, 100% 40%, 100% 100%, 0% 100%);
    transition: all 0.4s ease;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  &:hover::after {
    clip-path: polygon(0 60%, 100% 30%, 100% 100%, 0% 100%);
  }

  .ant-card-body {
    position: relative;
    z-index: 2;
    padding: 20px;
  }

  .ant-form-item {
    position: relative;
    z-index: 3;
    margin-bottom: 24px;
  }

  .ant-form-item-label > label {
    font-weight: 500;
    color: #333;
  }

  .ant-input,
  .ant-select-selector {
    position: relative;
    z-index: 3;
    background: white !important;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 8px 12px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
  }

  .ant-input:hover,
  .ant-select-selector:hover {
    border-color: rgba(106, 17, 203, 0.3);
  }

  .ant-input:focus,
  .ant-select-selector:focus,
  .ant-select-focused .ant-select-selector {
    border-color: #6A11CB !important;
    box-shadow: 0 0 0 2px rgba(106, 17, 203, 0.2) !important;
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 0 1rem;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const StepDot = styled.div`
  width: ${props => props.active ? '18px' : '12px'};
  height: ${props => props.active ? '18px' : '12px'};
  border-radius: 50%;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)' 
    : 'rgba(0, 0, 0, 0.1)'};
  margin: 0 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: ${props => props.active ? '0 2px 6px rgba(106, 17, 203, 0.4)' : 'none'};

  &:hover {
    transform: scale(1.2);
    background: ${props => props.active 
      ? 'linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)' 
      : 'rgba(106, 17, 203, 0.3)'};
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -10px;
    height: 2px;
    width: ${props => props.last ? '0' : '8px'};
    background-color: rgba(0, 0, 0, 0.1);
    transform: translateY(-50%);
  }
`;

const StepButton = styled(Button)`
  &.ant-btn {
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 18px;
    transition: all 0.3s ease;
    border: none;
    background: ${props => props.type === 'primary' 
      ? 'linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)' 
      : 'rgba(255, 255, 255, 0.8)'};
    color: ${props => props.type === 'primary' ? 'white' : '#333'};
    font-weight: 500;
    height: auto;
    box-shadow: ${props => props.type === 'primary' 
      ? '0 4px 15px rgba(106, 17, 203, 0.3)' 
      : '0 4px 15px rgba(0, 0, 0, 0.05)'};

    &:hover {
      transform: translateY(-3px);
      box-shadow: ${props => props.type === 'primary' 
        ? '0 6px 20px rgba(106, 17, 203, 0.4)' 
        : '0 6px 20px rgba(0, 0, 0, 0.1)'};
      background: ${props => props.type === 'primary' 
        ? 'linear-gradient(135deg, #5910b0 0%, #1e64d3 100%)' 
        : 'rgba(255, 255, 255, 0.9)'};
    }

    &:active {
      transform: translateY(-1px);
    }

    &:disabled {
      background: #e0e0e0;
      color: #a0a0a0;
      box-shadow: none;
      cursor: not-allowed;
    }
  }
`;

const ProgressContainer = styled.div`
  margin: 0 0 2rem 0;
  padding: 0 1rem;

  .ant-progress-inner {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .ant-progress-bg {
    background: linear-gradient(90deg, #6A11CB, #2575FC);
    box-shadow: 0 2px 6px rgba(106, 17, 203, 0.3);
    height: 12px !important;
  }

  .ant-progress-text {
    color: #6A11CB;
    font-weight: 500;
  }
`;

const StepTitle = styled.h2`
  background-image: linear-gradient(135deg, #6A11CB 0%, #2575FC 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: -0.5px;
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 24px;
  }
`;

const InfoBox = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(106, 17, 203, 0.05) 0%, rgba(37, 117, 252, 0.05) 100%);
  border-radius: 16px;
  border-left: 4px solid #6A11CB;
  position: relative;
  overflow: hidden;

  h3 {
    color: #6A11CB;
    margin-bottom: 10px;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #444;
    line-height: 1.6;
  }

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    right: -20px;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, rgba(106, 17, 203, 0.1) 0%, rgba(37, 117, 252, 0.1) 100%);
    border-radius: 50%;
  }
`;

const QuestionLabel = styled.span`
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
  line-height: 1.5;
`;

const LinearRegressionForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState('next');
  const navigate = useNavigate();

  const genderOptions = [
    { value: '0', label: 'Nữ' },
    { value: '1', label: 'Nam' },
  ];

  const binaryOptions = [
    { value: '0', label: 'Không' },
    { value: '1', label: 'Có' },
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = {
        age: parseFloat(values.age),
        gender: parseInt(values.gender),
        chest_pain: parseInt(values.chest_pain),
        high_blood: parseInt(values.high_blood_pressure),
        irregular_h: parseInt(values.irregular_heartbeat),
        shortness_of: parseInt(values.shortness_of_breath),
        fatigue_we: parseInt(values.fatigue_weakness),
        dizziness: parseInt(values.dizziness),
        swelling_e: parseInt(values.swelling_edema),
        neck_jaw_r: parseInt(values.neck_jaw_pain),
        excessive_: parseInt(values.excessive_sweating),
        persistent: parseInt(values.persistent_cough),
        nausea_vo: parseInt(values.nausea_vomiting),
        chest_disc: parseInt(values.chest_discomfort),
        cold_hands: parseInt(values.cold_hands_feet),
        snoring_sl: parseInt(values.snoring_sleep_apnea),
        anxiety_do: parseInt(values.anxiety_doom),
      };

      console.log('Form data:', formData);

      try {
        // Thử kết nối với API thực
        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        message.success('Đánh giá hoàn tất');
        navigate('/result', { state: { result: result.prediction } });
      } catch (error) {
        // Nếu API thất bại, sử dụng kết quả mẫu
        console.warn('API call failed, using mock data instead', error);
        
        // Tạo kết quả mẫu dựa trên dữ liệu form
        // (ví dụ: nguy cơ cao nếu có nhiều triệu chứng chính)
        const riskFactors = [
          formData.chest_pain, 
          formData.high_blood, 
          formData.irregular_h, 
          formData.shortness_of
        ];
        
        const numRiskFactors = riskFactors.filter(factor => factor === 1).length;
        const mockResult = numRiskFactors >= 2 ? 1 : 0;
        
        message.success('Đánh giá hoàn tất (dữ liệu mẫu)');
        navigate('/result', { state: { result: mockResult } });
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formBlocks = {
    personalInfo: [
      { 
        name: 'age', 
        label: 'Vui lòng cho biết tuổi của bạn',  
        type: 'number'
      },
      { 
        name: 'gender', 
        label: 'Vui lòng chọn giới tính của bạn',
        type: 'select', 
        options: genderOptions
      },
    ],
    primarySymptoms: [
      { 
        name: 'chest_pain', 
        label: 'Bạn có thường xuyên cảm thấy đau hoặc tức ngực không? Đặc biệt là cảm giác đau thắt, đè nén hoặc bóp nghẹt vùng ngực'
      },
      { 
        name: 'high_blood_pressure', 
        label: 'Bạn có tiền sử tăng huyết áp hoặc đang điều trị huyết áp cao không?'
      },
      { 
        name: 'irregular_heartbeat', 
        label: 'Bạn có cảm thấy tim đập không đều, đánh trống ngực hoặc cảm giác tim đập nhanh bất thường không?'
      },
      { 
        name: 'shortness_of_breath', 
        label: 'Bạn có thường xuyên cảm thấy khó thở, đặc biệt khi gắng sức hoặc khi nằm không?'
      },
    ],
    secondarySymptoms: [
      { 
        name: 'fatigue_weakness', 
        label: 'Gần đây bạn có cảm thấy mệt mỏi bất thường, suy nhược hoặc không có năng lượng không?'
      },
      { 
        name: 'dizziness', 
        label: 'Bạn có hay bị chóng mặt, hoa mắt hoặc cảm giác choáng váng không?'
      },
      { 
        name: 'swelling_edema', 
        label: 'Bạn có nhận thấy hiện tượng sưng hoặc phù nề ở chân, mắt cá chân hoặc các bộ phận khác của cơ thể không?'
      },
      { 
        name: 'neck_jaw_pain', 
        label: 'Bạn có cảm giác đau hoặc khó chịu ở vùng cổ, hàm, lan ra vai không?'
      },
    ],
    additionalSymptoms: [
      { 
        name: 'excessive_sweating', 
        label: 'Bạn có thường xuyên đổ mồ hôi nhiều một cách bất thường, đặc biệt là khi không hoạt động gắng sức không?'
      },
      { 
        name: 'persistent_cough', 
        label: 'Bạn có bị ho kéo dài, ho về đêm hoặc ho khi nằm không?'
      },
      { 
        name: 'nausea_vomiting', 
        label: 'Bạn có cảm giác buồn nôn hoặc nôn không rõ nguyên nhân không?'
      },
      { 
        name: 'chest_discomfort', 
        label: 'Bạn có cảm giác khó chịu, đau tức hoặc nặng nề ở vùng ngực không?'
      },
    ],
    otherFactors: [
      { 
        name: 'cold_hands_feet', 
        label: 'Bạn có thường xuyên cảm thấy lạnh ở bàn tay, bàn chân không?'
      },
      { 
        name: 'snoring_sleep_apnea', 
        label: 'Bạn có ngáy to khi ngủ hoặc được người khác phát hiện có hiện tượng ngưng thở khi ngủ không?'
      },
      { 
        name: 'anxiety_doom', 
        label: 'Gần đây bạn có cảm giác lo âu, bất an hoặc linh cảm không tốt về sức khỏe của mình không?'
      },
    ],
  };

  const steps = [
    {
      title: "Thông Tin Cá Nhân",
      fields: formBlocks.personalInfo,
    },
    {
      title: "Triệu Chứng Chính",
      fields: formBlocks.primarySymptoms,
    },
    {
      title: "Triệu Chứng Phụ",
      fields: formBlocks.secondarySymptoms,
    },
    {
      title: "Triệu Chứng Khác",
      fields: formBlocks.additionalSymptoms,
    },
    {
      title: "Yếu Tố Nguy Cơ Khác",
      fields: formBlocks.otherFactors,
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection('next');
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection('prev');
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step) => {
    setDirection(step > currentStep ? 'next' : 'prev');
    setCurrentStep(step);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderFormItems = (fields) => {
    return fields.map((field, index) => (
      <Col span={24} key={field.name}>
        <Form.Item
          label={<QuestionLabel>{field.label}</QuestionLabel>}
          name={field.name}
          rules={[{ required: true, message: `Vui lòng trả lời câu hỏi này` }]}
        >
          {field.type === 'number' ? (
            <Input 
              type="number" 
              placeholder="Nhập số tuổi" 
              size="large"
            />
          ) : field.type === 'select' ? (
            <Select 
              options={field.options} 
              placeholder="Chọn giới tính" 
              size="large"
              dropdownStyle={{ zIndex: 1050 }}
            />
          ) : (
            <Select 
              options={binaryOptions} 
              placeholder="Chọn câu trả lời"
              size="large"
              dropdownStyle={{ zIndex: 1050 }}
            />
          )}
        </Form.Item>
      </Col>
    ));
  };

  return (
    <FormContainer>
      <FloatingShape className="shape1" />
      <FloatingShape className="shape2" />
      <FloatingShape className="shape3" />
      
      <StyledCard title="Đánh Giá Nguy Cơ Đột Quỵ">
        <InfoBox>
          <h3>Hướng Dẫn Khám Sàng Lọc</h3>
          <p>Kính chào quý khách! Để giúp chúng tôi đánh giá chính xác nguy cơ đột quỵ của bạn, vui lòng trả lời các câu hỏi dưới đây một cách chi tiết và trung thực nhất.</p>
        </InfoBox>

        <ProgressContainer>
          <Progress 
            percent={progress} 
            status="active" 
            strokeColor={{ from: '#6A11CB', to: '#2575FC' }} 
            format={percent => `${Math.round(percent)}%`}
          />
        </ProgressContainer>

        <StyledForm form={form} layout="vertical" onFinish={onFinish}>
          {steps.map((step, index) => (
            <BlockCard
              key={index}
              direction={direction}
              style={{
                display: currentStep === index ? 'block' : 'none',
              }}
            >
              <StepTitle>{step.title}</StepTitle>
              <Row gutter={16}>
                {renderFormItems(step.fields)}
              </Row>
            </BlockCard>
          ))}

          <NavigationContainer>
            <StepButton 
              onClick={prevStep} 
              disabled={currentStep === 0}
              icon={<LeftOutlined />}
            >
              Quay lại
            </StepButton>

            <StepIndicator>
              {steps.map((_, index) => (
                <StepDot
                  key={index}
                  active={currentStep === index}
                  last={index === steps.length - 1}
                  onClick={() => goToStep(index)}
                />
              ))}
            </StepIndicator>

            {currentStep === steps.length - 1 ? (
              <StepButton type="primary" onClick={() => form.submit()} loading={loading}>
                Hoàn thành
              </StepButton>
            ) : (
              <StepButton type="primary" onClick={nextStep} icon={<RightOutlined />}>
                Tiếp tục
              </StepButton>
            )}
          </NavigationContainer>
        </StyledForm>
      </StyledCard>
    </FormContainer>
  );
};

export default LinearRegressionForm; 