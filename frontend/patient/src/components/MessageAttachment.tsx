// Generated via prompt: prompts/chat_file_upload_feature_v1.md
import React, { useState } from 'react';
import { Button, Image, Modal, Typography, Space, Tag, message } from 'antd';
import { 
  FileImageOutlined, 
  FilePdfOutlined, 
  FileOutlined,
  DownloadOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  AudioOutlined
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
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileImageOutlined className="text-green-500" />;
      case 'document':
        return <FilePdfOutlined className="text-red-500" />;
      case 'video':
        return <PlayCircleOutlined className="text-purple-500" />;
      case 'audio':
        return <AudioOutlined className="text-orange-500" />;
      default:
        return <FileOutlined className="text-gray-500" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'green';
      case 'document':
        return 'red';
      case 'video':
        return 'purple';
      case 'audio':
        return 'orange';
      default:
        return 'default';
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/patient/appointments/${appointmentId}/chat/${messageId}/download`,
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
    return `/storage/${attachment.path}`;
  };

  const isImage = attachment.type === 'image';
  const isVideo = attachment.type === 'video';
  const isAudio = attachment.type === 'audio';

  return (
    <div className={`${isImage ? 'max-w-sm' : 'max-w-xs'} ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}>
      {isImage ? (
        // Image Preview - WhatsApp Style
        <div className="relative group">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={getAttachmentUrl()}
              alt={attachment.originalName || 'Image'}
              className="w-full h-64 object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
              onClick={() => setPreviewVisible(true)}
              preview={false}
            />
            {/* Overlay with action buttons */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-3">
                <Button
                  type="primary"
                  size="middle"
                  icon={<EyeOutlined />}
                  onClick={() => setPreviewVisible(true)}
                  className="bg-white text-gray-800 hover:bg-gray-100 shadow-lg"
                />
                <Button
                  type="primary"
                  size="middle"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  loading={loading}
                  className="bg-white text-gray-800 hover:bg-gray-100 shadow-lg"
                />
              </div>
            </div>
            {/* Image type indicator */}
            <div className="absolute top-2 right-2">
              <Tag color="green" className="text-xs font-medium">
                IMAGE
              </Tag>
            </div>
          </div>
          {/* Image filename below */}
          <div className="mt-2 px-1">
            <Text className="text-xs text-gray-600 truncate block font-medium">
              {attachment.originalName || 'Image'}
            </Text>
          </div>
        </div>
      ) : (
        // Non-image files - Document Style
        <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm ${
          isOwnMessage ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
        }`}>
          {/* File Header */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-lg">
                  {getFileIcon(attachment.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <Text className="text-sm font-medium text-gray-900 block truncate">
                    {attachment.originalName || 'Attachment'}
                  </Text>
                  <Tag color={getFileTypeColor(attachment.type)} className="text-xs">
                    {attachment.type.toUpperCase()}
                  </Tag>
                </div>
              </div>
              <Space>
                <Button
                  type="text"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  loading={loading}
                  className="text-green-500 hover:text-green-700"
                />
              </Space>
            </div>
          </div>

          {/* File Content */}
          <div className="p-2">
            {isVideo && (
              <div className="relative">
                <video
                  src={getAttachmentUrl()}
                  className="w-full h-32 object-cover rounded"
                  controls
                  preload="metadata"
                />
              </div>
            )}

            {isAudio && (
              <div className="p-4">
                <audio
                  src={getAttachmentUrl()}
                  controls
                  className="w-full"
                  preload="metadata"
                />
              </div>
            )}

            {!isVideo && !isAudio && (
              <div className="p-4 text-center">
                <div className="text-4xl mb-2">
                  {getFileIcon(attachment.type)}
                </div>
                <Text className="text-gray-500 text-sm">
                  Click download to view file
                </Text>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {isImage && (
        <Modal
          title="Image Preview"
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={[
            <Button key="download" icon={<DownloadOutlined />} onClick={handleDownload} loading={loading}>
              Download
            </Button>
          ]}
          width={800}
        >
          <Image
            src={getAttachmentUrl()}
            alt={attachment.originalName || 'Image'}
            style={{ width: '100%' }}
          />
        </Modal>
      )}
    </div>
  );
};

export default MessageAttachment;
