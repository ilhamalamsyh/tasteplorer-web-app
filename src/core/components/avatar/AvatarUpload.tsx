import React, { useState, useRef } from 'react';
import { useImageUpload } from '@/core/hooks/useImageUpload';
import Image from 'next/image';

interface AvatarUploadProps {
  onImageUpload: (imageUrl: string | null) => void;
  onUploadError: (error: string) => void;
  initialImageUrl?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  onImageUpload,
  onUploadError,
  initialImageUrl,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImageUrl || null
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading, uploadError } = useImageUpload();

  // Sync previewUrl with initialImageUrl if it changes (for async API data)
  React.useEffect(() => {
    setPreviewUrl(initialImageUrl || null);
  }, [initialImageUrl]);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Show preview immediately
    const filePreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(filePreviewUrl);

    try {
      // Upload file
      const uploadedImageUrl = await uploadImage(file);

      if (uploadedImageUrl) {
        onImageUpload(uploadedImageUrl);
        // Clean up old preview URL and set new one
        URL.revokeObjectURL(filePreviewUrl);
        setPreviewUrl(uploadedImageUrl);
      } else {
        // Revert preview on upload failure
        setPreviewUrl(initialImageUrl || null);
        onImageUpload(null);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setPreviewUrl(initialImageUrl || null);
      onImageUpload(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Show upload error via callback
  React.useEffect(() => {
    if (uploadError) {
      onUploadError(uploadError);
    }
  }, [uploadError, onUploadError]);

  return (
    <div className="flex flex-col items-center mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Picture (Optional)
      </label>

      <div
        className={`relative w-32 h-32 rounded-full border-2 border-dashed cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 hover:border-primary'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!uploading ? handleClick : undefined}
      >
        {previewUrl ? (
          <>
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src={previewUrl}
                alt="Avatar preview"
                fill
                className="object-cover"
                sizes="128px"
                unoptimized
              />
            </div>
            {!uploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10"
              >
                ✕
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <svg
              className="w-8 h-8 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="text-xs text-center">
              {isDragOver ? 'Drop image here' : 'Click or drag image'}
            </span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={uploading}
      />

      <p className="text-xs text-gray-500 text-center mt-2">
        Max 5MB • JPG, PNG, GIF
      </p>
    </div>
  );
};

export default AvatarUpload;
