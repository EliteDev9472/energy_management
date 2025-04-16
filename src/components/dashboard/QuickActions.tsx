
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, UserPlus, ListPlus, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Snelle Acties</CardTitle>
        <CardDescription>
          Voer veelvoorkomende acties uit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={() => navigate('/projects/new')} 
          variant="outline" 
          className="w-full justify-start"
        >
          <FilePlus className="mr-2 h-4 w-4" />
          Nieuw Project Aanmaken
        </Button>
        
        <Button 
          onClick={() => {
            navigate('/team');
            setTimeout(() => {
              const addButton = document.querySelector('button:has(.lucide-plus)') as HTMLButtonElement;
              if (addButton) addButton.click();
            }, 500);
          }} 
          variant="outline" 
          className="w-full justify-start"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Teamlid Toevoegen
        </Button>
        
        <Button 
          onClick={() => {
            navigate('/tasks');
            setTimeout(() => {
              const addButton = document.querySelector('button:has(.lucide-plus)') as HTMLButtonElement;
              if (addButton) addButton.click();
            }, 500);
          }} 
          variant="outline" 
          className="w-full justify-start"
        >
          <ListPlus className="mr-2 h-4 w-4" />
          Taak Toevoegen
        </Button>
        
        <Button 
          onClick={() => navigate('/connections/new')} 
          variant="outline" 
          className="w-full justify-start"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Aansluiting Aanmaken
        </Button>
      </CardContent>
    </Card>
  );
}
