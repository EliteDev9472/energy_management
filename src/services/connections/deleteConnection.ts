
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Delete a connection by ID
 */
export const deleteConnection = async (connectionId: string): Promise<boolean> => {
  try {
    // First delete any associated contract details
    const { error: contractError } = await supabase
      .from('connection_contract_details')
      .delete()
      .eq('connection_id', connectionId);

    if (contractError) {
      console.error('Error deleting connection contract details:', contractError);
      toast({
        title: "Fout bij verwijderen",
        description: "Kan contractgegevens niet verwijderen.",
        variant: "destructive",
      });
      return false;
    }

    // Delete any technical details
    const { error: technicalError } = await supabase
      .from('connection_technical_details')
      .delete()
      .eq('connection_id', connectionId);

    if (technicalError) {
      console.error('Error deleting connection technical details:', technicalError);
    }

    // Delete any usage data
    const { error: usageError } = await supabase
      .from('connection_usage')
      .delete()
      .eq('connection_id', connectionId);

    if (usageError) {
      console.error('Error deleting connection usage data:', usageError);
    }

    // Delete any documents
    const { error: docsError } = await supabase
      .from('connection_documents')
      .delete()
      .eq('connection_id', connectionId);

    if (docsError) {
      console.error('Error deleting connection documents:', docsError);
    }

    // Delete any history
    const { error: historyError } = await supabase
      .from('connection_history')
      .delete()
      .eq('connection_id', connectionId);

    if (historyError) {
      console.error('Error deleting connection history:', historyError);
    }

    // Then delete the connection itself
    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('id', connectionId);

    if (error) {
      console.error('Error deleting connection:', error);
      toast({
        title: "Fout bij verwijderen",
        description: "Kan aansluiting niet verwijderen: " + error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Aansluiting verwijderd",
      description: "De aansluiting is succesvol verwijderd.",
    });
    
    return true;
  } catch (error) {
    console.error('Error in deleteConnection:', error);
    toast({
      title: "Fout bij verwijderen",
      description: "Er is een onverwachte fout opgetreden bij het verwijderen van de aansluiting.",
      variant: "destructive",
    });
    return false;
  }
};
