
import { Activity, FileText, Battery, Calendar } from "lucide-react";

type ActivityItem = {
  id: string;
  type: 'connection' | 'project' | 'task' | 'document';
  title: string;
  description: string;
  date: string;
  icon: JSX.Element;
};

export function ProfileActivity() {
  // Mock activity data for demonstration
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'connection',
      title: 'Aansluiting aangevraagd',
      description: 'U heeft een nieuwe aansluiting aangevraagd voor Hoofdstraat 12, Amsterdam.',
      date: '15 mrt 2025',
      icon: <Battery className="h-5 w-5 text-blue-500" />
    },
    {
      id: '2',
      type: 'project',
      title: 'Project toegewezen',
      description: 'U bent toegevoegd aan het project "Energietransitie Noord".',
      date: '10 mrt 2025',
      icon: <Activity className="h-5 w-5 text-green-500" />
    },
    {
      id: '3',
      type: 'task',
      title: 'Taak voltooid',
      description: 'U heeft de taak "Contract opstellen" gemarkeerd als voltooid.',
      date: '8 mrt 2025',
      icon: <Calendar className="h-5 w-5 text-amber-500" />
    },
    {
      id: '4',
      type: 'document',
      title: 'Document geüpload',
      description: 'U heeft het document "Aansluitspecificaties.pdf" geüpload.',
      date: '5 mrt 2025',
      icon: <FileText className="h-5 w-5 text-purple-500" />
    },
  ];

  return (
    <div className="space-y-6">
      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Geen recente activiteiten gevonden.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4">
              <div className="mt-1 h-9 w-9 rounded-full flex items-center justify-center bg-muted">
                {activity.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{activity.title}</h4>
                  <span className="text-xs text-muted-foreground">{activity.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
