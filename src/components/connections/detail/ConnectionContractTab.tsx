
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Connection } from '@/types/connection';
import { formatDate } from '@/lib/utils';

interface ConnectionContractTabProps {
  connection: Connection;
}

export function ConnectionContractTab({ connection }: ConnectionContractTabProps) {
  // Check if contract information exists
  const hasContractInfo = connection.contract && 
    (connection.contract.endDate || 
     connection.contract.price || 
     connection.contract.type || 
     connection.contract.startDate || 
     connection.contract.conditions);

  if (!hasContractInfo) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Geen contractinformatie beschikbaar.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contract Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {connection.contract.type && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                <p className="text-base">{connection.contract.type}</p>
              </div>
            )}
            {connection.contract.price && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Prijs</h4>
                <p className="text-base">{connection.contract.price}</p>
              </div>
            )}
            {connection.contract.startDate && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Startdatum</h4>
                <p className="text-base">{formatDate(connection.contract.startDate)}</p>
              </div>
            )}
            {connection.contract.endDate && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Einddatum</h4>
                <p className="text-base">{formatDate(connection.contract.endDate)}</p>
              </div>
            )}
          </div>

          {connection.contract.conditions && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Voorwaarden</h4>
              <div className="p-4 bg-muted rounded-md">
                <p className="whitespace-pre-wrap">{connection.contract.conditions}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leverancier Informatie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Leverancier</h4>
              <p className="text-base">{connection.supplier || "Niet ingesteld"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
