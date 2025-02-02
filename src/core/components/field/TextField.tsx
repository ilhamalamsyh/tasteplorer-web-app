import React, { useState } from 'react';
import TogglePasswordIconButton from '@/core/components/button/TogglePasswordIconButton';

interface TextFieldProps {
  name: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any; // Accept Formik object to handle values, errors, touched, etc.
  placeholder?: string;
  label: string;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
}

const TextField: React.FC<TextFieldProps> = ({
  name,
  type,
  formik,
  placeholder,
  label,
  showPassword = false,
  togglePasswordVisibility = () => {},
}) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlurInternal = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    handleBlur(e);
  };

  return (
    <div className="relative w-full mt-4">
      <input
        type={type === 'password' && showPassword ? 'text' : type}
        name={name}
        id={name}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlurInternal}
        onFocus={handleFocus}
        placeholder={isFocused ? placeholder : ''}
        className={`peer w-full pl-4 pr-10 pt-5 pb-3 text-sm text-gray-900 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
          touched[name] && errors[name] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      <label
        htmlFor={name}
        className={`absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-orange-500 ${
          touched[name] && errors[name] ? 'text-red-500' : ''
        }`}
      >
        {label}
      </label>

      {type === 'password' && togglePasswordVisibility && (
        <TogglePasswordIconButton
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
        />
      )}

      {touched[name] && errors[name] && (
        <div className="text-sm text-red-600 mt-1">{errors[name]}</div>
      )}
    </div>
  );
};

export default TextField;
