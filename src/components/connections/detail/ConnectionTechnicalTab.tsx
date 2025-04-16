
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Connection } from '@/types/connection';
import { Building, Gauge } from "lucide-react";

interface ConnectionTechnicalTabProps {
  connection: Connection;
}

export function ConnectionTechnicalTab({ connection }: ConnectionTechnicalTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-muted-foreground" />
            Technische Informatie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Capaciteit</h4>
              <p className="text-base">{connection.capacity || "Niet ingesteld"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">EAN</h4>
              <p className="text-base">{connection.ean || "Niet ingesteld"}</p>
            </div>
            {connection.technicalSpecifications && connection.technicalSpecifications.meteringType && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Type meting</h4>
                <p className="text-base">{connection.technicalSpecifications.meteringType}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-muted-foreground" />
            Netbeheerder & Meetbedrijf
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Netbeheerder</h4>
              <p className="text-base">{connection.gridOperator || "Niet ingesteld"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Meetbedrijf</h4>
              <p className="text-base">{connection.meteringCompany || "Niet ingesteld"}</p>
            </div>
            {connection.gridOperatorWorkNumber && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Netbeheerder werknummer</h4>
                <p className="text-base">{connection.gridOperatorWorkNumber}</p>
              </div>
            )}
            {connection.gridOperatorContact && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Netbeheerder contactpersoon</h4>
                <p className="text-base">{connection.gridOperatorContact}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
