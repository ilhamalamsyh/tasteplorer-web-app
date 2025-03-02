/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'; // Add this line

import React, { useState, useEffect } from 'react';
import TextField from '@/core/components/field/TextField';
import { DatePicker } from '@/core/components/datepicker/DatePicker';
import { format } from 'date-fns';
import Snackbar from '@/core/components/snackbar/Snackbar';
import {
  RegisterFormValues,
  registerInitialValues,
  registerValidationSchema,
} from '../data/authSchema';
import { useHandleRegister } from '../services/authService';
import useTogglePassword from '@/core/hooks/useTogglePassword';
import FormikWrapper from '@/core/components/form/FormikWrapper';
import useDatePicker from '@/core/hooks/useDatePicker';

// Define the type for the form values

const RegisterForm = () => {
  const [error, setError] = useState<string>('');
  const { handleRegister, loading } = useHandleRegister(setError);
  const { showPassword, togglePasswordVisibility } = useTogglePassword();
  const { showDatePicker, openDatePicker, closeDatePicker } = useDatePicker();

  const handleCloseSnackbar = () => {
    setError('');
  };

  return (
    <FormikWrapper<RegisterFormValues>
      initialValues={registerInitialValues}
      validationSchema={registerValidationSchema}
      onSubmit={handleRegister}
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
          <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-bgcolor font-poppins p-4 md:p-0">
            <div className="bg-white bg-opacity-90 px-6 py-8 md:px-20 md:py-10 rounded-3xl shadow-md w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-center text-orange-600 mb-4 font-sans-serif mb-12">
                Welcome to Tasteplorer
              </h2>
              <form onSubmit={formik.handleSubmit}>
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
                <TextField
                  name="password"
                  type="password"
                  formik={formik}
                  placeholder="Enter your password"
                  label="Password"
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
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
                  {' '}
                  <button
                    type="submit"
                    className="w-full max-w-md py-2 bg-orange-500 text-white font-semibold rounded-3xl hover:bg-orange-600 mt-8"
                  >
                    Register
                  </button>
                  <Snackbar
                    variant="error"
                    message={error}
                    onClose={handleCloseSnackbar}
                  />
                </div>

                <p className="text-sm text-center mt-4">
                  Already have an account?{' '}
                  <a href="/login" className="text-orange-500 hover:underline">
                    Log In
                  </a>
                </p>
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
          </div>
        );
      }}
    </FormikWrapper>
  );
};

export default RegisterForm;
