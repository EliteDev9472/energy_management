
import { Complex } from '@/types/hierarchy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MapPin, Calendar } from 'lucide-react';

interface ComplexInfoTabProps {
  complex: Complex;
}

export function ComplexInfoTab({ complex }: ComplexInfoTabProps) {
  // Format the creation date if available
  const formattedCreationDate = complex.created_at
    ? new Date(complex.created_at).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    : 'Onbekend';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-cedrus-blue" />
            Complex gegevens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Naam</h3>
              <p className="text-base">{complex.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Aangemaakt op</h3>
              <p className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formattedCreationDate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cedrus-blue" />
            Locatie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Adres</h3>
              <p className="text-base">{complex.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Postcode</h3>
              <p className="text-base">{complex.postalcode || complex.postal_code}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Plaats</h3>
              <p className="text-base">{complex.city}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {complex.description && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Beschrijving</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base whitespace-pre-line">{complex.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
