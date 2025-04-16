
import { useState, useEffect } from 'react';
import { Complex } from '@/types/hierarchy';
import { complexService, hierarchyService } from '@/services/hierarchy';
import { toast } from '@/hooks/use-toast';

export function useComplexes() {
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchComplexes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await complexService.getComplexes();
        setComplexes(data);
      } catch (err) {
        console.error('Error fetching complexes:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch complexes'));
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van complexen.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComplexes();
  }, []);

  return { complexes, loading, error };
}

export function useComplexById(complexId: string | undefined) {
  const [complex, setComplex] = useState<Complex | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!complexId) return;

    const fetchComplex = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await complexService.getComplexById(complexId);
        setComplex(data);
      } catch (err) {
        console.error(`Error fetching complex ${complexId}:`, err);
        setError(err instanceof Error ? err : new Error(`Failed to fetch complex ${complexId}`));
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van het complex.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComplex();
  }, [complexId]);

  return { complex, loading, error };
}

export function useComplexesByProject(projectId: string | undefined) {
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchComplexes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await hierarchyService.getComplexesByProject(projectId);
        setComplexes(data);
      } catch (err) {
        console.error(`Error fetching complexes for project ${projectId}:`, err);
        setError(err instanceof Error ? err : new Error(`Failed to fetch complexes for project ${projectId}`));
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van complexen.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComplexes();
  }, [projectId]);

  return { complexes, loading, error };
}
