
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface ConnectionDetailActionsProps {
  connectionId: string;
}

export function ConnectionDetailActions({ connectionId }: ConnectionDetailActionsProps) {
  const navigate = useNavigate();
  
  const handleGenerateDocument = () => {
    toast({
      title: "Document gegenereerd",
      description: "Het document wordt gedownload."
    });
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/connections/${connectionId}/edit`);
    toast({
      title: "Bewerken gestart",
      description: "Aansluiting wordt bewerkt."
    });
  };
  
  return (
    <div className="mt-8 flex justify-between">
      <Button 
        variant="outline" 
        onClick={() => navigate('/connections')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Terug naar overzicht
      </Button>
      
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={handleEditClick}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Bewerken
        </Button>
        
        <Button 
          variant="default"
          onClick={handleGenerateDocument}
        >
          <FileText className="h-4 w-4 mr-2" />
          Genereer document
        </Button>
      </div>
    </div>
  );
}
