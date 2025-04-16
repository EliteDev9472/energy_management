
import { FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeterTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export function MeterTypeSelector({ value, onChange, label = "Type meter", showIcon = false, className }: MeterTypeSelectorProps) {
  // Ensure value is never empty string
  const safeValue = value || "slimme_meter";
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        {showIcon && <Gauge className="h-4 w-4 text-muted-foreground" />}
        {label && <Label>{label}</Label>}
      </div>
      <Select
        onValueChange={onChange}
        value={safeValue}
        defaultValue="slimme_meter"
      >
        <SelectTrigger className={label ? "mt-0" : ""}>
          <SelectValue placeholder="Selecteer type meter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="slimme_meter">Slimme meter</SelectItem>
          <SelectItem value="traditionele_meter">Traditionele meter</SelectItem>
          <SelectItem value="telemetrie">Telemetrie</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
