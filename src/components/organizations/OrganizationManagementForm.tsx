
import { ShieldCheck, AlertTriangle, Upload, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { type OrganizationWithDeletionInfo } from '@/services/organizations';
import { getTimeRemaining } from '@/utils/dateUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

interface OrganizationManagementFormProps {
  organization: OrganizationWithDeletionInfo;
  onUpdate: (updatedData: Partial<OrganizationWithDeletionInfo>) => Promise<void>;
  onMarkForDeletion: () => void;
  onCancelDeletion: () => void;
  onMandateUpload: (file: File) => Promise<void>;
  mandateFilePath?: string;
}

export function OrganizationManagementForm({ 
  organization,
  onUpdate,
  onMarkForDeletion,
  onCancelDeletion,
  onMandateUpload,
  mandateFilePath
}: OrganizationManagementFormProps) {
  const [hasMandate, setHasMandate] = useState(organization.hasMandate || false);
  const [consultant, setConsultant] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleMandateChange = async (checked: boolean) => {
    setIsSubmitting(true);
    setHasMandate(checked);
    
    try {
      await onUpdate({ hasMandate: checked });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleConsultantChange = async (value: string) => {
    setConsultant(value);
    // In a real application, this would update the assigned consultant ID
    // await onUpdate({ assignedConsultantId: value });
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      await onMandateUpload(file);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const isPendingDeletion = organization.pendingDeletion && organization.scheduledDeletionTime;
  const timeRemaining = isPendingDeletion 
    ? getTimeRemaining(organization.scheduledDeletionTime!) 
    : '';
  
  const hasMandateFile = !!mandateFilePath;
  
  return (
    <Card className={isPendingDeletion ? "border-destructive" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isPendingDeletion ? (
            <AlertTriangle className="h-5 w-5 text-destructive" />
          ) : (
            <ShieldCheck className="h-5 w-5 text-cedrus-accent" />
          )}
          Beheer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPendingDeletion ? (
          <div className="bg-destructive/10 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="font-medium text-destructive">Deze organisatie wordt verwijderd</span>
            </div>
            <p className="text-sm text-muted-foreground">{timeRemaining}</p>
            <Button 
              variant="outline" 
              onClick={onCancelDeletion}
              className="w-full"
            >
              Annuleer verwijdering
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="consultantSelect">Toegewezen consultant</Label>
              <Select value={consultant} onValueChange={handleConsultantChange}>
                <SelectTrigger id="consultantSelect">
                  <SelectValue placeholder="Selecteer een consultant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultant1">Jan Jansen</SelectItem>
                  <SelectItem value="consultant2">Piet Peters</SelectItem>
                  <SelectItem value="consultant3">Klaas Klaassen</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Alleen zichtbaar voor beheerders.</p>
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="mandate">Heeft volmacht</Label>
                <p className="text-xs text-muted-foreground">De organisatie heeft een getekend volmacht aangeleverd.</p>
              </div>
              <Switch
                id="mandate"
                checked={hasMandate}
                onCheckedChange={handleMandateChange}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Volmacht document</Label>
              <div className="flex gap-2">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
                <Button 
                  variant="outline" 
                  type="button" 
                  className="flex-1"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploaden..." : "Upload volmacht"}
                </Button>
                
                {hasMandateFile && (
                  <Button 
                    variant="outline" 
                    type="button"
                    className="flex-1"
                    onClick={() => window.open(mandateFilePath, '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Bekijk volmacht
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Upload een ondertekend volmacht document (.pdf, .docx, .jpg, .png).</p>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10">
                  Verwijder deze organisatie
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Deze actie plant de verwijdering van de organisatie over 24 uur. 
                    Je kunt de verwijdering binnen 24 uur nog annuleren.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuleren</AlertDialogCancel>
                  <AlertDialogAction onClick={onMarkForDeletion} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Verwijderen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </CardContent>
    </Card>
  );
}
