
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Edit, Upload, Loader2, Save } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export function ProfileInfo() {
  const { user, userProfile } = useAuth();
  const { settings, loading, updateSettings } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  
  // Mock user data for demonstration
  const userData = {
    role: userProfile?.role || "Client",
    organization: userProfile?.organizationName || "Cedrus Energy",
    joinDate: "01-01-2023",
    completedProjects: 12,
    activeProjects: 3,
  };

  const handleUploadAvatar = () => {
    // In a real app, we would handle file upload
    toast({
      title: "Avatar upload",
      description: "Deze functie is momenteel in ontwikkeling.",
    });
  };

  const startEditing = () => {
    setEditedName(settings.name || user?.user_metadata?.name || '');
    setEditedEmail(settings.email || user?.email || '');
    setIsEditing(true);
  };

  const saveChanges = () => {
    updateSettings({
      name: editedName,
      email: editedEmail
    });
    
    toast({
      title: "Profiel bijgewerkt",
      description: "Uw profielwijzigingen zijn opgeslagen.",
    });
    
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Profiel Informatie</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-cedrus-blue" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Profiel Informatie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={settings.name || user?.user_metadata?.name || "Gebruiker"} />
              <AvatarFallback className="text-2xl">{(settings.name || user?.user_metadata?.name || "Gebruiker").split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute bottom-0 right-0 rounded-full h-8 w-8"
              onClick={handleUploadAvatar}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="text-lg font-medium mt-4">{settings.name || user?.user_metadata?.name || "Gebruiker"}</h3>
          <Badge className="mt-1 bg-cedrus-accent">{userData.role}</Badge>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold">Basis Informatie</h4>
            {isEditing ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={saveChanges}
                className="h-8"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                Opslaan
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={startEditing}
                className="h-8"
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                Bewerken
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-muted-foreground">E-mail</div>
            {isEditing ? (
              <input 
                type="email" 
                value={editedEmail} 
                onChange={(e) => setEditedEmail(e.target.value)}
                className="border rounded px-2 py-1"
              />
            ) : (
              <div className="font-medium">{settings.email || user?.email || "Niet ingesteld"}</div>
            )}
            
            <div className="text-muted-foreground">Naam</div>
            {isEditing ? (
              <input 
                type="text" 
                value={editedName} 
                onChange={(e) => setEditedName(e.target.value)}
                className="border rounded px-2 py-1"
              />
            ) : (
              <div className="font-medium">{settings.name || user?.user_metadata?.name || "Niet ingesteld"}</div>
            )}
            
            <div className="text-muted-foreground">Taal</div>
            <div className="font-medium">
              {settings.language === 'nl' ? 'Nederlands' : 
               settings.language === 'en' ? 'Engels' : 
               'Niet ingesteld'}
            </div>
            
            <div className="text-muted-foreground">Thema</div>
            <div className="font-medium">
              {settings.theme === 'light' ? 'Licht' : 
               settings.theme === 'dark' ? 'Donker' : 
               settings.theme === 'system' ? 'Systeemvoorkeur' : 
               'Niet ingesteld'}
            </div>
            
            <div className="text-muted-foreground">Organisatie</div>
            <div className="font-medium">{userData.organization}</div>
            
            <div className="text-muted-foreground">Lid sinds</div>
            <div className="font-medium">{userData.joinDate}</div>
          </div>
          
          <Separator className="my-4" />
          
          <h4 className="text-sm font-semibold">Statistieken</h4>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-muted-foreground">Actieve projecten</div>
            <div className="font-medium">{userData.activeProjects}</div>
            
            <div className="text-muted-foreground">Voltooide projecten</div>
            <div className="font-medium">{userData.completedProjects}</div>
            
            <div className="text-muted-foreground">Notificaties</div>
            <div className="font-medium">{settings.notifications ? 'Ingeschakeld' : 'Uitgeschakeld'}</div>
            
            <div className="text-muted-foreground">Marketing e-mails</div>
            <div className="font-medium">{settings.marketing_emails ? 'Ingeschakeld' : 'Uitgeschakeld'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
