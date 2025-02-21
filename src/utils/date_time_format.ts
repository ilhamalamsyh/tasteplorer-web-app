export const convertDateToFormattedDate = (
  initialDate: string | Date | null,
  format: string
): string | Date => {
  try {
    if (!initialDate) {
      throw new Error('Initial date is null');
    }
    const date = new Date(initialDate);

    if (format === 'YYYY-MM-DD') {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    }

    return initialDate;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
