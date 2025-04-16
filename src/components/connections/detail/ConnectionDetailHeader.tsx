
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Connection } from '@/types/connection';
import { toast } from "@/hooks/use-toast";

interface ConnectionDetailHeaderProps {
  connection: Connection;
}

export function ConnectionDetailHeader({ connection }: ConnectionDetailHeaderProps) {
  const navigate = useNavigate();

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/connections/${connection.id}/edit`);
    toast({
      title: "Bewerken gestart",
      description: `Aansluiting ${connection.ean || connection.id} wordt bewerkt.`
    });
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <Button variant="ghost" onClick={() => navigate('/connections')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Terug
      </Button>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Aansluiting Details</h1>
        <p className="text-muted-foreground mt-1">
          {connection.address}, {connection.postalCode} {connection.city}
        </p>
      </div>
      <Button 
        variant="outline"
        onClick={handleEditClick}
        className="flex items-center gap-2"
      >
        <Pencil className="h-4 w-4" /> Bewerken
      </Button>
    </div>
  );
}
