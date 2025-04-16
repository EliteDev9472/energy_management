
import { CardContent } from "@/components/ui/card";
import { Connection } from '@/types/connection';
import { TypeBadge } from '@/components/connections/table/TypeBadge';
import { StatusBadge } from '@/components/connections/table/StatusBadge';

interface ConnectionKeyInfoProps {
  connection: Connection;
}

export function ConnectionKeyInfo({ connection }: ConnectionKeyInfoProps) {
  return (
    <CardContent className="py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">EAN Code</p>
          <p className="text-lg font-semibold">{connection.ean || "Niet beschikbaar"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Type</p>
          <div className="mt-1">
            <TypeBadge type={connection.type} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <StatusBadge status={connection.status} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Leverancier</p>
          <p className="text-lg font-semibold">{connection.supplier || "Niet ingesteld"}</p>
        </div>
      </div>

      {/* Add hierarchical path information */}
      {(connection.organization || connection.entity || connection.object) && (
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm font-medium text-muted-foreground mb-2">Hiërarchie</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {connection.organization && (
              <div>
                <p className="text-xs text-muted-foreground">Organisatie</p>
                <p className="text-sm font-medium">{connection.organization}</p>
              </div>
            )}
            {connection.entity && (
              <div>
                <p className="text-xs text-muted-foreground">Entiteit</p>
                <p className="text-sm font-medium">{connection.entity}</p>
              </div>
            )}
            {connection.object && (
              <div>
                <p className="text-xs text-muted-foreground">Object</p>
                <p className="text-sm font-medium">{connection.object}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </CardContent>
  );
}
