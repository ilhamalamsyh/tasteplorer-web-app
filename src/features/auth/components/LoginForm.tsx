/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'; // Add this line

import React, { useState } from 'react';
import TextField from '@/core/components/field/TextField';
import Snackbar from '@/core/components/snackbar/Snackbar';
import FormikWrapper from '@/core/components/form/FormikWrapper';
import {
  LoginFormValues,
  loginInitialValues,
  loginValidationSchema,
} from '../data/authSchema';
import { useHandleLogin } from '../services/authService';
import useTogglePassword from '@/core/hooks/useTogglePassword';
import useSnackbar from '@/core/hooks/useSnackbar';

const LoginForm = () => {
  const { error, showError, handleCloseSnackbar } = useSnackbar();
  const { handleLogin, loading } = useHandleLogin(showError);
  const { showPassword, togglePasswordVisibility } = useTogglePassword();

  return (
    <FormikWrapper<LoginFormValues>
      initialValues={loginInitialValues}
      validationSchema={loginValidationSchema}
      onSubmit={handleLogin}
      enableReinitialize
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
                disabled={loading || formik.isSubmitting}
                type="submit"
                className={`w-full py-2 flex items-center justify-center gap-2 font-semibold rounded-3xl transition-all
                  ${
                    loading || formik.isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }
                `}
              >
                {loading ? 'Logging in...' : 'Login'}
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
    </FormikWrapper>
  );
};

export default LoginForm;
