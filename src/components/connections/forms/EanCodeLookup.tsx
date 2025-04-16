
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';
import { lookupEanCode, validateEanCode, EanCodeInfo, EanValidationResult } from '@/utils/eanUtils';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EanCodeLookupProps {
  value: string;
  onChange: (value: string) => void;
  onCodeFound?: (info: EanCodeInfo) => void;
}

export function EanCodeLookup({ value, onChange, onCodeFound }: EanCodeLookupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationResult, setValidationResult] = useState<EanValidationResult | null>(null);
  
  // Validate EAN code on input change
  useEffect(() => {
    if (value) {
      const result = validateEanCode(value);
      setValidationResult(result);
      
      if (result.isValid) {
        setError(null);
        
        // Auto-lookup if it's 18 digits and starts with 87 (Dutch code)
        if (value.length === 18 && value.startsWith('87')) {
          handleLookup();
        }
      } else if (value.length > 0) {
        // Only show errors if user has started typing
        setError(result.message);
      }
    } else {
      setValidationResult(null);
      setError(null);
    }
  }, [value]);
  
  const handleLookup = async () => {
    if (!value) {
      setError("Voer een EAN code in");
      return;
    }
    
    const validation = validateEanCode(value);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await lookupEanCode(value);
      
      if (result) {
        setSuccess(true);
        if (onCodeFound) {
          onCodeFound(result);
        }
      } else {
        setError("Geen gegevens gevonden voor deze EAN code");
      }
    } catch (err) {
      console.error("Error looking up EAN code:", err);
      setError("Fout bij ophalen van EAN code gegevens. Probeer het later opnieuw.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInputBorderClass = () => {
    if (error) return "border-red-500 focus-visible:ring-red-500";
    if (success) return "border-green-500 focus-visible:ring-green-500";
    if (validationResult?.isValid) return "border-yellow-500 focus-visible:ring-yellow-500";
    return "";
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="ean-code" className="font-medium flex items-center gap-2">
          EAN Code 
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-sm p-3 bg-white text-gray-800 border border-gray-200">
                <p>Een EAN-code (European Article Number) is een uniek 18-cijferig nummer voor uw energieaansluiting</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
      </div>
      <div className="flex gap-2 relative">
        <div className="flex-1 relative">
          <Input
            id="ean-code"
            value={value}
            onChange={(e) => {
              // Only allow digits in input
              const sanitized = e.target.value.replace(/[^0-9]/g, '');
              onChange(sanitized);
              setSuccess(false);
            }}
            placeholder="18 cijferige EAN code (bijv. 87...)"
            className={cn(
              "h-10 pr-10", 
              getInputBorderClass(), 
              "bg-soft-gray", 
              success ? "border-green-500 ring-1 ring-green-500" : "",
              "transition-all duration-300 ease-in-out"
            )}
            maxLength={18}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {validationResult && !error && !success && value.length > 0 && (
              <div className="text-yellow-500">
                {validationResult.isValid ? (
                  <CheckCircle2 className="h-5 w-5 animate-pulse" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 animate-pulse" />
                )}
              </div>
            )}
          </div>
        </div>
        <Button 
          type="button" 
          onClick={handleLookup} 
          disabled={isLoading || !value || (validationResult ? !validationResult.isValid : false)}
          variant="secondary"
          className={cn(
            "h-10 px-4 whitespace-nowrap",
            "bg-soft-purple hover:bg-primary-purple hover:text-white",
            "transition-all duration-300 ease-in-out"
          )}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Laden...
            </span>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Zoeken
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="py-2 mt-2 bg-soft-pink border-red-200">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert variant="default" className="bg-soft-green border-green-200 py-2 mt-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800">EAN code gevonden! Adresgegevens zijn ingevuld.</AlertDescription>
        </Alert>
      )}
      
      <div className="text-sm text-muted-foreground mt-1">
        <p className="flex items-center gap-2">
          <Info className="h-4 w-4 text-soft-purple" />
          Een EAN-code (European Article Number) is een uniek 18-cijferig nummer voor uw aansluiting.
        </p>
        {validationResult && !validationResult.isValid && value.length > 0 && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            {validationResult.message}
          </p>
        )}
        {value && value.length > 0 && value.length < 18 && (
          <p className="text-yellow-500 text-xs mt-1 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Nog {18 - value.length} cijfers nodig
          </p>
        )}
      </div>
    </div>
  );
}
