
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to a localized date format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "Niet ingesteld";
  
  try {
    // Check if it's a valid date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ongeldige datum";
    
    // Return formatted date
    return date.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Fout bij formatteren datum";
  }
}
