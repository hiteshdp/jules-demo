// Generated via prompt: prompts/chat_file_upload_feature_v1.md
import React, { useEffect, useState } from 'react';
import { Button, Image, Typography, Tag, message } from 'antd';
import { 
  FileImageOutlined, 
  FileOutlined,
  DownloadOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface MessageAttachmentProps {
  attachment: {
    path: string;
    type: string;
    originalName?: string;
  };
  messageId: number;
  appointmentId: number;
  isOwnMessage: boolean;
}

const MessageAttachment: React.FC<MessageAttachmentProps> = ({ 
  attachment, 
  messageId, 
  appointmentId, 
  isOwnMessage 
}) => {
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Reset loading/error whenever the image source changes
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
  }, [attachment.path]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileImageOutlined className="text-green-500" />;
      case 'video':
        return <PlayCircleOutlined className="text-purple-500" />;
      default:
        // All other types (document, audio, file, etc.) are treated as documents
        return <FileOutlined className="text-blue-500" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'green';
      case 'video':
        return 'purple';
      default:
        // All other types are treated as documents
        return 'blue';
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('dermatologist_token') || localStorage.getItem('token');
      const response = await fetch(
        `/api/dermatologist/appointments/${appointmentId}/chat/${messageId}/download`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/octet-stream',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.originalName || 'attachment';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      message.error('Failed to download file');
    } finally {
      setLoading(false);
    }
  };

  const getAttachmentUrl = () => {
    // If it's already a full URL, return it as is
    if (attachment.path.startsWith('http')) {
      return attachment.path;
    }
    
    // If it's a storage path, convert to full URL
    if (attachment.path.startsWith('storage/')) {
      return `/${attachment.path}`;
    }
    
    // Otherwise, assume it's a relative path and prepend storage/
    return `/storage/${attachment.path}`;
  };

  const isImage = attachment.type === 'image';

  return (
    <div className={`${isImage ? 'max-w-sm' : 'max-w-xs'} ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}>
      {isImage ? (
        // Image Preview - WhatsApp Style
        <div className="relative group">
          <div className="relative overflow-hidden rounded-2xl shadow-sm border border-gray-200">
            {/* Always render the image; overlay spinner or fallback */}
            <Image
              src={getAttachmentUrl()}
              alt={attachment.originalName || 'Image'}
              className="w-full h-64 object-cover"
              preview={false}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              onLoad={() => {
                setImageError(false);
                setImageLoading(false);
              }}
            />

            {/* Loading overlay */}
            {imageLoading && !imageError && (
              <div className="absolute inset-0 bg-gray-100/70 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <Text className="text-sm text-gray-600">Loading image...</Text>
                </div>
              </div>
            )}

            {/* Error fallback overlay */}
            {imageError && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <FileImageOutlined className="text-4xl text-gray-400 mb-2" />
                  <Text className="text-sm text-gray-500">Image Preview</Text>
                  <Text className="text-xs text-gray-400">Failed to load</Text>
                </div>
              </div>
            )}

            {/* Overlay with action buttons - WhatsApp style */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  type="primary"
                  size="middle"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  loading={loading}
                  className="bg-white/90 text-gray-800 hover:bg-white shadow-lg border-0"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Non-image files - WhatsApp Document Style
        <div>
          {(
            // Document Style - WhatsApp Style
			<div className="flex items-center space-x-3">
			<div className="flex-shrink-0">
				<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
				<div className="text-2xl">
					{getFileIcon(attachment.type)}
				</div>
				</div>
			</div>
			<div className="flex-1 min-w-0">
				<Text className="text-sm font-medium text-gray-900 block truncate">
				{attachment.originalName || 'Document'}
				</Text>
				<div className="flex items-center space-x-2 mt-1">
				<Tag color={getFileTypeColor(attachment.type)} className="text-xs">
					{attachment.type === 'video' ? 'VIDEO' : 'DOCUMENT'}
				</Tag>
				</div>
			</div>
			<Button
				type="text"
				size="large"
				icon={<DownloadOutlined style={{ fontSize: 22 }} />}
				onClick={handleDownload}
				loading={loading}
				className="text-blue-500 hover:text-blue-700 flex-shrink-0"
			/>
			</div>
          )}
        </div>
      )}

    </div>
  );
};

export default MessageAttachment;
