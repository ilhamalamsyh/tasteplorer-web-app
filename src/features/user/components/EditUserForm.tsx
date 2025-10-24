/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'; // Add this line

import React, { useState, useEffect } from 'react';
import TextField from '@/core/components/field/TextField';
import { DatePicker } from '@/core/components/datepicker/DatePicker';
import { format } from 'date-fns';
import SingleFileDropZone from '@/core/components/field/FileDropZone';
import useDatePicker from '@/core/hooks/useDatePicker';
import {
  EditUserFormValues,
  editUserInitialValues,
  editUserValidationSchema,
} from '../data/editUserSchema';
import FormikWrapper from '@/core/components/form/FormikWrapper';
import useSnackbar from '@/core/hooks/useSnackbar';
import { useHandleEditUser } from '../services/userService';
import { decodeJWT } from '@/utils/jwt/jwt_util';
import { useQuery } from '@apollo/client';
import { CURRENT_USER } from '../services/query';
import { useRouter } from 'next/navigation';
import Snackbar from '@/core/components/snackbar/Snackbar';
import AvatarUpload from '@/core/components/avatar/AvatarUpload';

// Define the type for the form values

const EditUserForm = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const { error, showError, handleCloseSnackbar } = useSnackbar();
  const { data, loading, error: queryError } = useQuery(CURRENT_USER);
  const { handleEditUser } = useHandleEditUser(userId, showError, router);
  const { showDatePicker, openDatePicker, closeDatePicker } = useDatePicker();

  const [initialValues, setInitialValues] = useState<EditUserFormValues>(
    editUserInitialValues
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const decoded = decodeJWT(token);
      setUserId(decoded?.sub ? parseInt(decoded.sub, 10) : null);
    }

    console.log('currentUserData: ', data?.currentUser?.image);

    if (data?.currentUser) {
      setInitialValues((prev) => ({
        ...prev,
        fullname: data.currentUser.fullname || prev.fullname,
        username: data.currentUser.username || prev.username,
        email: data.currentUser.email || prev.email,
        birthdate: data.currentUser.birthDate
          ? new Date(data.currentUser.birthDate)
          : prev.birthdate,
        image: data.currentUser.image || prev.image,
      }));
    }
  }, [data]);

  // Handle token expired error
  useEffect(() => {
    if (queryError) {
      const errorMessage = queryError.message.toLowerCase();
      if (
        errorMessage.includes('token') &&
        (errorMessage.includes('expired') ||
          errorMessage.includes('invalid') ||
          errorMessage.includes('unauthorized'))
      ) {
        // Remove token and user from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Show snackbar message
        showError('Token expired. Please login again.');

        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/');
        }, 2000);

        return;
      }
    }
  }, [queryError, showError, router]);

  if (loading) return <p>Loading...</p>;
  if (queryError && !queryError.message.toLowerCase().includes('token'))
    return <p>Error...</p>;

  return (
    <FormikWrapper<EditUserFormValues>
      initialValues={initialValues}
      validationSchema={editUserValidationSchema}
      onSubmit={handleEditUser}
      enableReinitialize
    >
      {(formik) => {
        // Manage the current month based on the selected date
        const [currentMonth, setCurrentMonth] = useState(new Date());

        useEffect(() => {
          // Set the current month based on the selected birthdate
          if (formik.values.birthdate) {
            setCurrentMonth(formik.values.birthdate); // Update with selected date's month
          }
        }, [formik.values.birthdate]);

        return (
          <div className="flex items-center justify-center min-h-screen bg-cover bg-center font-poppins p-4 md:p-0">
            <div className="bg-white bg-opacity-90 px-6 py-8 md:px-20 md:py-10 rounded-3xl shadow-md w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-center text-orange-600 mb-4 font-sans-serif mb-12">
                Edit Profile
              </h2>
              <form onSubmit={formik.handleSubmit}>
                <AvatarUpload
                  onImageUpload={(imageUrl) => {
                    formik.setFieldValue('image', imageUrl);
                  }}
                  onUploadError={(error) => {
                    showError(error);
                  }}
                  initialImageUrl={formik.values.image}
                />
                <TextField
                  name="fullname"
                  type="text"
                  formik={formik}
                  placeholder="Enter your fullname"
                  label="Fullname"
                />
                <TextField
                  name="email"
                  type="email"
                  formik={formik}
                  placeholder="Enter your email"
                  label="Email"
                />
                <TextField
                  name="username"
                  type="text"
                  formik={formik}
                  placeholder="Enter your username"
                  label="Username"
                />
                {/* Using MaterialDatePicker */}
                <div className="mt-4">
                  <label
                    htmlFor="birthdate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Birth Date
                  </label>
                  <button
                    type="button"
                    onClick={openDatePicker}
                    className="mt-1 w-full flex items-center justify-between rounded-lg border border-gray-300 px-3 py-2 text-left"
                  >
                    {formik.values.birthdate
                      ? format(formik.values.birthdate, 'MMMM d, yyyy')
                      : 'Select date'}
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
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                      />
                    </svg>
                  </button>
                  {formik.touched.birthdate && formik.errors.birthdate && (
                    <div className="text-red-600 text-sm mt-1">
                      {formik.errors.birthdate}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center font-poppins">
                  <button
                    type="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                    className={`w-full max-w-md py-2 ${
                      !formik.isValid || formik.isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600'
                    } text-white font-semibold rounded-3xl mt-8`}
                  >
                    {formik.isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
              {showDatePicker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <DatePicker
                    selectedDate={formik.values.birthdate}
                    onChange={(date) => {
                      formik.setFieldValue('birthdate', date);
                      closeDatePicker();
                    }}
                    onClose={closeDatePicker}
                    disableFutureDates={true}
                    currentMonth={currentMonth} // Pass currentMonth ke DatePicker
                  />
                </div>
              )}
            </div>

            {/* Snackbar for error messages */}
            <Snackbar
              variant="error"
              message={error}
              onClose={handleCloseSnackbar}
            />
          </div>
        );
      }}
    </FormikWrapper>
  );
};

export default EditUserForm;
