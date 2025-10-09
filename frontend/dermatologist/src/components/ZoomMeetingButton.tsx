// Generated via prompt: prompts/zoom_video_call_integration_v1.md
import React, { useState, useEffect } from 'react';
import { VideoCameraIcon, PlayIcon, UserIcon, ClockIcon, ShareIcon, ClipboardIcon, StopIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import apiClient from '../store/api/apiClient';

interface ZoomMeetingData {
  id: string;
  meeting_id: string;
  join_url: string;
  start_url: string;
  password?: string;
  topic: string;
  start_time: string;
  duration: number;
  status: 'created' | 'started' | 'ended';
  started_at?: string;
  ended_at?: string;
}

interface ZoomMeetingButtonProps {
  appointmentId?: number;
  patientName?: string;
  isPatient?: boolean;
}

const ZoomMeetingButton: React.FC<ZoomMeetingButtonProps> = ({ 
  appointmentId,
  patientName = 'Patient',
//   isPatient = false 
}) => {
  const [meetingData, setMeetingData] = useState<ZoomMeetingData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [status, setStatus] = useState<'not_created' | 'created' | 'started' | 'ended'>('not_created');

  // Check meeting status
  useEffect(() => {
    if (!appointmentId) return;

    const checkMeetingStatus = async () => {
      try {
        const response = await apiClient.get(`/zoom-meetings/status/${appointmentId}`);
        const data = response.data;

        if (data.success) {
          setStatus(data.data.status);
          
          if (data.data.meeting) {
            setMeetingData(data.data.meeting);
          } else {
            setMeetingData(null);
          }
        }
      } catch (error) {
        console.error('Error checking meeting status:', error);
      }
    };

    checkMeetingStatus();
  }, [appointmentId]);

  const createMeeting = async () => {
    if (!appointmentId) {
      toast.error('Please select an appointment first');
      return;
    }

    setIsCreating(true);
    try {
      const response = await apiClient.post('/zoom-meetings', {
        appointment_id: appointmentId,
        topic: `Consultation with ${patientName}`,
        start_time: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // 2 minutes from now
        duration: 30
      });

      const data = response.data;

      if (data.success) {
        setMeetingData(data.data);
        setStatus('created');
        toast.success('Zoom meeting created successfully!');
      } else {
        throw new Error(data.message || 'Failed to create meeting');
      }
    } catch (error: any) {
      console.error('Error creating Zoom meeting:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create Zoom meeting';
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const startMeeting = async () => {
    if (!meetingData?.id) return;
    
    setIsStarting(true);
    try {
      // Mark meeting as started in database
      const response = await apiClient.post(`/zoom-meetings/${meetingData.id}/start`);
      const data = response.data;

      if (data.success) {
        setStatus('started');
        toast.success('Meeting started successfully!');
        
        // Open Zoom meeting
        window.open(meetingData.start_url, '_blank', 'noopener,noreferrer');
      } else {
        throw new Error(data.message || 'Failed to start meeting');
      }
    } catch (error: any) {
      console.error('Error starting meeting:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to start meeting';
      toast.error(errorMessage);
    } finally {
      setIsStarting(false);
    }
  };

  const endMeeting = async () => {
    if (!meetingData?.id) return;
    
    setIsEnding(true);
    try {
      const response = await apiClient.post(`/zoom-meetings/${meetingData.id}/end`);
      const data = response.data;

      if (data.success) {
        setStatus('ended');
        setMeetingData(null);
        toast.success('Meeting ended successfully!');
      } else {
        throw new Error(data.message || 'Failed to end meeting');
      }
    } catch (error: any) {
      console.error('Error ending meeting:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to end meeting';
      toast.error(errorMessage);
    } finally {
      setIsEnding(false);
    }
  };

  const copyJoinLink = () => {
    if (!meetingData?.join_url) return;
    
    navigator.clipboard.writeText(meetingData.join_url).then(() => {
      toast.success('Join link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const getStatusMessage = () => {
    if (!appointmentId) {
      return 'Please select an appointment to start a video call';
    }
    
    switch (status) {
      case 'not_created':
        return `Create and start a video call with ${patientName}`;
      case 'created':
        return `Meeting created - ready to start the call with ${patientName}`;
      case 'started':
        return `Call is active - you are hosting the meeting`;
      case 'ended':
        return `Call has ended - create a new meeting if needed`;
      default:
        return `Create and start a video call with ${patientName}`;
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <VideoCameraIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Video Consultation</h3>
            <p className="text-sm text-gray-600">
              {getStatusMessage()}
            </p>
          </div>
        </div>

        {!appointmentId ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="text-sm font-medium">Select an appointment first</span>
          </div>
        ) : status === 'not_created' ? (
          <button
            onClick={createMeeting}
            disabled={isCreating}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Creating...
              </>
            ) : (
              <>
                <VideoCameraIcon className="h-5 w-5 mr-3" />
                Create Meeting
              </>
            )}
          </button>
        ) : status === 'created' ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={startMeeting}
              disabled={isStarting}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isStarting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Starting...
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Start Call
                </>
              )}
            </button>
            <button
              onClick={copyJoinLink}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Share Link
            </button>
          </div>
        ) : status === 'started' ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={copyJoinLink}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Share Link
            </button>
            <button
              onClick={endMeeting}
              disabled={isEnding}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isEnding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Ending...
                </>
              ) : (
                <>
                  <StopIcon className="h-4 w-4 mr-2" />
                  End Call
                </>
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={createMeeting}
            disabled={isCreating}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Creating...
              </>
            ) : (
              <>
                <VideoCameraIcon className="h-5 w-5 mr-3" />
                Create New Meeting
              </>
            )}
          </button>
        )}
      </div>

      {meetingData && status !== 'ended' && (
        <div className="mt-4 pt-4 border-t border-indigo-200">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4 text-indigo-500" />
                <span className="text-gray-600">Meeting ID:</span>
                <span className="font-mono text-gray-900">{meetingData.id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4 text-indigo-500" />
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-gray-900">{meetingData.duration} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <VideoCameraIcon className="h-4 w-4 text-indigo-500" />
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${status === 'started' ? 'text-green-600' : 'text-blue-600'}`}>
                  {status === 'started' ? 'Call Active' : 'Ready to start'}
                </span>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-900">Patient Join Link</h4>
                <button
                  onClick={copyJoinLink}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-xs font-medium"
                >
                  <ClipboardIcon className="h-3 w-3 mr-1" />
                  Copy
                </button>
              </div>
              <p className="text-xs text-blue-700 break-all bg-white p-2 rounded border">
                {meetingData.join_url}
              </p>
              {meetingData.password && (
                <p className="text-xs text-blue-600 mt-2">
                  <strong>Meeting Password:</strong> {meetingData.password}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoomMeetingButton;