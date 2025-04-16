
import type { Json } from '@/integrations/supabase/types';

/**
 * Safely casts JSON data from Supabase to a specific type
 */
export function castJsonToType<T>(jsonData: Json | null, defaultValue: T): T {
  if (!jsonData) return defaultValue;
  
  try {
    if (Array.isArray(jsonData)) {
      return jsonData as unknown as T;
    }
    return jsonData as unknown as T;
  } catch (error) {
    console.error('Error casting JSON data:', error);
    return defaultValue;
  }
}

/**
 * Converts a value to a Json type for Supabase
 */
export function convertToJson<T>(value: T): Json {
  return value as unknown as Json;
}
