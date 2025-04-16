
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Clock, Info, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function MeterReadingPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    dateRead: new Date().toISOString().split('T')[0],
    peak: '',
    offPeak: '',
    gas: '',
    photo: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate inputs
    if (!formData.peak && !formData.offPeak && !formData.gas) {
      toast({
        title: "Invoer ontbreekt",
        description: "Vul minimaal één meterstand in",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Meterstand doorgegeven",
        description: "Uw meterstand is succesvol geregistreerd",
      });
      setIsSubmitting(false);
      navigate(`/connections/${id}`);
    }, 1500);
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(`/connections/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Meterstand Doorgeven</h1>
            <p className="text-muted-foreground mt-1">
              Geef uw actuele meterstanden door
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meterstanden</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="dateRead">Opnamedatum</Label>
                <Input 
                  id="dateRead"
                  type="date"
                  value={formData.dateRead}
                  onChange={(e) => handleInputChange('dateRead', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">Elektriciteit</h3>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="peak">Piek (hoog tarief)</Label>
                    <div className="relative">
                      <Input 
                        id="peak"
                        type="number"
                        placeholder="12345"
                        value={formData.peak}
                        onChange={(e) => handleInputChange('peak', e.target.value)}
                      />
                      <div className="absolute right-3 top-0 h-full flex items-center text-sm text-muted-foreground">
                        kWh
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="offPeak">Dal (laag tarief)</Label>
                    <div className="relative">
                      <Input 
                        id="offPeak"
                        type="number"
                        placeholder="12345"
                        value={formData.offPeak}
                        onChange={(e) => handleInputChange('offPeak', e.target.value)}
                      />
                      <div className="absolute right-3 top-0 h-full flex items-center text-sm text-muted-foreground">
                        kWh
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">Gas</h3>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="gas">Gasmeterstand</Label>
                    <div className="relative">
                      <Input 
                        id="gas"
                        type="number"
                        placeholder="1234"
                        value={formData.gas}
                        onChange={(e) => handleInputChange('gas', e.target.value)}
                      />
                      <div className="absolute right-3 top-0 h-full flex items-center text-sm text-muted-foreground">
                        m³
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photo">Foto van meterstand (optioneel)</Label>
                <div className="border rounded-md p-4">
                  <label htmlFor="photo" className="flex flex-col items-center gap-2 cursor-pointer">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formData.photo ? formData.photo.name : "Klik om een foto te uploaden"}
                    </span>
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md flex gap-2">
                <Info className="h-5 w-5 text-cedrus-accent flex-shrink-0" />
                <div className="text-sm space-y-2">
                  <p>
                    Tips voor het doorgeven van uw meterstanden:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Lees de cijfers van links naar rechts</li>
                    <li>Noteer alleen de cijfers vóór de komma of rode cijfers</li>
                    <li>Voeg een foto toe voor extra nauwkeurigheid</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => navigate(`/connections/${id}`)}>
                  Annuleren
                </Button>
                <Button 
                  type="submit" 
                  className="bg-cedrus-accent hover:bg-cedrus-accent/90 flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      Verwerken...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Versturen
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
