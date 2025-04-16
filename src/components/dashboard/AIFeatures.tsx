
import { FolderCog, ListChecks, Users2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const features = [
  {
    title: 'Projectbeheer',
    description: 'Volledige projectplanning en beheer van assets',
    icon: <FolderCog className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  },
  {
    title: 'Taakbeheer',
    description: 'Maak en beheer taken en deadlines',
    icon: <ListChecks className="h-5 w-5" />,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  },
  {
    title: 'Team Samenwerking',
    description: 'Werk samen met consultants en klanten in één platform',
    icon: <Users2 className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  },
  {
    title: 'Planning & Tijdlijnen',
    description: 'Beheer projecttijdlijnen en deadlines',
    icon: <Clock className="h-5 w-5" />,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  }
];

export function AIFeatures() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <FolderCog className="h-4 w-4 text-cedrus-gold" />
          Platform Functies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((feature) => (
            <FeatureCard 
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              color={feature.color}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

function FeatureCard({ title, description, icon, color }: FeatureCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-full", color)}>
          {icon}
        </div>
        <div>
          <h4 className="font-medium mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
