import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { fetchQuestions, submitQuiz, updateResponse } from '../store/slices/quizSlice';
import { Card, Typography, Space, Button, Radio, Checkbox, Input, Form } from 'antd';
import { PageHeader, LoadingSpinner, ProgressBar } from '../components/common';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Quiz = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { questions, responses, loading, isSubmitted } = useSelector((state: RootState) => state.quiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [form] = Form.useForm();

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
  };

  const handleNext = () => {
    if (currentQuestionIndex < (Array.isArray(questions) ? questions.length : 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const questionsArray = Array.isArray(questions) ? questions : [];
    const requiredQuestions = questionsArray.filter(q => q.is_required);
    const answeredRequiredQuestions = requiredQuestions.filter(q => 
      responses.some(r => r.question_id === q.id && r.answer.trim() !== '')
    );

    if (answeredRequiredQuestions.length !== requiredQuestions.length) {
      toast.error('Please answer all required questions');
      return;
    }

    dispatch(submitQuiz(responses));
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses.find(r => r.question_id === currentQuestion?.id);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentQuestion) {
    return (
      <div className="text-center">
        <Text type="secondary">No questions available.</Text>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        {/* Progress Bar */}
        <ProgressBar
          current={currentQuestionIndex + 1}
          total={Array.isArray(questions) ? questions.length : 0}
        />

        {/* Question */}
        <div className="mb-6">
          <Title level={3} className="!mb-4">
            {currentQuestion.question}
            {currentQuestion.is_required && <span className="text-red-500 ml-1">*</span>}
          </Title>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.type === 'single_choice' && currentQuestion.options && (
              <Radio.Group
                value={currentResponse?.answer}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="w-full"
              >
                <Space direction="vertical" className="w-full">
                  {currentQuestion.options.map((option, index) => (
                    <Radio key={index} value={option}>
                      {option}
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
                <Space direction="vertical" className="w-full">
                  {currentQuestion.options.map((option, index) => (
                    <Checkbox key={index} value={option}>
                      {option}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            )}

            {currentQuestion.type === 'scale' && currentQuestion.options && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>1 (Lowest)</span>
                  <span>10 (Highest)</span>
                </div>
                <Radio.Group
                  value={currentResponse?.answer}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="w-full"
                >
                  <Space wrap>
                    {currentQuestion.options.map((value, index) => (
                      <Radio key={index} value={value}>
                        {value}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            )}

            {currentQuestion.type === 'text' && (
              <TextArea
                value={currentResponse?.answer || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                rows={4}
                placeholder="Enter your answer..."
                className="w-full"
              />
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <Space>
            {currentQuestionIndex === (Array.isArray(questions) ? questions.length : 0) - 1 ? (
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={loading}
              >
                {loading ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Quiz;
