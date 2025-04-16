
/**
 * Format a number as currency (EUR)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a date string to localized format
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Onbekend';
  
  try {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Ongeldige datum';
  }
};

/**
 * Format a number with specific precision
 */
export const formatNumber = (value: number, precision: number = 2): string => {
  return value.toFixed(precision);
};
