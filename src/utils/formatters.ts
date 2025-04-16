
/**
 * Format a number as currency in EUR
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

/**
 * Format a date string in the Dutch format
 */
export const formatDate = (dateString?: string) => {
  if (!dateString) return 'Onbekend';
  return new Date(dateString).toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
