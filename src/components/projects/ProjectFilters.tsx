
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ProjectFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('all');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <form onSubmit={handleSearch} className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek op projectnaam, locatie of referentie"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </form>
      
      <div className="flex gap-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="min-w-[180px]">
            <SelectValue placeholder="Alle statussen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle statussen</SelectItem>
            <SelectItem value="active">Actief</SelectItem>
            <SelectItem value="planning">In planning</SelectItem>
            <SelectItem value="completed">Afgerond</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={() => {
          setSearchQuery('');
          setStatus('all');
        }}>
          Reset
        </Button>
      </div>
    </div>
  );
}
