
import { useState, useEffect } from 'react';
import { Complex, HierarchyObject } from '@/types/hierarchy';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Home, Plus, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { hierarchyService } from '@/services/hierarchyService';
import { ConnectionsList } from './ConnectionsList';
import { objectService } from '@/services/hierarchy/objectService';
import { mapDbToObject } from '@/services/hierarchy/helpers';

interface ComplexObjectsProps {
  complex: Complex;
}

export function ComplexObjects({ complex }: ComplexObjectsProps) {
  const [objects, setObjects] = useState<HierarchyObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedObjects, setExpandedObjects] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchObjects() {
      setLoading(true);
      try {
        const fetchedObjects = await hierarchyService.getObjectsByComplexId(complex.id);
        // Map database objects to HierarchyObject type
        setObjects(fetchedObjects);
      } catch (error) {
        console.error('Error fetching objects for complex:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchObjects();
  }, [complex.id]);

  const toggleObject = (objectId: string) => {
    setExpandedObjects(prev => ({
      ...prev,
      [objectId]: !prev[objectId]
    }));
  };

  const handleAddConnection = (e: React.MouseEvent, objectId: string) => {
    e.stopPropagation();
    navigate(`/connections/new?objectId=${objectId}`);
  };

  const getObjectTypeBadge = (type?: string) => {
    switch (type) {
      case 'woning':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Woning</Badge>;
      case 'utiliteit':
        return <Badge variant="outline" className="border-purple-500 text-purple-700">Utiliteit</Badge>;
      case 'installatie':
        return <Badge variant="outline" className="border-orange-500 text-orange-700">Installatie</Badge>;
      case 'techniek':
        return <Badge variant="outline" className="border-teal-500 text-teal-700">Techniek</Badge>;
      case 'bouwvoorziening':
        return <Badge variant="outline" className="border-amber-500 text-amber-700">Bouwvoorziening</Badge>;
      default:
        return <Badge variant="outline">Overig</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cedrus-accent mx-auto"></div>
      </div>
    );
  }

  if (objects.length === 0) {
    return (
      <div className="p-8 text-center">
        <Home className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
        <h3 className="text-md font-medium mb-2">Geen objecten in dit complex</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Er zijn nog geen objecten toegevoegd aan dit complex.
        </p>
        <Button 
          size="sm"
          onClick={() => navigate(`/objects/new?complexId=${complex.id}`)}
          className="bg-cedrus-accent hover:bg-cedrus-accent/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Object Toevoegen
        </Button>
      </div>
    );
  }

  return (
    <div className="divide-y">
      <div className="p-3 bg-muted/30">
        <h3 className="font-medium text-sm ml-10">Objecten</h3>
      </div>
      {objects.map(object => (
        <div key={object.id} className="bg-white">
          <div 
            className="flex items-center gap-2 p-3 pl-10 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => toggleObject(object.id)}
          >
            <button className="p-1 rounded-full hover:bg-muted">
              {expandedObjects[object.id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            
            <Home className="h-4 w-4 text-blue-600" />
            
            <div className="flex-grow">
              <div className="font-medium text-sm">{object.name}</div>
              <div className="text-xs text-muted-foreground">
                {object.address}, {object.city}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {getObjectTypeBadge(object.objectType)}
              <Badge variant="outline" className="mr-2">
                {object.connectionCount || 0} aansluitingen
              </Badge>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto"
              onClick={(e) => handleAddConnection(e, object.id)}
            >
              <Plus className="h-3 w-3 mr-1" /> Aansluiting
            </Button>
          </div>
          
          {expandedObjects[object.id] && (
            <ConnectionsList objectId={object.id} />
          )}
        </div>
      ))}
    </div>
  );
}
