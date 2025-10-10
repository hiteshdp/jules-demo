// Generated via prompt: prompts/chat_file_upload_feature_v1.md
import React, { useRef, useState } from 'react';
import { Button, message, Modal, Image, Typography, Space } from 'antd';
import { 
  PaperClipOutlined, 
  FileImageOutlined, 
  FilePdfOutlined, 
  FileTextOutlined, 
  FileOutlined,
  EyeOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FileImageOutlined className="text-green-500" />;
    if (type === 'application/pdf') return <FilePdfOutlined className="text-red-500" />;
    if (type.startsWith('text/')) return <FileTextOutlined className="text-blue-500" />;
    return <FileOutlined className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = file.type.startsWith('image/');

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="text-2xl">
            {getFileIcon(file.type)}
          </div>
          <div className="flex-1 min-w-0">
            <Text className="text-sm font-medium text-gray-900 block truncate">
              {file.name}
            </Text>
            <Text className="text-xs text-gray-500">
              {formatFileSize(file.size)}
            </Text>
          </div>
        </div>
        <Space>
          {isImage && (
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => setPreviewVisible(true)}
              className="text-blue-500 hover:text-blue-700"
            />
          )}
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
          />
        </Space>
      </div>

      {isImage && (
        <Modal
          title="Image Preview"
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={null}
          width={600}
        >
          <Image
            src={URL.createObjectURL(file)}
            alt={file.name}
            style={{ width: '100%' }}
          />
        </Modal>
      )}
    </div>
  );
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled = false }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        message.error('File size must be less than 10MB');
        return;
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'video/mp4', 'video/avi', 'video/mov',
        'audio/mp3', 'audio/wav', 'audio/ogg',
        'application/zip', 'application/x-rar-compressed'
      ];

      if (!allowedTypes.includes(file.type)) {
        message.error('File type not supported');
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,video/mp4,video/avi,video/mov,audio/mp3,audio/wav,audio/ogg,application/zip,application/x-rar-compressed"
        style={{ display: 'none' }}
      />
      
      {selectedFile ? (
        <FilePreview file={selectedFile} onRemove={handleRemoveFile} />
      ) : (
        <Button
          type="text"
          icon={<PaperClipOutlined />}
          onClick={handleUploadClick}
          disabled={disabled}
          className="w-full h-10 border border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center"
        >
          <span className="text-gray-600">Attach file</span>
        </Button>
      )}
    </div>
  );
};

export default FileUpload;
