import * as Yup from 'yup';

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface RegisterFormValues {
  fullname: string;
  email: string;
  username: string;
  password: string;
  birthdate: Date | null;
  allowFutureDates: boolean; // Default: No future dates allowed
  image?: string; // Optional field for profile image URL
}

export const loginInitialValues: LoginFormValues = {
  username: '',
  password: '',
};

export const registerInitialValues: RegisterFormValues = {
  fullname: '',
  email: '',
  username: '',
  password: '',
  birthdate: null,
  allowFutureDates: false, // Default: No future dates allowed
};

export const loginValidationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .required('Username is required or cannot contain whitespace only'),
  password: Yup.string()
    .trim()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required or cannot contain whitespace only'),
});

export const registerValidationSchema = Yup.object({
  fullname: Yup.string().required('Fullname is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  username: Yup.string()
    .trim()
    .min(8, 'Username must be at least 8 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(10, 'Password must be at least 10 characters')
    .required('Password is required'),
  birthdate: Yup.date()
    .required('Birth date is required')
    .max(new Date(), 'Birth date cannot be in the future'),
});
