
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Debounce search input to improve performance
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (inputValue === searchQuery) return;

    setIsSearching(true);
    const timeout = setTimeout(() => {
      setSearchQuery(inputValue);
      setIsSearching(false);
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [inputValue, setSearchQuery, searchQuery, searchTimeout]);

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Zoek op EAN, adres, project of leverancier..."
        className="pl-8"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {isSearching ? (
        <Loader className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
      ) : inputValue && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2" 
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
