
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch contract details for a connection
 */
export const fetchContractDetails = async (connectionId: string) => {
  try {
    const { data: contractData, error: contractError } = await supabase
      .from('connection_contract_details')
      .select('*')
      .eq('connection_id', connectionId)
      .maybeSingle();

    if (contractError) {
      console.error(`Error fetching contract details for connection ${connectionId}:`, contractError);
      return null;
    }

    return contractData;
  } catch (contractError) {
    console.error(`Error processing contract data:`, contractError);
    return null;
  }
};
