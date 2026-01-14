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

interface FeedFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ImagePreview {
  file: File;
  preview: string;
  position: number;
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImagePreview[] = [];
    const maxImages = 4;

    Array.from(files).forEach((file) => {
      if (images.length + newImages.length >= maxImages) return;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            file,
            preview: reader.result as string,
            position: images.length + newImages.length + 1,
          });

          if (
            newImages.length ===
            Math.min(files.length, maxImages - images.length)
          ) {
            setImages((prev) => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

    setIsSubmitting(true);

    try {
      // TODO: Upload images to cloud storage and get URLs
      // For now, we'll use placeholder URLs
      const imageUrls = images.map((img, index) => ({
        imageUrl: `https://cdn.example.com/feeds/image${index + 1}.jpg`,
        position: index + 1,
      }));

      await createFeed({
        variables: {
          input: {
            content: content.trim(),
            recipeId: null, // TODO: Implement recipe attachment
            images: imageUrls.length > 0 ? imageUrls : undefined,
          },
        },
      });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const canSubmit = (content.trim() || images.length > 0) && !isSubmitting;

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
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
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
