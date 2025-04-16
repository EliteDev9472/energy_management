import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { MoreHorizontal, FileEdit, Trash2, Eye } from "lucide-react";
import { Connection, ColumnVisibility } from "@/types/connection";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { TypeBadge } from "./TypeBadge";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";
import { deleteConnection } from "@/services/connections/deleteConnection";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface ConnectionsTableRowProps {
  connection: Connection;
  columnVisibility: ColumnVisibility;
  onConnectionClick: (connectionId: string) => void;
  onDelete?: () => void;
  isSelected?: boolean;
  onSelect?: (connectionId: string, checked: boolean) => void;
}

export const ConnectionsTableRow = ({ 
  connection, 
  columnVisibility, 
  onConnectionClick,
  onDelete,
  isSelected = false,
  onSelect
}: ConnectionsTableRowProps) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleViewClick = () => {
    navigate(`/connections/${connection.id}`);
  };
  
  const handleEditClick = () => {
    navigate(`/connections/${connection.id}/edit`);
    toast({
      title: "Bewerken gestart",
      description: `Aansluiting ${connection.ean} wordt bewerkt.`
    });
  };
  
  const handleDeleteClick = async () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const success = await deleteConnection(connection.id);
      
      if (success) {
        toast({
          title: "Verwijderd",
          description: `Aansluiting ${connection.ean || connection.address} is verwijderd.`,
        });
        
        // Call the onDelete callback if provided
        if (onDelete) {
          onDelete();
        }
      }
    } catch (error) {
      console.error("Error deleting connection:", error);
      toast({
        title: "Fout bij verwijderen",
        description: "Er is een fout opgetreden bij het verwijderen van de aansluiting.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (onSelect) {
      onSelect(connection.id, checked);
    }
  };
  
  return (
    <>
      <TableRow 
        key={connection.id} 
        className={`hover:bg-muted/50 cursor-pointer ${isSelected ? 'bg-muted/30' : ''}`}
        onClick={() => onConnectionClick(connection.id)}
      >
        <TableCell onClick={(e) => e.stopPropagation()} className="w-[50px]">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
          />
        </TableCell>
        
        {columnVisibility.ean && (
          <TableCell>
            <div className="font-medium">{connection.ean}</div>
            {connection.capacity && (
              <div className="text-xs text-muted-foreground mt-1">
                {connection.capacity}
              </div>
            )}
          </TableCell>
        )}
        
        {columnVisibility.address && (
          <TableCell>
            <div>{connection.address}</div>
            <div className="text-xs text-muted-foreground">{connection.postalCode} {connection.city}</div>
          </TableCell>
        )}
        
        {columnVisibility.type && (
          <TableCell>
            <TypeBadge type={connection.type} />
          </TableCell>
        )}
        
        {columnVisibility.status && (
          <TableCell>
            <StatusBadge status={connection.status} />
          </TableCell>
        )}
        
        {columnVisibility.supplier && (
          <TableCell>{connection.supplier}</TableCell>
        )}
        
        {columnVisibility.object && (
          <TableCell>
            <div>{connection.object}</div>
            <div className="text-xs text-muted-foreground">{connection.entity}</div>
          </TableCell>
        )}
        
        {columnVisibility.gridOperator && (
          <TableCell>{connection.gridOperator}</TableCell>
        )}

        {columnVisibility.hasFeedback && (
          <TableCell>{connection.hasFeedback ? "Ja" : "Nee"}</TableCell>
        )}

        {columnVisibility.plannedConnectionDate && (
          <TableCell>
            {connection.plannedConnectionDate && new Date(connection.plannedConnectionDate).toLocaleDateString('nl-NL')}
          </TableCell>
        )}
        
        {columnVisibility.actions && (
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acties</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewClick(); }}>
                  <Eye className="mr-2 h-4 w-4" />
                  Bekijken
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditClick(); }}>
                  <FileEdit className="mr-2 h-4 w-4" />
                  Bewerken
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); handleDeleteClick(); }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Verwijderen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        )}
      </TableRow>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aansluiting verwijderen</AlertDialogTitle>
            <AlertDialogDescription>
              Weet je zeker dat je deze aansluiting wilt verwijderen?
              {connection.ean && (
                <div className="mt-2 font-medium">
                  EAN: {connection.ean}
                </div>
              )}
              <div className="mt-1">
                {connection.address}, {connection.postalCode} {connection.city}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuleren</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { 
                e.preventDefault(); 
                confirmDelete(); 
              }}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Bezig met verwijderen..." : "Verwijderen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
