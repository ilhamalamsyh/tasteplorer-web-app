'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useField } from 'formik';

interface Option {
  id: string | number;
  name: string;
}

interface SelectOptionFieldProps {
  name: string;
  label: string;
  isMultiple: boolean;
  options: Option[];
}

const SelectOptionField: React.FC<SelectOptionFieldProps> = ({
  name,
  label,
  isMultiple,
  options,
}) => {
  const [field, meta, helpers] = useField(name);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getSelectedOptions = (): Option[] => {
    if (isMultiple) {
      return options.filter(
        (option) =>
          Array.isArray(field.value) &&
          field.value.some((id: string | number) => id === option.id)
      );
    } else {
      return options.filter((option) => option.id === field.value);
    }
  };

  const handleSelect = (option: Option) => {
    if (isMultiple) {
      const newValue = Array.isArray(field.value)
        ? field.value.includes(option.id)
          ? field.value.filter((id: string | number) => id !== option.id)
          : [...field.value, option.id]
        : [option.id];
      helpers.setValue(newValue);
    } else {
      helpers.setValue(option.id);
      setIsOpen(false);
    }
    // Reset the search term
    setSearchTerm('');
  };

  const handleRemove = (optionId: string | number) => {
    if (isMultiple) {
      helpers.setValue(
        Array.isArray(field.value)
          ? field.value.filter((id: string | number) => id !== optionId)
          : []
      );
    } else {
      helpers.setValue(''); // Use empty string for single-select fields
    }
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full mt-4" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div
          className="border border-gray-300 rounded-md p-2 flex flex-wrap gap-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {getSelectedOptions().map((option) => (
            <div
              key={option.id}
              className="bg-blue-100 text-blue-800 text-sm rounded-full px-2 py-1 flex items-center"
            >
              {option.name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(option.id);
                }}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            </div>
          ))}
          {getSelectedOptions().length === 0 && (
            <span className="text-gray-500">
              Select {isMultiple ? 'options' : 'an option'}
            </span>
          )}
          <div className="ml-auto">
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            )}
          </div>
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <input
              type="text"
              className="w-full p-2 border-b border-gray-300"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <ul className="max-h-60 overflow-auto">
              {filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${
                    (Array.isArray(field.value) &&
                      field.value.includes(option.id)) ||
                    field.value === option.id
                      ? 'bg-blue-50'
                      : ''
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option.name}
                  {((Array.isArray(field.value) &&
                    field.value.includes(option.id)) ||
                    field.value === option.id) && (
                    <span className="ml-2 text-blue-600">✓</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {meta.touched && meta.error && (
        <p className="mt-1 text-sm text-red-600">{meta.error}</p>
      )}
    </div>
  );
};

export default SelectOptionField;
