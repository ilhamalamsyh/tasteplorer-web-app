/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from '@/context/AuthContext';
import { LOGIN_MUTATION, REGISTER_MUTATION } from './mutation';
import { useMutation } from '@apollo/client';
import { LoginFormValues, RegisterFormValues } from '../data/authSchema';
import { FormikHelpers } from 'formik';
import { convertDateToFormattedDate } from '@/utils/date_time_format';
import {
  formatAuthErrorMessage,
  logAuthError,
} from '@/utils/auth-error-handler';

export const useHandleLogin = (setError: (error: string) => void) => {
  const { login } = useAuth();
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    errorPolicy: 'all',
  });

  const handleLogin = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ): Promise<boolean> => {
    try {
      console.log('🔐 Attempting login for user:', values.username);

      const { data, errors } = await loginMutation({
        variables: {
          input: {
            username: values.username.trim(),
            password: values.password,
          },
        },
      });

      // Handle GraphQL response errors
      if (errors && errors.length > 0) {
        const errorMessage = formatAuthErrorMessage(errors[0].message);
        logAuthError('Login GraphQL Error', { graphQLErrors: errors });
        setError(errorMessage);
        return false;
      }

      // Validate successful response
      if (data?.login?.user && data?.login?.token) {
        console.log('✅ Login successful for user:', data.login.user.username);

        // Save authentication data
        login(data.login.user, data.login.token);
        actions.resetForm();

        console.log('💾 User data saved to localStorage');
        return true;
      } else {
        console.error('❌ Invalid response structure:', data);
        setError('Login failed. Please try again.');
        return false;
      }
    } catch (error) {
      // Handle Apollo Client and network errors
      const apolloError = error as any;
      const errorMessage =
        apolloError.graphQLErrors?.length > 0
          ? formatAuthErrorMessage(apolloError.graphQLErrors[0].message)
          : apolloError.networkError
          ? 'Network error. Please check your internet connection and try again.'
          : formatAuthErrorMessage(
              apolloError.message || 'Something went wrong during login'
            );

      logAuthError('Login Exception', apolloError);
      setError(errorMessage);
      return false;
    } finally {
      actions.setSubmitting(false);
    }
  };

  return { handleLogin, loading };
};

export const useHandleRegister = (setError: (error: string) => void) => {
  const { register } = useAuth();
  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION, {
    errorPolicy: 'all',
  });

  const handleRegister = async (
    values: RegisterFormValues,
    actions: FormikHelpers<RegisterFormValues>
  ): Promise<boolean> => {
    try {
      console.log('📝 Attempting registration for user:', values.username);

      const formattedDate = convertDateToFormattedDate(
        values.birthdate,
        'YYYY-MM-DD'
      );

      const { data, errors } = await registerMutation({
        variables: {
          input: {
            fullname: values.fullname.trim(),
            email: values.email.trim(),
            username: values.username.trim(),
            password: values.password,
            birthDate: formattedDate,
          },
        },
      });

      // Handle GraphQL response errors
      if (errors && errors.length > 0) {
        const errorMessage = formatAuthErrorMessage(errors[0].message);
        logAuthError('Registration GraphQL Error', { graphQLErrors: errors });
        setError(errorMessage);
        return false;
      }

      // Validate successful response
      if (data?.register?.user && data?.register?.token) {
        console.log(
          '✅ Registration successful for user:',
          data.register.user.username
        );

        // Save authentication data
        register(data.register.user, data.register.token);
        actions.resetForm();

        console.log('💾 User data saved to localStorage');
        return true;
      } else {
        console.error('❌ Invalid response structure:', data);
        setError('Registration failed. Please try again.');
        return false;
      }
    } catch (error) {
      // Handle Apollo Client and network errors
      const apolloError = error as any;
      const errorMessage =
        apolloError.graphQLErrors?.length > 0
          ? formatAuthErrorMessage(apolloError.graphQLErrors[0].message)
          : apolloError.networkError
          ? 'Network error. Please check your internet connection and try again.'
          : formatAuthErrorMessage(
              apolloError.message || 'Something went wrong during registration'
            );

      logAuthError('Registration Exception', apolloError);
      setError(errorMessage);
      return false;
    } finally {
      actions.setSubmitting(false);
    }
  };

  return { handleRegister, loading };
};
