
import { Flame, Zap, Droplet, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TypeBadgeProps {
  type: string;
  showIcon?: boolean;
}

export const TypeBadge = ({ type, showIcon = true }: TypeBadgeProps) => {
  const getTypeDetails = () => {
    const normalizedType = type?.toLowerCase() || '';
    
    switch (normalizedType) {
      case 'gas':
        return {
          color: 'bg-gas-light text-gas-dark border-gas-orange/20 dark:bg-gas-orange/20 dark:border-gas-orange/30 dark:text-gas-orange',
          icon: showIcon ? <Flame className="h-3 w-3 mr-1" /> : null
        };
      case 'elektriciteit':
      case 'electricity':
        return {
          color: 'bg-elektra-light text-elektra-dark border-elektra-blue/20 dark:bg-elektra-blue/20 dark:border-elektra-blue/30 dark:text-elektra-blue',
          icon: showIcon ? <Zap className="h-3 w-3 mr-1" /> : null
        };
      case 'water':
        return {
          color: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:border-cyan-800 dark:text-cyan-400',
          icon: showIcon ? <Droplet className="h-3 w-3 mr-1" /> : null
        };
      case 'warmte':
      case 'heat':
        return {
          color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:border-red-800 dark:text-red-400',
          icon: showIcon ? <Thermometer className="h-3 w-3 mr-1" /> : null
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-400',
          icon: null
        };
    }
  };

  const { color, icon } = getTypeDetails();

  return (
    <Badge 
      variant="outline" 
      className={`${color} flex items-center justify-center text-xs py-0.5 px-2 h-6 w-auto inline-flex`}
    >
      {icon}
      {type}
    </Badge>
  );
};
