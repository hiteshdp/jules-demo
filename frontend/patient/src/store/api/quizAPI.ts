import apiClient from './apiClient';

export const quizAPI = {
  getQuestions: () =>
    apiClient.get('/patient/quiz/questions'),
  
  submitQuiz: (data: { responses: any[] }) =>
    apiClient.post('/patient/quiz/submit', data),
};
