'use client';

import React from 'react';
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
import { useRouter } from 'next/navigation';
import { FormikHelpers } from 'formik';

interface LoginFormProps {
  isModal?: boolean;
  onClose?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  isModal = false,
  onClose,
  onSwitchToRegister,
}) => {
  const router = useRouter();
  const { error, showError, handleCloseSnackbar } = useSnackbar();
  const { handleLogin, loading } = useHandleLogin(showError);
  const { showPassword, togglePasswordVisibility } = useTogglePassword();

  const onLoginSuccess = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      router.push('/');
    }
  };

  const handleSubmit = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const isLoginSuccessful = await handleLogin(values, actions);
      // Only redirect if login was successful
      if (isLoginSuccessful) {
        onLoginSuccess();
      }
      // If login failed, the error will be shown in the snackbar
    } catch (error) {
      // Error is already handled by useHandleLogin
      console.error('Login failed:', error);
      // Don't redirect on error - let the user see the error message
    }
  };

  // Conditional classes based on whether the form is in a modal or standalone page
  const containerClasses = isModal
    ? 'w-full max-w-md mx-auto pt-14 pb-6 px-6 md:px-8'
    : 'flex items-center justify-center min-h-screen bg-cover bg-center bg-bgcolor font-poppins p-4 md:p-0';

  const formContainerClasses = isModal
    ? 'w-full'
    : 'bg-white bg-opacity-90 px-6 py-8 md:px-20 md:py-10 rounded-3xl shadow-md w-full max-w-2xl';

  return (
    <FormikWrapper<LoginFormValues>
      initialValues={loginInitialValues}
      validationSchema={loginValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {(formik) => (
        <div suppressHydrationWarning className={containerClasses}>
          <div className={formContainerClasses}>
            {/* Title section - centered */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome back!
              </h2>
              <p className="text-gray-600 mt-2">Please sign in to continue</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
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

              <div className="flex items-center justify-between mt-4">
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
                className={`w-full py-3 flex items-center justify-center gap-2 font-semibold rounded-3xl transition-all mt-8
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
                {isModal ? (
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-orange-500 hover:underline font-medium"
                  >
                    Register
                  </button>
                ) : (
                  <a
                    href="/register"
                    className="text-orange-500 hover:underline"
                  >
                    Register
                  </a>
                )}
              </p>
            </form>
          </div>
        </div>
      )}
    </FormikWrapper>
  );
};

export default LoginForm;
