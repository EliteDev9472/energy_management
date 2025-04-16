
import { Card, CardContent } from '@/components/ui/card';
import { Status } from '@/components/status/Status';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatters';

interface ConnectionCardProps {
  connection: any;
  onClick: () => void;
  compact?: boolean;
}

export function ConnectionCard({ connection, onClick, compact = false }: ConnectionCardProps) {
  if (compact) {
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <div className="truncate">
                <p className="text-sm font-medium truncate">{connection.address}</p>
                <p className="text-xs text-muted-foreground truncate">{connection.city}</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <Badge variant="outline" className="capitalize truncate text-xs">{connection.type}</Badge>
              {connection.ean && (
                <span className="text-xs text-muted-foreground truncate">EAN: {connection.ean.substring(0, 6)}...</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{connection.address}</h3>
            <p className="text-sm text-muted-foreground">{connection.city}</p>
            {connection.ean && (
              <p className="text-sm text-muted-foreground mt-1">
                EAN: {connection.ean}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Status status={connection.status} />
            <Badge variant="outline" className="capitalize">{connection.type}</Badge>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t flex justify-between text-sm">
          <span className="text-muted-foreground">Aangevraagd: {formatDate(connection.request_date)}</span>
          <span className="text-muted-foreground">{connection.grid_operator || connection.gridOperator}</span>
        </div>
      </CardContent>
    </Card>
  );
}
