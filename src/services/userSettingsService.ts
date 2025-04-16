
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface UserSettings {
  id: string;
  name: string;
  email: string;
  language: string;
  theme: string;
  marketing_emails: boolean;
  notifications?: boolean;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export const getUserSettings = async (): Promise<UserSettings | null> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      console.error('No active session found');
      return null;
    }
    
    console.log("Fetching settings for user ID:", session.session.user.id);
    
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', session.session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user settings:', error);
      return null;
    }
    
    console.log("Retrieved user settings:", data);
    return data as UserSettings;
  } catch (error) {
    console.error('Failed to get user settings:', error);
    return null;
  }
};

export const updateUserSettings = async (settings: Partial<UserSettings>): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      console.error('No active session found');
      return false;
    }
    
    console.log("Updating settings for user ID:", session.session.user.id, "with data:", settings);
    
    const { error } = await supabase
      .from('user_settings')
      .update(settings)
      .eq('id', session.session.user.id);
    
    if (error) {
      console.error('Error updating user settings:', error);
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van uw instellingen.",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Instellingen bijgewerkt",
      description: "Uw wijzigingen zijn succesvol opgeslagen.",
    });
    console.log("Settings successfully updated");
    return true;
  } catch (error) {
    console.error('Failed to update user settings:', error);
    toast({
      title: "Fout bij opslaan",
      description: "Er is een fout opgetreden bij het opslaan van uw instellingen.",
      variant: "destructive",
    });
    return false;
  }
};
