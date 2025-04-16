import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Connection } from "@/types/connection";
import { Project } from "@/types/project";
import { AlertTriangle, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { parseISO, isValid, addWeeks, isBefore } from "date-fns";

interface ProjectStatusOverviewProps {
  project: Project;
  connections: Connection[];
}

export const ProjectStatusOverview = ({ project, connections }: ProjectStatusOverviewProps) => {
  // Calculate statistics
  const connectionsByStatus = connections.reduce((acc, conn) => {
    acc[conn.status] = (acc[conn.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const connectionsWithoutDate = connections.filter(conn => !conn.plannedConnectionDate).length;
  
  const criticalConnections = connections.filter(conn => {
    if (!conn.plannedConnectionDate) return false;
    
    const statusStr = String(conn.status).toLowerCase();
    if (statusStr !== 'in aanvraag' && statusStr !== 'pending' && statusStr !== 'new') return false;
    
    const plannedDate = parseISO(conn.plannedConnectionDate);
    if (!isValid(plannedDate)) return false;
    
    const twoWeeksFromNow = addWeeks(new Date(), 2);
    return isBefore(plannedDate, twoWeeksFromNow);
  }).length;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Aansluitingen Overzicht</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
            <div className="space-y-1">
              {Object.entries(connectionsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm">{status}</span>
                  <Badge variant="outline" className="ml-2">{count}</Badge>
                </div>
              ))}
              {Object.keys(connectionsByStatus).length === 0 && (
                <span className="text-sm text-muted-foreground">Geen aansluitingen</span>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Planning</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                  <span className="text-sm">Zonder aansluitdatum</span>
                </div>
                <Badge variant="outline" className={connectionsWithoutDate > 0 ? "bg-amber-50 text-amber-700" : ""}>
                  {connectionsWithoutDate}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm">Kritieke planning (&lt;2 weken)</span>
                </div>
                <Badge variant="outline" className={criticalConnections > 0 ? "bg-red-50 text-red-700" : ""}>
                  {criticalConnections}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Voortgang</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Afgerond</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {connectionsByStatus['Actief'] || 0}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm">Fase</span>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {project.buildingPhase || "Onbekend"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
