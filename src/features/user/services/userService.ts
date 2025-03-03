import { useMutation } from '@apollo/client';
import { UPDATE_USER } from './mutation';
import { EditUserFormValues } from '../data/editUserSchema';
import { FormikHelpers } from 'formik';
import { convertDateToFormattedDate } from '@/utils/date_time_format';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const useHandleEditUser = (
  id: number | null,
  setError: (error: string) => void,
  router: AppRouterInstance
) => {
  const [userEditMutation, { loading }] = useMutation(UPDATE_USER);

  const handleEditUser = async (
    values: EditUserFormValues,
    actions: FormikHelpers<EditUserFormValues>
  ) => {
    try {
      const formattedDate = convertDateToFormattedDate(
        values.birthdate,
        'YYYY-MM-DD'
      );

      const { data } = await userEditMutation({
        variables: {
          id,
          input: {
            fullname: values.fullname,
            email: values.email,
            username: values.username,
            birthDate: formattedDate,
          },
        },
      });

      if (data) {
        // actions.resetForm();
        router.back();
      }
    } catch (error) {
      setError((error as Error).message || 'Something went wrong.');
    }

    actions.setSubmitting(false);
  };

  return { handleEditUser, loading };
};
