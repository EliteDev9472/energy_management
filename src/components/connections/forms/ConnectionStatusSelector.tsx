
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CONNECTION_STATUS_OPTIONS } from '@/types/connection/base';

interface ConnectionStatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ConnectionStatusSelector({ value, onChange }: ConnectionStatusSelectorProps) {
  return (
    <div>
      <Label htmlFor="status">Status</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Selecteer status" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(CONNECTION_STATUS_OPTIONS).map(([key, statusValue]) => (
            <SelectItem key={key} value={statusValue}>
              {statusValue}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
