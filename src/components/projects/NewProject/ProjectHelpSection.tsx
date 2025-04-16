
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ProjectHelpSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Help & Informatie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm">
          <p>
            Na het aanmaken van het project kunt u het volgende doen:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Nieuwe objecten toevoegen aan het project</li>
            <li>Objecten koppelen aan aansluitingen</li>
            <li>Documenten uploaden voor het project</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
