/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'; // Add this line

import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '@/core/components/field/TextField';
import { DatePicker } from '@/core/components/datepicker/DatePicker';
import { format } from 'date-fns';
import SingleFileDropZone from '@/core/components/field/FileDropZone';
import SelectOptionField from '@/core/components/field/SelectOptionField';

// Define the type for the form values
interface FormValues {
  fullname: string;
  email: string;
  password: string;
  gender: string;
  birthdate: Date | null;
  image: string;
  allowFutureDates: boolean; // Default: No future dates allowed
}

const options = [
  { id: 'M', name: 'Pria' },
  { id: 'F', name: 'Wanita' },
];

const EditUserForm = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Formik<FormValues>
      initialValues={{
        fullname: '',
        email: '',
        password: '',
        gender: '',
        birthdate: null,
        image: '',
        allowFutureDates: false, // Default: No future dates allowed
      }}
      validationSchema={Yup.object({
        fullname: Yup.string().required('Fullname is required'),
        email: Yup.string()
          .email('Invalid email address')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
        gender: Yup.string().required('Gender is required'),
        birthdate: Yup.date()
          .required('Birth date is required')
          .max(new Date(), 'Birth date cannot be in the future'),
      })}
      onSubmit={(values) => {
        console.log('Form submitted with:', values);
      }}
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
          <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center font-poppins p-4 md:p-0"
            style={{
              backgroundImage:
                "url('https://thumbs.dreamstime.com/b/well-organized-food-layout-recipe-background-generous-copy-space-adding-recipes-text-329115865.jpg')",
            }}
          >
            <div className="bg-white bg-opacity-90 px-6 py-8 md:px-20 md:py-10 rounded-3xl shadow-md w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-center text-orange-600 mb-4 font-sans-serif mb-12">
                Edit Profile
              </h2>
              <form onSubmit={formik.handleSubmit}>
                <div className="mt-4">
                  <SingleFileDropZone
                    name="image"
                    maxFiles={1}
                    isMultiple={false}
                    maxSize={2 * 1024 * 1024}
                  />
                </div>
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
                    onClick={() => setShowDatePicker(true)}
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

                <SelectOptionField
                  name="gender"
                  label="Gender"
                  isMultiple={false}
                  options={options}
                />

                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex items-center justify-center font-poppins">
                  {' '}
                  <button
                    type="submit"
                    className="w-full max-w-md py-2 bg-orange-500 text-white font-semibold rounded-3xl hover:bg-orange-600 mt-8"
                  >
                    Edit
                  </button>
                </div>
              </form>
              {showDatePicker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <DatePicker
                    selectedDate={formik.values.birthdate}
                    onChange={(date) => {
                      formik.setFieldValue('birthdate', date);
                      setShowDatePicker(false);
                    }}
                    onClose={() => setShowDatePicker(false)}
                    disableFutureDates={true}
                    currentMonth={currentMonth} // Pass currentMonth ke DatePicker
                  />
                </div>
              )}
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default EditUserForm;
