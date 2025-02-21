/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'; // Add this line

import React, { useState } from 'react';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import TextField from '@/core/components/field/TextField';
import { useAuth } from '@/context/AuthContext';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../services/mutation';
import Snackbar from '@/core/components/snackbar/Snackbar';

// Define the type for the form values
interface FormValues {
  username: string;
  password: string;
}

const LoginForm = () => {
  const { login } = useAuth();
  const [loginMutation, { loading }] = useMutation<{
    login: { user: any; token: string };
  }>(LOGIN_MUTATION);

  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      const { data } = await loginMutation({
        variables: {
          input: { username: values.username, password: values.password },
        },
      });

      if (data) {
        login(data.login.user, data.login.token);
        actions.resetForm();
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong.');
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Formik<FormValues>
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={Yup.object({
        username: Yup.string()
          .trim()
          .required('Username is required or cannot contain whitespace only'),
        password: Yup.string()
          .trim()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required or cannot contain whitespace only'),
      })}
      onSubmit={handleLogin}
    >
      {(formik) => (
        <div
          suppressHydrationWarning
          className="flex items-center justify-center min-h-screen bg-cover bg-center bg-bgcolor font-poppins p-4 md:p-0"
        >
          <div className="bg-white bg-opacity-90 px-6 py-8 md:px-20 md:py-10 rounded-3xl shadow-md w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-center text-orange-600 mb-4 font-sans-serif mb-12">
              Tasteplorer
            </h2>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                name="username"
                type="username"
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
              <div className="flex items-center justify-between mt-3 mb-10">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-orange-500 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-orange-500 text-white font-semibold rounded-3xl hover:bg-orange-600"
              >
                Login
              </button>
              <Snackbar
                variant="error"
                message={error}
                onClose={handleCloseSnackbar}
              />
              <p className="text-sm text-center mt-4">
                Don&apos;t have an account?{' '}
                <a href="/register" className="text-orange-500 hover:underline">
                  Register
                </a>
              </p>
            </form>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default LoginForm;
