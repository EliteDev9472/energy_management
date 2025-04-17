
import { Badge } from "@/components/ui/badge";
import { CONNECTION_STATUS_LABELS } from "@/types/connection/base";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getClassName = () => {
    const normalizedStatus = status.toLowerCase();

    // Check if it's one of the system connection statuses
    if (Object.values(CONNECTION_STATUS_LABELS).some(label =>
      label.toLowerCase() === normalizedStatus)) {
      // Use the existing statuses
      switch (normalizedStatus) {
        case 'actief':
        case 'active':
          return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:border-green-800 dark:text-green-400';
        case 'in aanvraag':
        case 'in behandeling':
        case 'in_progress':
        case 'in progress':
          return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400';
        case 'inactief':
        case 'inactive':
          return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400';
        case 'geblokkeerd':
        case 'cancelled':
          return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:border-red-800 dark:text-red-400';
        case 'storing':
          return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-400';
        case 'new':
        case 'nieuw':
        case 'concept':
          return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400';
        case 'planned':
        case 'gepland':
          return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-400';
        case 'completed':
        case 'afgerond':
          return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400';
        default:
          return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400';
      }
    } else {
      // Project status badges
      switch (normalizedStatus) {
        case 'lopend':
          return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:border-green-800 dark:text-green-400';
        case 'in_aanvraag':
          return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400';
        case 'concept':
          return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400';
        case 'afgerond':
          return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400';
        default:
          return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400';
      }
    }
  };

  return (
    <Badge
      variant="outline"
      className={getClassName()}
    >
      {status}
    </Badge>
  );
}
