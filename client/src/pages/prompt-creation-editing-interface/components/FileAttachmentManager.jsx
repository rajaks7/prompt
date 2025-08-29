import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const FileAttachmentManager = ({ 
  attachments = [], 
  onAttachmentsChange, 
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['image/*', 'text/*', '.pdf', '.doc', '.docx', '.json', '.csv'],
  className = '' 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray?.filter(file => {
      // Check file size
      if (file?.size > maxFileSize) {
        alert(`File "${file?.name}" is too large. Maximum size is ${formatFileSize(maxFileSize)}.`);
        return false;
      }
      
      // Check file type
      const isValidType = allowedTypes?.some(type => {
        if (type?.includes('*')) {
          return file?.type?.startsWith(type?.replace('*', ''));
        }
        return file?.name?.toLowerCase()?.endsWith(type) || file?.type === type;
      });
      
      if (!isValidType) {
        alert(`File "${file?.name}" is not a supported file type.`);
        return false;
      }
      
      return true;
    });

    // Process valid files
    validFiles?.forEach(file => {
      const fileId = Date.now()?.toString() + Math.random()?.toString(36)?.substr(2, 9);
      
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAttachment = {
          id: fileId,
          name: file?.name,
          size: file?.size,
          type: file?.type,
          url: e?.target?.result,
          uploadedAt: new Date()?.toISOString(),
          isImage: file?.type?.startsWith('image/'),
          isText: file?.type?.startsWith('text/') || file?.name?.endsWith('.json') || file?.name?.endsWith('.csv')
        };
        
        onAttachmentsChange([...attachments, newAttachment]);
        
        // Simulate upload completion
        setTimeout(() => {
          setUploadProgress(prev => {
            const updated = { ...prev };
            delete updated?.[fileId];
            return updated;
          });
        }, 1000);
      };
      
      reader?.readAsDataURL(file);
      
      // Simulate progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
        }
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }, 100);
    });
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = e?.dataTransfer?.files;
    handleFileSelect(files);
  };

  const handleFileInputChange = (e) => {
    handleFileSelect(e?.target?.files);
  };

  const handleRemoveAttachment = (attachmentId) => {
    onAttachmentsChange(attachments?.filter(att => att?.id !== attachmentId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileIcon = (file) => {
    if (file?.isImage) return 'Image';
    if (file?.isText) return 'FileText';
    if (file?.type?.includes('pdf')) return 'FileText';
    if (file?.type?.includes('word') || file?.name?.endsWith('.doc') || file?.name?.endsWith('.docx')) return 'FileText';
    if (file?.type?.includes('json')) return 'Code';
    if (file?.type?.includes('csv')) return 'Table';
    return 'File';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          File Attachments
        </label>
        <Button
          variant="outline"
          size="sm"
          iconName="Upload"
          onClick={() => fileInputRef?.current?.click()}
        >
          Upload Files
        </Button>
      </div>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes?.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />
      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef?.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                   transition-all duration-200 ease-smooth
                   ${isDragOver 
                     ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
                   }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center
                          ${isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            <Icon name="Upload" size={24} />
          </div>
          <div className="text-sm font-medium text-foreground">
            {isDragOver ? 'Drop files here' : 'Drag & drop files or click to browse'}
          </div>
          <div className="text-xs text-muted-foreground">
            Supports images, documents, and text files up to {formatFileSize(maxFileSize)}
          </div>
        </div>
      </div>
      {/* Upload Progress */}
      {Object.keys(uploadProgress)?.length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress)?.map(([fileId, progress]) => (
            <div key={fileId} className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
              <Icon name="Upload" size={16} className="text-primary" />
              <div className="flex-1">
                <div className="w-full bg-border rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
          ))}
        </div>
      )}
      {/* Attachments List */}
      {attachments?.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground">
            Attached Files ({attachments?.length})
          </div>
          <div className="space-y-2">
            {attachments?.map((attachment) => (
              <div
                key={attachment?.id}
                className="flex items-center space-x-3 p-3 bg-card border border-border rounded-lg
                         hover:shadow-sm transition-shadow duration-200"
              >
                {/* File Preview/Icon */}
                <div className="flex-shrink-0">
                  {attachment?.isImage ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={attachment?.url}
                        alt={attachment?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Icon 
                        name={getFileIcon(attachment)} 
                        size={20} 
                        className="text-muted-foreground"
                      />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {attachment?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(attachment?.size)} • Uploaded {new Date(attachment.uploadedAt)?.toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {attachment?.isText && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      title="Preview content"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    title="Download file"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Trash2"
                    onClick={() => handleRemoveAttachment(attachment?.id)}
                    className="text-error hover:text-error"
                    title="Remove file"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* File Guidelines */}
      <div className="p-3 bg-muted rounded-lg border border-border">
        <div className="text-sm font-medium text-foreground mb-2">
          File Guidelines
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Maximum file size: {formatFileSize(maxFileSize)}</div>
          <div>• Supported formats: Images, PDFs, Word docs, text files, JSON, CSV</div>
          <div>• Files are stored locally and included in prompt exports</div>
          <div>• Use attachments for reference materials and examples</div>
        </div>
      </div>
    </div>
  );
};

export default FileAttachmentManager;