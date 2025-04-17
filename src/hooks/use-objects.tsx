
import { useState, useEffect } from 'react';
import { HierarchyObject } from '@/types/hierarchy';
import { objectService, hierarchyService } from '@/services/hierarchy';
import { toast } from '@/hooks/use-toast';

interface UseObjectsOptions {
  enabled?: boolean;
}

export function useObjects(options: UseObjectsOptions = {}) {
  const { enabled = true } = options;
  const [objects, setObjects] = useState<HierarchyObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchObjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await objectService.getObjects();
        setObjects(data);
      } catch (err) {
        console.error('Error fetching objects:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch objects'));
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van objecten.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, [enabled]);

  return { objects, loading, error };
}

export function useObjectById(objectId: string | undefined) {
  const [fetchObject, setFetchObject] = useState<HierarchyObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!objectId) return;

    const fetchObject = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await objectService.getObjectById(objectId);
        setFetchObject(data);
      } catch (err) {
        console.error(`Error fetching object ${objectId}:`, err);
        setError(err instanceof Error ? err : new Error(`Failed to fetch object ${objectId}`));
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van het object.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchObject();
  }, [objectId]);

  return { fetchObject, loading, error };
}

export function useObjectsByComplex(complexId: string | undefined) {
  const [objects, setObjects] = useState<HierarchyObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!complexId) return;

    const fetchObjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await objectService.getObjectsByComplex(complexId);
        setObjects(data);
      } catch (err) {
        console.error(`Error fetching objects for complex ${complexId}:`, err);
        setError(err instanceof Error ? err : new Error(`Failed to fetch objects for complex ${complexId}`));
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van objecten.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, [complexId]);

  return { objects, loading, error };
}

export function useObjectsByProject(projectId: string | undefined) {
  const [objects, setObjects] = useState<HierarchyObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchObjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await hierarchyService.getObjectsByProject(projectId);
        setObjects(data);
      } catch (err) {
        console.error(`Error fetching objects for project ${projectId}:`, err);
        setError(err instanceof Error ? err : new Error(`Failed to fetch objects for project ${projectId}`));
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van objecten.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, [projectId]);

  return { objects, loading, error };
}
