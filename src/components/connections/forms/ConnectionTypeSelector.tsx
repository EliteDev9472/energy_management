
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConnectionTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ConnectionTypeSelector({ value, onChange }: ConnectionTypeSelectorProps) {
  // Normalize incoming value for consistent display
  const normalizedValue = !value ? 'electricity' : 
                         value.toLowerCase() === 'elektriciteit' ? 'electricity' : 
                         value.toLowerCase();
  
  return (
    <div>
      <Label htmlFor="type">Type aansluiting</Label>
      <Select value={normalizedValue} onValueChange={onChange}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Selecteer type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="electricity">Elektriciteit</SelectItem>
          <SelectItem value="gas">Gas</SelectItem>
          <SelectItem value="water">Water</SelectItem>
          <SelectItem value="heat">Warmte</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
