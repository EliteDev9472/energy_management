
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ConnectionConsumptionTabProps {
  connectionId: string;
}

export function ConnectionConsumptionTab({ connectionId }: ConnectionConsumptionTabProps) {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Verbruik</h3>
        
        <div className="flex justify-center items-center h-60 border rounded-md bg-muted/20">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Verbruiksgegevens worden geladen...</p>
            <Button 
              onClick={() => navigate(`/connections/${connectionId}/consumption`)}
              className="bg-cedrus-accent hover:bg-cedrus-accent/90"
            >
              Bekijk verbruik
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
