import * as Yup from 'yup';

export interface EditUserFormValues {
  fullname: string;
  email: string;
  username: string;
  birthdate: Date | null;
  image: string;
  allowFutureDates: boolean; // Default: No future dates allowed
}

export const editUserInitialValues = {
  fullname: '',
  email: '',
  username: '',
  birthdate: null,
  image: '',
  allowFutureDates: false, // Default: No future dates allowed
};

export const editUserValidationSchema = Yup.object({
  fullname: Yup.string().required('Fullname is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  username: Yup.string()
    .trim()
    .min(8, 'Username must be at least 8 characters')
    .required('Username is required'),
  birthdate: Yup.date()
    .required('Birth date is required')
    .max(new Date(), 'Birth date cannot be in the future'),
});
