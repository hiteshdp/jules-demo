// Generated via prompt: prompts/appointment_chat_feature_v1.md
import apiClient from './apiClient';

export interface ChatMessage {
  id: number;
  appointment_id: number;
  sender_id: number;
  message: string;
  attachment?: string;
  attachment_url?: string;
  type: 'text' | 'image' | 'file' | 'video' | 'audio' | 'document';
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

  sendMessage: (appointmentId: number, payload: { message: string; file?: File; type?: 'text' | 'image' | 'file' | 'video' | 'audio' | 'document' }) => {
    const formData = new FormData();
    
    // Only append message if it's not empty
    if (payload.message && payload.message.trim()) {
      formData.append('message', payload.message);
    }
    
    if (payload.file) {
      formData.append('attachment', payload.file);
    }
    
    if (payload.type) {
      formData.append('type', payload.type);
    }

    return apiClient.post<{ success: boolean; data: ChatMessage }>(`/patient/appointments/${appointmentId}/chat`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};


