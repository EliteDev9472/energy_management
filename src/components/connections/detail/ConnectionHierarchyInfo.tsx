
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Layers, Landmark, Home, Users } from "lucide-react";
import { Connection } from "@/types/connection";

// Accept either a connection object or individual hierarchy properties
export interface ConnectionHierarchyInfoProps {
  connection?: Connection;
  organization?: string;
  organizationName?: string;
  organizationId?: string;
  entity?: string;
  entityName?: string;
  entityId?: string;
  category?: string;
  categoryName?: string;
  categoryId?: string;
  project?: string;
  projectName?: string;
  projectId?: string;
  complex?: string;
  complexName?: string;
  complexId?: string;
  object?: string;
  objectName?: string;
  objectId?: string;
}

export function ConnectionHierarchyInfo({
  connection,
  organization,
  organizationName,
  entity,
  entityName,
  category,
  categoryName,
  project,
  projectName,
  complex,
  complexName,
  object,
  objectName
}: ConnectionHierarchyInfoProps) {
  // If a connection object is provided, use its properties
  const org = connection?.organization || organization || organizationName;
  const ent = connection?.entity || entity || entityName;
  const cat = category || categoryName;
  const proj = connection?.project || project || projectName;
  const comp = connection?.complex || complex || complexName;
  const obj = connection?.object || object || objectName;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Hiërarchie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {org && (
          <div className="flex items-center">
            <Landmark className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Organisatie</span>
              <span>{org}</span>
            </div>
          </div>
        )}
        
        {ent && (
          <div className="flex items-center">
            <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Entiteit</span>
              <span>{ent}</span>
            </div>
          </div>
        )}
        
        {proj && (
          <div className="flex items-center">
            <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Project</span>
              <span>{proj}</span>
            </div>
          </div>
        )}
        
        {comp && (
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Complex</span>
              <span>{comp}</span>
            </div>
          </div>
        )}
        
        {obj && (
          <div className="flex items-center">
            <Home className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Object</span>
              <span>{obj}</span>
            </div>
          </div>
        )}
        
        {!org && !ent && !proj && !comp && !obj && (
          <div className="text-sm text-muted-foreground italic">
            Geen hiërarchie informatie beschikbaar
          </div>
        )}
      </CardContent>
    </Card>
  );
}
