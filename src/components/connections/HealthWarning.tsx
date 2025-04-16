
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

interface HealthWarningProps {
  onHide: () => void;
}

export const HealthWarning = ({ onHide }: HealthWarningProps) => {
  return (
    <div className="mb-6 p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <SlidersHorizontal className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
            Connection Health Scan Resultaten
          </h3>
          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-500">
            <ul className="list-disc pl-5 space-y-1">
              <li>Mogelijke dubbele aansluiting: EAN 8716871670012345xx op hetzelfde adres in verschillende objecten.</li>
              <li>2 aansluitingen hebben een contract dat binnen 30 dagen verloopt.</li>
              <li>1 actieve aansluiting heeft geen recente meetdata (&gt; 30 dagen).</li>
            </ul>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={onHide}>
              Verberg Melding
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
