
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface OrganizationDeletionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  organizationName: string;
}

export function OrganizationDeletionDialog({
  open,
  onClose,
  onConfirm,
  organizationName,
}: OrganizationDeletionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Organisatie verwijderen
          </DialogTitle>
          <DialogDescription>
            Je staat op het punt om de organisatie "{organizationName}" te verwijderen. 
            Dit proces wordt na 30 dagen definitief.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Let op: Deze actie zal de volgende gevolgen hebben:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>De organisatie wordt gemarkeerd voor verwijdering</li>
            <li>Na 30 dagen worden alle gegevens permanent verwijderd</li>
            <li>Entiteiten, categorieën en projecten verbonden aan deze organisatie worden ook verwijderd</li>
            <li>Je kunt deze actie annuleren binnen de 30 dagen periode</li>
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuleren
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Verwijderen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
