
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

interface HierarchySelectorProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  items: { id: string; name: string; [key: string]: any }[];
  onSelect: (id: string, name: string) => void;
}

export function HierarchySelector({
  title,
  isOpen,
  onClose,
  items,
  onSelect,
}: HierarchySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    console.log(`Items for ${title}:`, items);
    if (searchTerm.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items, title]);

  const handleSelect = (id: string, name: string) => {
    console.log(`Selected ${title}: ${id} - ${name}`);
    onSelect(id, name);
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Selecteer een item uit de lijst hieronder.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoeken..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ScrollArea className="h-72 mt-2 rounded-md border">
          {filteredItems.length > 0 ? (
            <div className="p-2">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => handleSelect(item.id, item.name)}
                >
                  <div className="ml-2">{item.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Geen items gevonden
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
