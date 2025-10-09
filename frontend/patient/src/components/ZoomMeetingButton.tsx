// Generated via prompt: prompts/zoom_video_call_integration_v1.md
import React, { useState, useEffect } from 'react';
import { VideoCameraIcon, PlayIcon, ClockIcon, UserIcon, KeyIcon, ClipboardIcon } from '@heroicons/react/24/outline';
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
  dermatologistName?: string;
  isPatient?: boolean;
}

const ZoomMeetingButton: React.FC<ZoomMeetingButtonProps> = ({ 
  appointmentId,
  dermatologistName = 'Dermatologist',
//   isPatient = true 
}) => {
  const [meetingData, setMeetingData] = useState<ZoomMeetingData | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [status, setStatus] = useState<'not_created' | 'created' | 'started' | 'ended'>('not_created');

  // Check meeting status in real-time
  useEffect(() => {
    if (!appointmentId) return;

    const checkMeetingStatus = async () => {
      try {
        const response = await apiClient.get(`/zoom-meetings/status/${appointmentId}`);
        const data = response.data;

        if (data.success) {
          setStatus(data.data.status);
          
          if (data.data.status === 'started' && data.data.meeting) {
            setMeetingData(data.data.meeting);
          } else if (data.data.status === 'ended') {
            setMeetingData(null);
            setStatus('not_created');
          } else if (data.data.status === 'created') {
            setStatus('created');
          } else {
            setStatus('not_created');
          }
        }
      } catch (error) {
        console.error('Error checking meeting status:', error);
      }
    };

    // Check immediately
    checkMeetingStatus();

    // Set up polling every 3 seconds
    const interval = setInterval(checkMeetingStatus, 3000);

    return () => clearInterval(interval);
  }, [appointmentId]);

  const joinMeeting = () => {
    if (!meetingData?.join_url) return;
    
    setIsJoining(true);
    try {
      window.open(meetingData.join_url, '_blank', 'noopener,noreferrer');
      toast.success('Joining video call...');
    } catch (error) {
      toast.error('Failed to open video call');
    } finally {
      setIsJoining(false);
    }
  };

  const copyPassword = () => {
    if (!meetingData?.password) return;
    
    navigator.clipboard.writeText(meetingData.password).then(() => {
      toast.success('Password copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy password');
    });
  };

  const getStatusMessage = () => {
    if (!appointmentId) {
      return 'Please select an appointment to join video calls';
    }
    
    switch (status) {
      case 'not_created':
        return 'Waiting for dermatologist to start the meeting...';
      case 'created':
        return 'Meeting created - waiting for dermatologist to start the call...';
      case 'started':
        return `Ready to join call with ${dermatologistName}`;
      case 'ended':
        return 'Call has ended';
      default:
        return 'Waiting for dermatologist to start the call...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'started':
        return 'text-green-600';
      case 'ended':
        return 'text-red-600';
      default:
        return 'text-amber-600';
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
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
        ) : status === 'started' && meetingData ? (
          <button
            onClick={joinMeeting}
            disabled={isJoining}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isJoining ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Joining...
              </>
            ) : (
              <>
                <PlayIcon className="h-5 w-5 mr-3" />
                Join Video Call
              </>
            )}
          </button>
        ) : status !== 'ended' ? (
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
              <ClockIcon className="h-5 w-5 animate-pulse" />
              <span className="text-sm font-medium">
                {status === 'created' ? 'Meeting Created' : 'Waiting...'}
              </span>
            </div>
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-red-600">
            <span className="text-sm font-medium">Call Ended</span>
          </div>
        )}
      </div>

      {meetingData && status === 'started' && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600">Meeting ID:</span>
                <span className="font-mono text-gray-900">{meetingData.meeting_id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-gray-900">{meetingData.duration} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <VideoCameraIcon className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Ready to join</span>
              </div>
            </div>
            
            {meetingData.password && (
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-green-700">
                    <KeyIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Meeting Password:</span>
                    <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                      {meetingData.password}
                    </span>
                  </div>
                  <button
                    onClick={copyPassword}
                    className="inline-flex items-center text-green-600 hover:text-green-700 text-xs font-medium transition-colors"
                  >
                    <ClipboardIcon className="h-3 w-3 mr-1" />
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoomMeetingButton;
