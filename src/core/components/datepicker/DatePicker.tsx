'use client';

import { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  isAfter,
  startOfDay,
} from 'date-fns';

interface DatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
  onClose: () => void;
  disableFutureDates?: boolean;
  currentMonth: Date; // Menambahkan currentMonth di props
}

export function DatePicker({
  selectedDate,
  onChange,
  onClose,
  disableFutureDates = false,
  currentMonth: initialCurrentMonth, // Menggunakan currentMonth sebagai input
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(initialCurrentMonth); // Menggunakan initialCurrentMonth
  const [isYearMonthSelectOpen, setIsYearMonthSelectOpen] = useState(false);
  const [tempYear, setTempYear] = useState(currentMonth.getFullYear());
  const [tempMonth, setTempMonth] = useState(currentMonth.getMonth());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateSelect = (date: Date) => {
    onChange(date);
  };

  const today = startOfDay(new Date());

  const isDateDisabled = (date: Date) => {
    if (disableFutureDates) {
      return isAfter(date, today);
    }
    return false;
  };

  const years = Array.from(
    { length: 80 },
    (_, i) => new Date().getFullYear() - i
  );
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleYearMonthSelect = () => {
    setCurrentMonth(new Date(tempYear, tempMonth));
    setIsYearMonthSelectOpen(false);
  };

  useEffect(() => {
    setTempYear(currentMonth.getFullYear());
    setTempMonth(currentMonth.getMonth());
  }, [currentMonth]); // Set ulang tempYear dan tempMonth ketika currentMonth berubah

  return (
    <div className="bg-gray-50 rounded-3xl p-6 w-full max-w-md shadow-lg">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-gray-600 text-lg">Select date</h2>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-normal">
            {selectedDate
              ? format(selectedDate, 'EEEE, d MMMM')
              : 'Select a date'}
          </h1>
          <button
            onClick={() => setIsYearMonthSelectOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Open year and month selection"
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </button>
        </div>

        {isYearMonthSelectOpen ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <select
                value={tempYear}
                onChange={(e) => setTempYear(parseInt(e.target.value))}
                className="block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={tempMonth}
                onChange={(e) => setTempMonth(parseInt(e.target.value))}
                className="block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleYearMonthSelect}
              className="w-full bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary transition-colors"
            >
              Apply
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="text-lg text-gray-600">
                {format(currentMonth, 'MMMM yyyy')}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-full"
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
                      d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  disabled={
                    disableFutureDates &&
                    isAfter(startOfMonth(addMonths(currentMonth, 1)), today)
                  }
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
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={day + index} className="text-gray-600 font-medium">
                  {day}
                </div>
              ))}
              {calendarDays.map((day) => (
                <button
                  key={day.toString()}
                  onClick={() => handleDateSelect(day)}
                  disabled={isDateDisabled(day)}
                  className={`
                    rounded-full w-10 h-10 flex items-center justify-center
                    ${
                      !isSameMonth(day, currentMonth)
                        ? 'text-gray-400'
                        : 'hover:bg-primary  '
                    }
                    ${
                      selectedDate &&
                      isSameDay(day, selectedDate) &&
                      isSameMonth(currentMonth, selectedDate)
                        ? 'bg-primary text-white'
                        : ''
                    }
                    ${
                      selectedDate && isSameDay(day, selectedDate)
                        ? 'bg-primary text-white'
                        : !selectedDate && isSameDay(day, new Date())
                        ? 'border-2 border-primary text-primary'
                        : ''
                    }
                      
                    ${
                      isDateDisabled(day) ? 'opacity-50 cursor-not-allowed' : ''
                    }
                  `}
                >
                  {format(day, 'd')}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 text-primary hover:bg-primary hover:text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 text-primary hover:bg-primary hover:text-white rounded-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
