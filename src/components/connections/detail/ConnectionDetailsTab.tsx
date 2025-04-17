
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid2X2, Clock, Zap, MapPin, Building, User, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Connection } from "@/types/connection";
import { ConnectionHierarchyInfo } from "./ConnectionHierarchyInfo";
import { StatusBadge } from "../table/StatusBadge";

interface ConnectionDetailsTabProps {
  connection: Connection;
}

export function ConnectionDetailsTab({ connection }: ConnectionDetailsTabProps) {
  // Determine the badge variant based on connection status
  const getBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case "Actief":
      case "active":
      case "ACTIVE":
        return "outline"; // Using outline instead of success
      case "Inactief":
      case "inactive":
        return "secondary";
      case "Storing":
      case "error":
      case "CANCELLED":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Connection Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <StatusBadge status={connection.status} />
            {connection.lastModified && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Bijgewerkt: {new Date(connection.lastModified).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hierarchy Information Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Hiërarchie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConnectionHierarchyInfo
            organization={connection.organization}
            entity={connection.entity}
            project={connection.project}
            complex={connection.complex}
            object={connection.object}
          />
        </CardContent>
      </Card>

      {/* Technical Details Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Aansluiting Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Type:</span> {connection.type}
            </li>
            {connection.capacity && (
              <li className="flex items-center gap-2">
                <Grid2X2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Capaciteit:</span> {connection.capacity}
              </li>
            )}
            {connection.ean && (
              <li className="flex items-center gap-2">
                <span className="ml-0.5 mr-0.5 h-4 w-4 flex items-center justify-center text-muted-foreground text-xs font-bold">
                  EAN
                </span>
                <span className="font-medium">EAN:</span>
                <span className="font-mono">{connection.ean}</span>
              </li>
            )}
            {connection.gridOperator && (
              <li className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Netbeheerder:</span> {connection.gridOperator}
              </li>
            )}
            {connection.meteringCompany && (
              <li className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Meetbedrijf:</span> {connection.meteringCompany}
              </li>
            )}
            {connection.meteringType && (
              <li className="flex items-center gap-2">
                <Grid2X2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Meter type:</span> {connection.meteringType}
              </li>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Address Details Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Adresgegevens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div>{connection.address}</div>
                <div>{connection.postalCode} {connection.city}</div>
              </div>
            </div>

            {connection.gridOperatorContact && (
              <div className="flex items-center gap-2 mt-4">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Netbeheerder contactpersoon:</div>
                  <div>{connection.gridOperatorContact}</div>
                </div>
              </div>
            )}

            {connection.gridOperatorWorkNumber && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Netbeheerder werknummer:</div>
                  <div>{connection.gridOperatorWorkNumber}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
