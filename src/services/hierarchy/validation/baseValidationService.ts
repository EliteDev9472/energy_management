import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { TableName } from '../baseService';

/**
 * Base validation service that provides common validation functionality
 */
export class BaseValidationService {
  protected async validateTableFieldMatch(
    tableName: TableName, 
    recordId: string, 
    fieldName: string, 
    expectedValue: string
  ): Promise<boolean> {
    try {
      console.log(`Validating if ${tableName} ${recordId} has ${fieldName} = ${expectedValue}`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select(fieldName)
        .eq('id', recordId)
        .single();
      
      if (error) {
        console.error(`Error validating ${tableName} ${recordId}:`, error);
        return false;
      }
      
      return data && data[fieldName] === expectedValue;
    } catch (error) {
      console.error(`Error in validateTableFieldMatch:`, error);
      return false;
    }
  }
  
  protected async getFieldFromTable(
    tableName: TableName, 
    recordId: string, 
    fieldName: string
  ): Promise<string | null> {
    try {
      console.log(`Getting ${fieldName} from ${tableName} ${recordId}`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select(fieldName)
        .eq('id', recordId)
        .single();
      
      if (error) {
        console.error(`Error getting ${fieldName} from ${tableName} ${recordId}:`, error);
        return null;
      }
      
      if (!data) {
        console.log(`No ${tableName} found with ID ${recordId}`);
        return null;
      }
      
      if (!data[fieldName]) {
        console.log(`No ${fieldName} found for ${tableName} ${recordId}`);
        return null;
      }
      
      console.log(`Found ${fieldName} ${data[fieldName]} for ${tableName} ${recordId}`);
      return data[fieldName];
    } catch (error) {
      console.error(`Error in getFieldFromTable:`, error);
      return null;
    }
  }
  
  // Utility method to display validation errors
  protected showValidationError(message: string): void {
    toast({
      title: "Validation Error",
      description: message,
      variant: "destructive",
    });
  }
}
