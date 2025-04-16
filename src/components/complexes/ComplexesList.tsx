
import { useState } from 'react';
import { Complex } from '@/types/hierarchy';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, ChevronDown, ChevronRight, Home, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ComplexObjects } from './ComplexObjects';

interface ComplexesListProps {
  complexes: Complex[];
}

export function ComplexesList({ complexes }: ComplexesListProps) {
  const [expandedComplexes, setExpandedComplexes] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const toggleComplex = (complexId: string) => {
    setExpandedComplexes(prev => ({
      ...prev,
      [complexId]: !prev[complexId]
    }));
  };

  const handleAddObject = (e: React.MouseEvent, complexId: string) => {
    e.stopPropagation();
    navigate(`/objects/new?complexId=${complexId}`);
  };

  if (complexes.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">Geen complexen gevonden</h3>
          <p className="text-muted-foreground mb-4">
            Er zijn nog geen complexen aangemaakt of uw zoekopdracht heeft geen resultaten opgeleverd.
          </p>
          <Button 
            onClick={() => navigate('/complexes/new')}
            className="bg-cedrus-accent hover:bg-cedrus-accent/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Complex Toevoegen
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {complexes.map((complex) => (
        <Card key={complex.id} className="overflow-hidden">
          <div 
            className="flex items-center gap-2 p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors"
            onClick={() => toggleComplex(complex.id)}
          >
            <button className="p-1 rounded-full hover:bg-muted">
              {expandedComplexes[complex.id] ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
            
            <Building2 className="h-5 w-5 text-cedrus-blue" />
            
            <div className="flex-grow">
              <div className="font-medium">{complex.name}</div>
              <div className="text-sm text-muted-foreground">
                {complex.address}, {complex.city}
              </div>
            </div>
            
            <Badge variant="outline" className="mr-2">
              {complex.objects?.length || 0} objecten
            </Badge>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto"
              onClick={(e) => handleAddObject(e, complex.id)}
            >
              <Plus className="h-4 w-4 mr-1" /> Object
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/complexes/${complex.id}`);
              }}
            >
              Details
            </Button>
          </div>
          
          {expandedComplexes[complex.id] && (
            <ComplexObjects complex={complex} />
          )}
        </Card>
      ))}
    </div>
  );
}
