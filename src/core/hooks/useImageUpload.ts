/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

type CloudinaryFolder = 'USER' | 'FEED' | 'RECIPE' | 'PROFILE';

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<string | null>;
  uploading: boolean;
  uploadError: string | null;
}

export const useImageUpload = (
  folder: CloudinaryFolder = 'USER'
): UseImageUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) {
      setUploadError('No file selected');
      return null;
    }

    // File size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return null;
    }

    // File type validation
    if (!file.type.startsWith('image/')) {
      setUploadError('File must be an image');
      return null;
    }

    setUploading(true);
    setUploadError(null);

    try {
      console.log(
        `📤 Uploading image to ${folder} folder:`,
        file.name,
        'Size:',
        file.size,
        'Type:',
        file.type
      );

      // Get API URL and token
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (!apiUrl) {
        throw new Error('API URL not configured');
      }

      // Create FormData for multipart upload
      const formData = new FormData();

      // GraphQL operation as per GraphQL multipart request spec
      const operations = JSON.stringify({
        query: `
          mutation UploadSingleFile($file: Upload!, $setting: UploadParamInput!) {
            uploadSingleFile(file: $file, setting: $setting) {
              imageUrl
              isSuccess
            }
          }
        `,
        variables: {
          file: null, // Will be mapped to the file
          setting: {
            uploadService: 'Cloudinary',
            folder: folder, // Use parameter from hook
          },
        },
      });

      // Map variable paths to files as per GraphQL multipart request spec
      const map = JSON.stringify({
        '0': ['variables.file'],
      });

      // Add to FormData
      formData.append('operations', operations);
      formData.append('map', map);
      formData.append('0', file); // The actual file

      // Make the request
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          // Don't set Content-Type - let browser set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
        const errorMessage = result.errors[0].message || 'Upload failed';
        console.error('Upload GraphQL errors:', result.errors);
        setUploadError(errorMessage);
        return null;
      }

      if (
        result.data?.uploadSingleFile?.isSuccess &&
        result.data?.uploadSingleFile?.imageUrl
      ) {
        console.log(
          `✅ Image uploaded successfully to ${folder}:`,
          result.data.uploadSingleFile.imageUrl
        );
        return result.data.uploadSingleFile.imageUrl;
      } else {
        console.error('❌ Upload failed - invalid response:', result.data);
        setUploadError('Upload failed. Please try again.');
        return null;
      }
    } catch (error: any) {
      console.error('Upload error:', error);

      let errorMessage = 'Something went wrong during upload';

      if (error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setUploadError(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading,
    uploadError,
  };
};
