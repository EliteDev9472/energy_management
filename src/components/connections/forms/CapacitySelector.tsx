
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';

type CapacityOption = {
  value: string;
  label: string;
  description: string;
};

interface CapacitySelectorProps {
  connectionType: string;
  value: string;
  onChange: (value: string) => void;
}

export function CapacitySelector({ connectionType, value, onChange }: CapacitySelectorProps) {
  const [capacityOptions, setCapacityOptions] = useState<CapacityOption[]>([]);

  useEffect(() => {
    // Ensure connectionType is a string before proceeding
    const type = connectionType || '';
    const options = getCapacityOptions(type);
    setCapacityOptions(options);
    
    // If current value is not in new options and options exist, set to first option
    if (options.length > 0 && (!value || !options.some(option => option.value === value))) {
      onChange(options[0].value);
    }
  }, [connectionType, value, onChange]);

  const getCapacityOptions = (type: string): CapacityOption[] => {
    // Convert type to lowercase for case-insensitive comparison
    const normalizedType = (type || '').toLowerCase();
    
    if (normalizedType === 'elektriciteit' || normalizedType === 'electricity') {
      return [
        { value: '1x25A', label: '1x25A', description: 'Enkel-fase, standaard voor lichte woningbouw' },
        { value: '1x35A', label: '1x35A', description: 'Enkel-fase, zwaarder gebruik (bijv. warmtepomp)' },
        { value: '3x25A', label: '3x25A', description: 'Drie-fase, standaard voor nieuwbouwwoningen' },
        { value: '3x35A', label: '3x35A', description: 'Drie-fase, licht verhoogde capaciteit' },
        { value: '3x50A', label: '3x50A', description: 'Zwaardere drie-fase aansluiting' },
        { value: '3x63A', label: '3x63A', description: 'Veel gebruikt in utiliteit en appartementencomplexen' },
        { value: '3x80A', label: '3x80A', description: 'Hoge verbruiker of kleinzakelijk gebruik' },
        { value: '>80A', label: '>80A (maatwerk)', description: 'Grootverbruiker – op aanvraag bij netbeheerder' }
      ];
    } 
    else if (normalizedType === 'gas') {
      return [
        { value: 'G1.6', label: 'G1.6', description: 'Zeer kleinverbruiker (vaak niet meer toegepast)' },
        { value: 'G2.5', label: 'G2.5', description: 'Kleinverbruiker – oude norm, zelden nieuw' },
        { value: 'G4', label: 'G4', description: 'Standaard aansluiting voor kleine woningen' },
        { value: 'G6', label: 'G6', description: 'Veel gebruikt in woningen met combiketel' },
        { value: 'G10', label: 'G10', description: 'Grotere huishoudens / lichte utiliteit' },
        { value: 'G16', label: 'G16', description: 'Utiliteit / kleine bedrijven' },
        { value: 'G25', label: 'G25', description: 'Zwaardere utiliteit – horeca, kleine industrie' },
        { value: '>G25', label: '>G25 (maatwerk)', description: 'Grootverbruiker, altijd via netbeheerder' }
      ];
    } 
    else if (normalizedType === 'water') {
      return [
        { value: 'Q3-2.5', label: 'Q3-2.5', description: 'Standaard huishoudelijk' },
        { value: 'Q3-4', label: 'Q3-4', description: 'Groter huishoudelijk / klein zakelijk' },
        { value: 'Q3-6.3', label: 'Q3-6.3', description: 'Klein zakelijk' },
        { value: 'Q3-10', label: 'Q3-10', description: 'Zakelijk' },
        { value: 'Q3-16', label: 'Q3-16', description: 'Groot zakelijk' }
      ];
    } 
    else if (normalizedType === 'warmte' || normalizedType === 'heat') {
      return [
        { value: 'klein', label: 'Klein (<100 kW)', description: 'Voor woningen en kleine bedrijfspanden' },
        { value: 'middel', label: 'Middel (100-200 kW)', description: 'Voor grotere bedrijfspanden' },
        { value: 'groot', label: 'Groot (>200 kW)', description: 'Voor grote gebouwen en complexen' }
      ];
    }
    
    return [];
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="capacity">Capaciteit</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="h-5 w-5 text-muted-foreground" aria-label="Help">
              <HelpCircle className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Capaciteit uitleg</h4>
              <div className="space-y-1 text-sm">
                {capacityOptions.map(option => (
                  <div key={option.value} className="grid grid-cols-2 gap-1">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-muted-foreground">{option.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Select 
        value={value || ''} 
        onValueChange={onChange}
        disabled={capacityOptions.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecteer capaciteit" />
        </SelectTrigger>
        <SelectContent>
          {capacityOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex justify-between items-center w-full">
                <span>{option.label}</span>
                <span className="text-xs text-muted-foreground ml-2 truncate max-w-[200px]">{option.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
