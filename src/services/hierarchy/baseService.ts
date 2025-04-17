
import { supabase } from '@/integrations/supabase/client';

// Define the valid table names
export type TableName =
  | 'organizations'
  | 'entities'
  | 'categories'
  | 'projects'
  | 'objects'
  | 'meters'
  | 'connections';

/**
 * Base service class that provides common CRUD operations for all hierarchy tables
 */
export class BaseService {
  private tableName: TableName;

  constructor(tableName: TableName) {
    this.tableName = tableName;
  }

  /**
   * Get all records from the table
   */
  async getAll<T>(): Promise<T[]> {
    try {
      console.log(`Getting all records from ${this.tableName}`);

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*');

      if (error) {
        console.error(`Error getting records from ${this.tableName}:`, error);
        throw error;
      }

      return data as T[];
    } catch (error) {
      console.error(`Error in getAll for ${this.tableName}:`, error);
      return [];
    }
  }

  /**
   * Get a record by its ID
   */
  async getById<T>(id: string): Promise<T | null> {
    try {
      console.log(`Getting ${this.tableName} by ID: ${id}`);

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error(`Error getting ${this.tableName} by ID ${id}:`, error);
        throw error;
      }

      return data as T;
    } catch (error) {
      console.error(`Error in getById for ${this.tableName} ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Get records by a specific field value
   */
  async getByField<T>(fieldName: string, value: string | number | boolean): Promise<T[]> {
    try {
      console.log(`Getting ${this.tableName} where ${fieldName}=${value}`);

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq(fieldName, value);

      if (error) {
        console.error(`Error getting ${this.tableName} by ${fieldName}=${value}:`, error);
        throw error;
      }

      return data as T[];
    } catch (error) {
      console.error(`Error in getByField for ${this.tableName} ${fieldName}=${value}:`, error);
      return [];
    }
  }

  /**
   * Create a new record
   */
  async create<T>(data: any, userId?: string): Promise<T> {
    try {
      console.log(`Creating new ${this.tableName}:`, data);

      // Add created_by and created_at fields if userId is provided
      const recordToInsert = userId
        ? { ...data, created_by: userId, created_at: new Date().toISOString() }
        : data;

      const { data: createdData, error } = await supabase
        .from(this.tableName)
        // .insert(recordToInsert)
        .select()
        .single();

      if (error) {
        console.error(`Error creating ${this.tableName}:`, error);
        throw error;
      }

      return createdData as T;
    } catch (error) {
      console.error(`Error in create for ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing record
   */
  async update<T>(id: string, data: any, userId?: string): Promise<T> {
    try {
      console.log(`Updating ${this.tableName} ${id}:`, data);

      // Add updated_by and updated_at fields if userId is provided
      const recordToUpdate = userId
        ? { ...data, updated_by: userId, updated_at: new Date().toISOString() }
        : data;

      const { data: updatedData, error } = await supabase
        .from(this.tableName)
        .update(recordToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating ${this.tableName} ${id}:`, error);
        throw error;
      }

      return updatedData as T;
    } catch (error) {
      console.error(`Error in update for ${this.tableName} ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a record
   */
  async delete(id: string): Promise<boolean> {
    try {
      console.log(`Deleting ${this.tableName} ${id}`);

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting ${this.tableName} ${id}:`, error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error(`Error in delete for ${this.tableName} ${id}:`, error);
      return false;
    }
  }
}
