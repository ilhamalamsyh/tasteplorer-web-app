'use client';

import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_FEED_MUTATION } from '@/features/feed/services/mutation';
import Modal from '@/core/components/modal/Modal';
import { HiOutlinePhoto, HiOutlineXMark } from 'react-icons/hi2';
import { MdOutlineRestaurantMenu } from 'react-icons/md';
import useSnackbar from '@/core/hooks/useSnackbar';
import Snackbar from '@/core/components/snackbar/Snackbar';
import { useAuth } from '@/context/AuthContext';
import { useImageUpload } from '@/core/hooks/useImageUpload';

interface FeedFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ImagePreview {
  file: File;
  preview: string;
  position: number;
  uploadedUrl?: string; // URL from Cloudinary after upload
  uploading?: boolean; // Upload status for this image
  error?: string; // Error message if upload failed
}

const FeedForm: React.FC<FeedFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    error: snackbarError,
    showError,
    handleCloseSnackbar,
  } = useSnackbar();

  // Use FEED folder for feed images
  const { uploadImage } = useImageUpload('FEED');

  const [createFeed] = useMutation(CREATE_FEED_MUTATION, {
    onCompleted: () => {
      showSuccess();
      handleClose();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      showError(error.message || 'Failed to create post');
      setIsSubmitting(false);
    },
  });

  const showSuccess = () => {
    // TODO: Implement success snackbar if needed
    console.log('Post created successfully!');
  };

  const handleClose = () => {
    setContent('');
    setImages([]);
    setIsSubmitting(false);
    onClose();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxImages = 4;
    const filesToUpload = Array.from(files).slice(0, maxImages - images.length);

    // Create temporary image previews with uploading state
    const tempImages: ImagePreview[] = filesToUpload
      .filter((file) => file.type.startsWith('image/'))
      .map((file, index) => ({
        file,
        preview: URL.createObjectURL(file),
        position: images.length + index + 1,
        uploading: true,
      }));

    // Add temp images to state
    setImages((prev) => [...prev, ...tempImages]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Upload each image immediately
    tempImages.forEach(async (tempImage, index) => {
      try {
        console.log(`📤 Uploading image ${index + 1}/${tempImages.length}...`);
        const uploadedUrl = await uploadImage(tempImage.file);

        if (uploadedUrl) {
          // Update image with uploaded URL
          setImages((prev) =>
            prev.map((img) =>
              img.file === tempImage.file && img.uploading
                ? { ...img, uploadedUrl, uploading: false }
                : img
            )
          );
          console.log(
            `✅ Image ${index + 1} uploaded successfully:`,
            uploadedUrl
          );
        } else {
          // Mark image as failed
          setImages((prev) =>
            prev.map((img) =>
              img.file === tempImage.file && img.uploading
                ? { ...img, uploading: false, error: 'Upload failed' }
                : img
            )
          );
          console.error(`❌ Image ${index + 1} upload failed`);
        }
      } catch (error) {
        console.error(`❌ Error uploading image ${index + 1}:`, error);
        setImages((prev) =>
          prev.map((img) =>
            img.file === tempImage.file && img.uploading
              ? { ...img, uploading: false, error: 'Upload error' }
              : img
          )
        );
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      // Re-adjust positions
      return newImages.map((img, i) => ({ ...img, position: i + 1 }));
    });
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      showError('Please add some content or images');
      return;
    }

    // Check if any images are still uploading
    const hasUploadingImages = images.some((img) => img.uploading);
    if (hasUploadingImages) {
      showError('Please wait for images to finish uploading');
      return;
    }

    // Check if any images failed to upload
    const hasFailedImages = images.some((img) => img.error);
    if (hasFailedImages) {
      showError(
        'Some images failed to upload. Please remove them and try again.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Use already uploaded URLs
      const imageInputs = images
        .filter((img) => img.uploadedUrl) // Only include successfully uploaded images
        .map((img, index) => ({
          imageUrl: img.uploadedUrl!,
          position: index + 1,
        }));

      console.log('📝 Creating feed with images:', imageInputs);

      // Create feed with uploaded image URLs
      await createFeed({
        variables: {
          input: {
            content: content.trim(),
            recipeId: null, // TODO: Implement recipe attachment
            images: imageInputs.length > 0 ? imageInputs : undefined,
          },
        },
      });
    } catch (error) {
      console.error('Error creating post:', error);
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    (content.trim() || images.length > 0) &&
    !isSubmitting &&
    !images.some((img) => img.uploading);

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.fullname) return '?';
    return user.fullname
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
          </div>

          {/* User Info */}
          <div className="flex items-start gap-3 mb-4">
            {user?.image && user.image.trim() !== '' ? (
              <img
                src={user.image}
                alt={user.fullname}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {getInitials()}
              </div>
            )}

            {/* Content Input */}
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                placeholder="What's happening?"
                className="w-full text-lg border-none outline-none resize-none placeholder-gray-400 min-h-[120px] max-h-[300px]"
                autoFocus
              />

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className={`w-full h-32 object-cover rounded-lg ${
                          image.uploading ? 'opacity-50' : ''
                        }`}
                      />

                      {/* Uploading Spinner */}
                      {image.uploading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-white border-t-primary rounded-full animate-spin" />
                        </div>
                      )}

                      {/* Success Indicator */}
                      {image.uploadedUrl && !image.uploading && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Error Indicator */}
                      {image.error && !image.uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-75">
                          <div className="text-white text-center px-2">
                            <svg
                              className="w-8 h-8 mx-auto mb-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span className="text-xs">{image.error}</span>
                          </div>
                        </div>
                      )}

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                        disabled={image.uploading}
                      >
                        <HiOutlineXMark className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Recipe Attachment Placeholder */}
              <div className="mt-3">
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors cursor-not-allowed opacity-50"
                  disabled
                >
                  <MdOutlineRestaurantMenu className="w-5 h-5" />
                  <span>Attach recipe (Coming soon)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4" />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Image Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                type="button"
                disabled={images.length >= 4}
                title="Add photos"
              >
                <HiOutlinePhoto className="w-6 h-6" />
              </button>

              {images.length > 0 && (
                <span className="text-sm text-gray-500">
                  {images.length}/4 images
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                canSubmit
                  ? 'bg-primary text-white hover:bg-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Posting...
                </span>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </div>
      </Modal>

      <Snackbar
        variant="error"
        message={snackbarError}
        onClose={handleCloseSnackbar}
      />
    </>
  );
};

export default FeedForm;
