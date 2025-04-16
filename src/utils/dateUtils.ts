
/**
 * Format a date string or Date object to a localized date string
 */
export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return 'Niet beschikbaar';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Ongeldige datum';
  }
  
  // Format the date to the Dutch locale
  return date.toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Format a date string or Date object to a localized date and time string
 */
export const formatDateTime = (dateString: string | Date): string => {
  if (!dateString) return 'Niet beschikbaar';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Ongeldige datum';
  }
  
  // Format the date and time to the Dutch locale
  return date.toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculate the difference in days between two dates
 */
export const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  return diffDays;
};

/**
 * Format a number of days as a human readable duration
 */
export const formatDuration = (days: number): string => {
  if (days < 1) {
    return 'Minder dan een dag';
  } else if (days === 1) {
    return '1 dag';
  } else if (days < 30) {
    return `${days} dagen`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? '1 maand' : `${months} maanden`;
  } else {
    const years = Math.floor(days / 365);
    return years === 1 ? '1 jaar' : `${years} jaar`;
  }
};

/**
 * Get a date 24 hours from now
 */
export const get24HoursFromNow = (): Date => {
  const date = new Date();
  date.setHours(date.getHours() + 24);
  return date;
};

/**
 * Get time remaining from now until the given date
 */
export const getTimeRemaining = (targetDate: Date | string): string => {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const now = new Date();
  
  // If the target date is in the past
  if (target.getTime() < now.getTime()) {
    return 'Verstreken';
  }
  
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} ${diffDays === 1 ? 'dag' : 'dagen'}`;
  } else {
    return `${diffHours} ${diffHours === 1 ? 'uur' : 'uren'}`;
  }
};
