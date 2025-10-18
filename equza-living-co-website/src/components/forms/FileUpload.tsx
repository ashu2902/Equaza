'use client';

import { FC, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { FILE_UPLOAD } from '@/lib/utils/constants';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

interface UploadedFileInfo {
  file: File;
  id: string;
  preview?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
}

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  showPreview?: boolean;
  multiple?: boolean;
}

export const FileUpload: FC<FileUploadProps> = ({
  onFilesChange,
  acceptedTypes = FILE_UPLOAD.allowedTypes,
  maxFiles = 5,
  maxSize = FILE_UPLOAD.maxSize,
  className = '',
  disabled = false,
  error,
  hint = 'Upload files by clicking or dragging them here',
  showPreview = true,
  multiple = true,
}) => {
  const [files, setFiles] = useState<UploadedFileInfo[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateFileId = () => Math.random().toString(36).substring(2, 15);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
      }

      if (!acceptedTypes.includes(file.type)) {
        return `File type not supported. Allowed types: ${acceptedTypes.join(', ')}`;
      }

      return null;
    },
    [maxSize, acceptedTypes]
  );

  const createFilePreview = useCallback(
    (file: File): Promise<string | undefined> => {
      return new Promise((resolve) => {
        if (!file.type.startsWith('image/')) {
          resolve(undefined);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      });
    },
    []
  );

  const addFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const remainingSlots = maxFiles - files.length;
      const filesToAdd = multiple
        ? fileArray.slice(0, remainingSlots)
        : fileArray.slice(0, 1);

      if (!multiple) {
        setFiles([]);
      }

      const processedFiles: UploadedFileInfo[] = [];

      for (const file of filesToAdd) {
        const validationError = validateFile(file);
        const preview = showPreview ? await createFilePreview(file) : undefined;

        processedFiles.push({
          file,
          id: generateFileId(),
          preview,
          error: validationError || undefined,
          uploaded: !validationError,
        });
      }

      const updatedFiles = multiple
        ? [...files, ...processedFiles]
        : processedFiles;
      setFiles(updatedFiles);

      // Only include valid files in the callback
      const validFiles = updatedFiles
        .filter((f) => !f.error)
        .map((f) => f.file);

      onFilesChange(validFiles);
    },
    [
      files,
      maxFiles,
      multiple,
      validateFile,
      createFilePreview,
      showPreview,
      onFilesChange,
    ]
  );

  const removeFile = useCallback(
    (fileId: string) => {
      const updatedFiles = files.filter((f) => f.id !== fileId);
      setFiles(updatedFiles);

      const validFiles = updatedFiles
        .filter((f) => !f.error)
        .map((f) => f.file);

      onFilesChange(validFiles);
    },
    [files, onFilesChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        addFiles(selectedFiles);
      }
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [addFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        addFiles(droppedFiles);
      }
    },
    [disabled, addFiles]
  );

  const openFileDialog = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className='w-4 h-4' />;
    }
    return <File className='w-4 h-4' />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canAddMoreFiles = files.length < maxFiles;
  const hasError = Boolean(error) || files.some((f) => f.error);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${
            isDragOver && !disabled
              ? 'border-stone-900 bg-stone-50'
              : hasError
                ? 'border-red-300 bg-red-50'
                : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${!canAddMoreFiles ? 'opacity-60' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type='file'
          onChange={handleFileSelect}
          accept={acceptedTypes.join(',')}
          multiple={multiple}
          disabled={disabled || !canAddMoreFiles}
          className='hidden'
        />

        <motion.div
          animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
          className='space-y-3'
        >
          <div
            className={`
            w-12 h-12 mx-auto rounded-full flex items-center justify-center
            ${hasError ? 'bg-red-100' : 'bg-stone-100'}
          `}
          >
            <Upload
              className={`w-6 h-6 ${hasError ? 'text-red-500' : 'text-stone-600'}`}
            />
          </div>

          <div>
            <Typography
              variant='body1'
              className={`font-medium ${hasError ? 'text-red-700' : 'text-stone-900'}`}
            >
              {isDragOver
                ? 'Drop files here'
                : canAddMoreFiles
                  ? 'Upload Files'
                  : `Maximum ${maxFiles} files allowed`}
            </Typography>

            {hint && canAddMoreFiles && (
              <Typography
                variant='body2'
                className={hasError ? 'text-red-600' : 'text-stone-600'}
              >
                {hint}
              </Typography>
            )}
          </div>

          <div className='text-xs text-stone-500 space-y-1'>
            <div>Max file size: {Math.round(maxSize / 1024 / 1024)}MB</div>
            <div>
              Supported formats:{' '}
              {acceptedTypes.map((type) => type.split('/')[1]).join(', ')}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg'
        >
          <AlertCircle className='w-4 h-4 text-red-500 flex-shrink-0 mt-0.5' />
          <Typography variant='body2' className='text-red-700'>
            {error}
          </Typography>
        </motion.div>
      )}

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='space-y-2'
          >
            <Typography variant='body2' className='font-medium text-stone-900'>
              Uploaded Files ({files.length}/{maxFiles})
            </Typography>

            <div className='space-y-2'>
              {files.map((fileInfo) => (
                <motion.div
                  key={fileInfo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border
                    ${
                      fileInfo.error
                        ? 'border-red-200 bg-red-50'
                        : 'border-stone-200 bg-stone-50'
                    }
                  `}
                >
                  {/* File Preview or Icon */}
                  <div className='flex-shrink-0'>
                    {fileInfo.preview ? (
                      <img
                        src={fileInfo.preview}
                        alt={fileInfo.file.name}
                        className='w-10 h-10 object-cover rounded'
                      />
                    ) : (
                      <div className='w-10 h-10 bg-stone-200 rounded flex items-center justify-center'>
                        {getFileIcon(fileInfo.file)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className='flex-1 min-w-0'>
                    <Typography
                      variant='body2'
                      className={`font-medium truncate ${
                        fileInfo.error ? 'text-red-700' : 'text-stone-900'
                      }`}
                    >
                      {fileInfo.file.name}
                    </Typography>
                    <div className='flex items-center gap-2 text-xs'>
                      <span
                        className={
                          fileInfo.error ? 'text-red-600' : 'text-stone-500'
                        }
                      >
                        {formatFileSize(fileInfo.file.size)}
                      </span>
                      {fileInfo.uploaded && !fileInfo.error && (
                        <div className='flex items-center gap-1 text-green-600'>
                          <CheckCircle className='w-3 h-3' />
                          <span>Uploaded</span>
                        </div>
                      )}
                      {fileInfo.error && (
                        <div className='flex items-center gap-1 text-red-600'>
                          <AlertCircle className='w-3 h-3' />
                          <span>{fileInfo.error}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(fileInfo.id);
                    }}
                    className='h-8 w-8 p-0 flex-shrink-0'
                    aria-label={`Remove ${fileInfo.file.name}`}
                  >
                    <X className='w-4 h-4' />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

FileUpload.displayName = 'FileUpload';
