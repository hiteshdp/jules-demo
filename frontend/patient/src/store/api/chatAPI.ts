// Generated via prompt: prompts/appointment_chat_feature_v1.md
import apiClient from './apiClient';

export interface ChatMessage {
  id: number;
  appointment_id: number;
  sender_id: number;
  message: string;
  type: 'text' | 'image' | 'file';
  is_read: boolean;
  created_at: string;
  sender?: {
    id: number;
    name: string;
    email: string;
  };
}

export const chatAPI = {
  getMessages: (appointmentId: number, afterId?: number) =>
    apiClient.get<{ success: boolean; data: ChatMessage[] }>(`/patient/appointments/${appointmentId}/chat${afterId ? `?after_id=${afterId}` : ''}`),

  sendMessage: (appointmentId: number, payload: { message: string; type?: 'text' | 'image' | 'file' }) =>
    apiClient.post<{ success: boolean; data: ChatMessage }>(`/patient/appointments/${appointmentId}/chat`, payload),
};


