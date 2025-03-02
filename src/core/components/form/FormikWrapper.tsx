import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import React from 'react';

interface FormikWrapperProps<T extends FormikValues> {
  initialValues: T;
  validationSchema: unknown;
  onSubmit: (values: T, actions: FormikHelpers<T>) => void | Promise<void>;
  children: (formik: FormikProps<T>) => React.ReactNode;
}

const FormikWrapper = <T extends FormikValues>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: FormikWrapperProps<T>) => {
  return (
    <Formik<T>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => onSubmit(values as T, actions)}
    >
      {(formik) => children(formik)}
    </Formik>
  );
};

export default FormikWrapper;
