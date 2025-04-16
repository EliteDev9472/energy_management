
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

interface ProjectDescriptionSectionProps {
  description: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isSubmitting: boolean;
}

export const ProjectDescriptionSection = ({
  description,
  handleChange,
  isSubmitting
}: ProjectDescriptionSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projectbeschrijving</CardTitle>
        <CardDescription>Geef een beschrijving van het project</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea 
          name="description"
          value={description}
          onChange={handleChange}
          placeholder="Voer een beschrijving in voor het project..."
          className="min-h-[150px]"
        />
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={() => navigate('/projects')}
          type="button"
        >
          Annuleren
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-cedrus-accent hover:bg-cedrus-accent/90"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Bezig met opslaan...' : 'Project Aanmaken'}
        </Button>
      </CardFooter>
    </Card>
  );
};
