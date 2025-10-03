import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { fetchQuestions, submitQuiz, updateResponse } from '../store/slices/quizSlice';
import toast from 'react-hot-toast';

const Quiz = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { questions, responses, loading, isSubmitted } = useSelector((state: RootState) => state.quiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center">
        <p className="text-gray-500">No questions available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestionIndex + 1} of {Array.isArray(questions) ? questions.length : 0}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / (Array.isArray(questions) ? questions.length : 1)) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / (Array.isArray(questions) ? questions.length : 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
              {currentQuestion.is_required && <span className="text-red-500 ml-1">*</span>}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.type === 'single_choice' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="radio"
                        name={`question_${currentQuestion.id}`}
                        value={option}
                        checked={currentResponse?.answer === option}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => {
                    const selectedAnswers = currentResponse?.answer ? currentResponse.answer.split(',') : [];
                    return (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          value={option}
                          checked={selectedAnswers.includes(option)}
                          onChange={(e) => {
                            const currentAnswers = currentResponse?.answer ? currentResponse.answer.split(',') : [];
                            let newAnswers;
                            if (e.target.checked) {
                              newAnswers = [...currentAnswers, option];
                            } else {
                              newAnswers = currentAnswers.filter(a => a !== option);
                            }
                            handleAnswerChange(currentQuestion.id, newAnswers.join(','));
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">{option}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'scale' && currentQuestion.options && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>1 (Lowest)</span>
                    <span>10 (Highest)</span>
                  </div>
                  <div className="flex space-x-2">
                    {currentQuestion.options.map((value, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="radio"
                          name={`question_${currentQuestion.id}`}
                          value={value}
                          checked={currentResponse?.answer === value}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-1 text-sm text-gray-700">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {currentQuestion.type === 'text' && (
                <textarea
                  value={currentResponse?.answer || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Enter your answer..."
                />
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              {currentQuestionIndex === (Array.isArray(questions) ? questions.length : 0) - 1 ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Quiz'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
