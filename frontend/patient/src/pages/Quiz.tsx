import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { fetchQuestions, submitQuiz, updateResponse } from '../store/slices/quizSlice';
import { Card, Typography, Space, Button, Radio, Checkbox, Input, Steps, Alert, Row, Col, Divider } from 'antd';
import { LoadingSpinner, ProgressBar } from '../components/common';
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SendOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Quiz = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { questions, responses, loading, isSubmitted } = useSelector((state: RootState) => state.quiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState<{[key: number]: string}>({});
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (isSubmitted) {
      toast.success('Quiz submitted successfully!');
      navigate('/recommendations');
    }
  }, [isSubmitted, navigate]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    dispatch(updateResponse({ questionId, answer }));
    // Clear validation error when user provides an answer
    if (validationErrors[questionId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    if (!Array.isArray(questions) || questions.length === 0) return false;
    
    const currentQuestion = questions[currentQuestionIndex];
    const currentResponse = responses.find(r => r.question_id === currentQuestion.id);
    
    // Check if required question is answered
    if (currentQuestion.is_required && (!currentResponse?.answer || currentResponse.answer.trim() === '')) {
      setValidationErrors(prev => ({
        ...prev,
        [currentQuestion.id]: 'This question is required. Please provide an answer.'
      }));
      return false;
    }

    // Clear validation error if question is answered
    if (currentResponse?.answer && currentResponse.answer.trim() !== '') {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[currentQuestion.id];
        return newErrors;
      });
    }

    return true;
  };

  const handleNext = async () => {
    setIsValidating(true);
    
    // Validate current step
    if (!validateCurrentStep()) {
      setIsValidating(false);
      return;
    }

    // Move to next question
    if (currentQuestionIndex < (Array.isArray(questions) ? questions.length : 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    setIsValidating(false);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsValidating(true);
    
    // Validate current step
    if (!validateCurrentStep()) {
      setIsValidating(false);
      return;
    }

    const questionsArray = Array.isArray(questions);
    if (!questionsArray) {
      toast.error('No questions available');
      setIsValidating(false);
      return;
    }

    const allResponses = questions.map(question => {
      const response = responses.find(r => r.question_id === question.id);
      return {
        question_id: question.id,
        answer: response?.answer || ''
      };
    });

    dispatch(submitQuiz(allResponses));
    setIsValidating(false);
  };

  if (loading && !Array.isArray(questions)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto">
          <Card>
            <div className="text-center py-8">
              <ExclamationCircleOutlined className="text-4xl text-gray-400 mb-4" />
              <Title level={3}>No questions available</Title>
              <Text type="secondary">Please try again later.</Text>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses.find(r => r.question_id === currentQuestion.id);
  const currentError = validationErrors[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Create steps for the stepper
  const steps = questions.map((question, index) => ({
    title: `Q${index + 1}`,
    description: question.question.length > 50 ? question.question.substring(0, 50) + '...' : question.question,
    status: (index < currentQuestionIndex ? 'finish' : index === currentQuestionIndex ? 'process' : 'wait') as 'finish' | 'process' | 'wait'
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="!text-4xl !font-bold !text-gray-800 mb-2">
            Hair Loss Assessment Quiz
          </Title>
          <Text className="text-lg text-gray-600">
            Help us understand your hair health journey with personalized questions
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* Progress Sidebar */}
          <Col xs={24} lg={8}>
            <Card className="h-fit sticky top-8">
              <Title level={4} className="!mb-4">Progress</Title>
              
              {/* Progress Bar */}
              <ProgressBar
                current={currentQuestionIndex + 1}
                total={questions.length}
                className="mb-6"
              />

              {/* Steps */}
              <Steps
                direction="vertical"
                current={currentQuestionIndex}
                items={steps.slice(0, Math.min(5, questions.length))}
                className="mb-4"
              />
              
              {questions.length > 5 && (
                <Text type="secondary" className="text-sm">
                  +{questions.length - 5} more questions
                </Text>
              )}

              <Divider />
              
              <div className="text-center">
                <Text strong className="text-lg">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
                </Text>
              </div>
            </Card>
          </Col>

          {/* Main Content */}
          <Col xs={24} lg={16}>
            <Card className="min-h-[600px]">
              {/* Question Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {currentQuestionIndex + 1}
                    </div>
                    <Text type="secondary">Question {currentQuestionIndex + 1} of {questions.length}</Text>
                  </div>
                  {currentQuestion.is_required && (
                    <div className="flex items-center space-x-1 text-red-500">
                      <ExclamationCircleOutlined />
                      <Text type="danger" className="text-sm">Required</Text>
                    </div>
                  )}
                </div>
                
                <Title level={3} className="!mb-0">
                  {currentQuestion.question}
                </Title>
              </div>

              {/* Validation Error */}
              {currentError && (
                <Alert
                  message={currentError}
                  type="error"
                  icon={<ExclamationCircleOutlined />}
                  className="mb-6"
                  showIcon
                />
              )}

              {/* Answer Options */}
              <div className="mb-8">
                {currentQuestion.type === 'single_choice' && currentQuestion.options && (
                  <Radio.Group
                    value={currentResponse?.answer}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="w-full"
                    size="large"
                  >
                    <Space direction="vertical" className="w-full" size="middle">
                      {currentQuestion.options.map((option, index) => (
                        <Radio key={index} value={option} className="!py-2 !px-4 !rounded-lg hover:bg-blue-50 transition-colors">
                          <span className="text-base">{option}</span>
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                )}

                {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                  <Checkbox.Group
                    value={currentResponse?.answer ? currentResponse.answer.split(',') : []}
                    onChange={(values) => handleAnswerChange(currentQuestion.id, values.join(','))}
                    className="w-full"
                  >
                    <Space direction="vertical" className="w-full" size="middle">
                      {currentQuestion.options.map((option, index) => (
                        <Checkbox key={index} value={option} className="!py-2 !px-4 !rounded-lg hover:bg-blue-50 transition-colors">
                          <span className="text-base">{option}</span>
                        </Checkbox>
                      ))}
                    </Space>
                  </Checkbox.Group>
                )}

                {currentQuestion.type === 'scale' && currentQuestion.options && (
                  <Radio.Group
                    value={currentResponse?.answer}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="w-full"
                    size="large"
                  >
                    <Space direction="vertical" className="w-full" size="middle">
                      {currentQuestion.options.map((option, index) => (
                        <Radio key={index} value={option} className="!py-2 !px-4 !rounded-lg hover:bg-blue-50 transition-colors">
                          <span className="text-base">{option}</span>
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                )}

                {currentQuestion.type === 'text' && (
                  <TextArea
                    value={currentResponse?.answer || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Please enter your answer..."
                    rows={6}
                    className="w-full text-base"
                    size="large"
                  />
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t">
                <Button
                  onClick={handlePrevious}
                  disabled={isFirstQuestion}
                  icon={<ArrowLeftOutlined />}
                  size="large"
                  className="min-w-[120px]"
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-2">
                  {currentResponse?.answer && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircleOutlined />
                      <Text type="success" className="text-sm">Answered</Text>
                    </div>
                  )}
                </div>

                {isLastQuestion ? (
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading || isValidating}
                    icon={<SendOutlined />}
                    size="large"
                    className="min-w-[140px]"
                  >
                    {loading ? 'Submitting...' : 'Submit Quiz'}
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleNext}
                    loading={isValidating}
                    icon={<ArrowRightOutlined />}
                    size="large"
                    className="min-w-[120px]"
                  >
                    Next
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Quiz;