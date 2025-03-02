import { useState } from 'react';

const useDatePicker = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const openDatePicker = () => setShowDatePicker(true);
  const closeDatePicker = () => setShowDatePicker(false);

  return { showDatePicker, openDatePicker, closeDatePicker };
};

export default useDatePicker;
