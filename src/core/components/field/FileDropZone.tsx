/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useField } from 'formik';
import React, { useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';

interface SingleFileDropZoneProps {
  name: string;
  maxFiles?: number;
  isMultiple?: boolean;
  maxSize?: number;
  value?: string | File;
}

const SingleFileDropZone: React.FC<SingleFileDropZoneProps> = ({
  name,
  maxFiles,
  isMultiple,
  maxSize,
  value,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [field, meta, helpers] = useField(name);
  const [imageUrl, setImageUrl] = useState<string | null>(value as string);

  const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      if (rejectedFiles[0].errors[0].code === 'file-too-large') {
        setErrorMessage('File size is larger than 2MB');
      }
    }

    if (acceptedFiles.length > 0) {
      setErrorMessage('');
      setImageUrl(URL.createObjectURL(acceptedFiles[0]));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isMultiple
      ? helpers.setValue(acceptedFiles)
      : helpers.setValue(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    multiple: isMultiple,
    maxSize,
  });

  const handleRemoveImage = () => {
    setImageUrl(null);
    helpers.setValue(null);
  };

  if (typeof imageUrl === 'object' && imageUrl !== null) {
    setImageUrl(URL.createObjectURL(imageUrl as Blob));
  }

  return (
    <div className="my-4">
      {imageUrl ? (
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={handleRemoveImage}
            className="mt-2 flex items-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      ) : (
        <>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the file here...</p>
            ) : (
              <p>Drag and drop a file here, or click to select a file</p>
            )}
          </div>
          {(errorMessage || (meta.touched && meta.error)) && (
            <p className="text-red-500 text-sm mt-1">
              {errorMessage || meta.error}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default SingleFileDropZone;
