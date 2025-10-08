// Generated via prompt: prompts/zoom_video_call_integration_v1.md
import React, { useState } from 'react';
import { VideoCameraIcon, PlayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ZoomMeetingData {
  id: string;
  join_url: string;
  start_url: string;
  password?: string;
  topic: string;
  start_time: string;
  duration: number;
}

interface ZoomMeetingButtonProps {
  appointmentId: number;
  dermatologistName?: string;
  isPatient?: boolean;
}

const ZoomMeetingButton: React.FC<ZoomMeetingButtonProps> = ({ 
  appointmentId, 
  dermatologistName = 'Dermatologist',
  isPatient = true 
}) => {
  const [meetingData, setMeetingData] = useState<ZoomMeetingData | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const createMeeting = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/zoom/create-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          topic: `Consultation with ${dermatologistName}`,
          start_time: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // 2 minutes from now
          duration: 30
        })
      });

      const data = await response.json();

      if (data.success) {
        setMeetingData(data.data);
        toast.success('Zoom meeting created successfully!');
      } else {
        throw new Error(data.message || 'Failed to create meeting');
      }
    } catch (error) {
      console.error('Error creating Zoom meeting:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create Zoom meeting');
    } finally {
      setIsCreating(false);
    }
  };

  const openMeeting = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <VideoCameraIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Video Consultation</h3>
            <p className="text-xs text-gray-500">
              Start a video call with {dermatologistName}
            </p>
          </div>
        </div>

        {!meetingData ? (
          <button
            onClick={createMeeting}
            disabled={isCreating}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <VideoCameraIcon className="h-4 w-4 mr-2" />
                Start Video Call
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openMeeting(meetingData.join_url)}
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              {isPatient ? 'Join Call' : 'Start Call'}
            </button>
            {meetingData.password && (
              <div className="text-xs text-gray-500">
                Pass: {meetingData.password}
              </div>
            )}
          </div>
        )}
      </div>

      {meetingData && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <p><strong>Meeting ID:</strong> {meetingData.id}</p>
            <p><strong>Topic:</strong> {meetingData.topic}</p>
            <p><strong>Duration:</strong> {meetingData.duration} minutes</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoomMeetingButton;
