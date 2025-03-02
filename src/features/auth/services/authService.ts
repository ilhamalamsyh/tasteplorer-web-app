import { useAuth } from '@/context/AuthContext';
import { LOGIN_MUTATION, REGISTER_MUTATION } from './mutation';
import { useMutation } from '@apollo/client';
import { LoginFormValues, RegisterFormValues } from '../data/authSchema';
import { FormikHelpers } from 'formik';
import { convertDateToFormattedDate } from '@/utils/date_time_format';

export const useHandleLogin = (setError: (error: string) => void) => {
  const { login } = useAuth();
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
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
    } catch (error) {
      setError((error as Error).message || 'Something went wrong.');
    }
  };

  return { handleLogin, loading };
};

export const useHandleRegister = (setError: (error: string) => void) => {
  const { register } = useAuth();
  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION);

  const handleRegister = async (
    values: RegisterFormValues,
    actions: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      const formattedDate = convertDateToFormattedDate(
        values.birthdate,
        'YYYY-MM-DD'
      );

      const { data } = await registerMutation({
        variables: {
          input: {
            fullname: values.fullname,
            email: values.email,
            username: values.username,
            password: values.password,
            birthDate: formattedDate,
          },
        },
      });

      if (data) {
        register(data.register.user, data.register.token);
        actions.resetForm();
      }
    } catch (error) {
      setError((error as Error).message || 'Something went wrong.');
    }
  };

  return { handleRegister, loading };
};
