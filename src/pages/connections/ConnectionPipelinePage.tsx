import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, FileText, FilterIcon, DownloadIcon, Zap, Gauge } from 'lucide-react';
import { EnergyConnectionPipeline } from '@/components/connections/pipeline/EnergyConnectionPipeline';
import { EnergyConnection } from '@/types/connection';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';
import { EanCodeLookup } from '@/components/connections/forms/EanCodeLookup';
import { EanCodeInfo } from '@/utils/eanUtils';
import { MeterTypeSelector } from '@/components/connections/forms/MeterTypeSelector';
import { energyConnectionService } from '@/services/connections/energyConnectionService';
import { ConnectionRequestStatus } from '@/types/connection/pipeline';

interface NewConnectionFormValues {
  address: string;
  city: string;
  postalCode: string;
  type: string;
  meterRole: 'main' | 'submeter' | 'mloea';
  capacity: string;
  gridOperator: string;
  ean: string;
  desiredConnectionDate: string;is
}

const gasCapacityOptions = [
  { value: 'G1.6', label: 'G1.6', description: 'Zeer kleinverbruiker (vaak niet meer toegepast)' },
  { value: 'G2.5', label: 'G2.5', description: 'Kleinverbruiker – oude norm, zelden nieuw' },
  { value: 'G4', label: 'G4', description: 'Standaard aansluiting voor kleine woningen' },
  { value: 'G6', label: 'G6', description: 'Veel gebruikt in woningen met combiketel' },
  { value: 'G10', label: 'G10', description: 'Grotere huishoudens / lichte utiliteit' },
  { value: 'G16', label: 'G16', description: 'Utiliteit / kleine bedrijven' },
  { value: 'G25', label: 'G25', description: 'Zwaardere utiliteit – horeca, kleine industrie' },
  { value: '>G25', label: '>G25 (maatwerk)', description: 'Grootverbruiker, altijd via netbeheerder en engineeringstraject' }
];

const electricityCapacityOptions = [
  { value: '1x25A', label: '1x25A', description: 'Enkel-fase, standaard voor lichte woningbouw' },
  { value: '1x35A', label: '1x35A', description: 'Enkel-fase, zwaarder gebruik (bijv. warmtepomp)' },
  { value: '3x25A', label: '3x25A', description: 'Drie-fase, standaard voor nieuwbouwwoningen' },
  { value: '3x35A', label: '3x35A', description: 'Drie-fase, licht verhoogde capaciteit' },
  { value: '3x50A', label: '3x50A', description: 'Zwaardere drie-fase aansluiting' },
  { value: '3x63A', label: '3x63A', description: 'Veel gebruikt in utiliteit en appartementencomplexen' },
  { value: '3x80A', label: '3x80A', description: 'Hoge verbruiker of kleinzakelijk gebruik' },
  { value: '>80A', label: '>80A (maatwerk)', description: 'Grootverbruiker – op aanvraag bij netbeheerder' }
];

const waterCapacityOptions = [
  { value: 'Q3-2.5', label: 'Q3-2.5', description: 'Standaard huishoudelijk' },
  { value: 'Q3-4', label: 'Q3-4', description: 'Groter huishoudelijk / klein zakelijk' },
  { value: 'Q3-6.3', label: 'Q3-6.3', description: 'Klein zakelijk' },
  { value: 'Q3-10', label: 'Q3-10', description: 'Zakelijk' },
  { value: 'Q3-16', label: 'Q3-16', description: 'Groot zakelijk' }
];

const heatCapacityOptions = [
  { value: 'klein', label: 'Klein (<100 kW)', description: 'Voor woningen en kleine bedrijfspanden' },
  { value: 'middel', label: 'Middel (100-200 kW)', description: 'Voor grotere bedrijfspanden' },
  { value: 'groot', label: 'Groot (>200 kW)', description: 'Voor grote gebouwen en complexen' }
];

export default function ConnectionPipelinePage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [connections, setConnections] = useState<EnergyConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newConnectionDialogOpen, setNewConnectionDialogOpen] = useState(false);

  const form = useForm<NewConnectionFormValues>({
    defaultValues: {
      address: '',
      city: '',
      postalCode: '',
      type: 'electricity',
      meterRole: 'main',
      capacity: '3x25A',
      gridOperator: 'liander',
      ean: '',
      desiredConnectionDate: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString().split('T')[0]
    }
  });

  const selectedType = form.watch('type');

  useEffect(() => {
    if (selectedType === 'electricity') {
      form.setValue('capacity', '3x25A');
    } else if (selectedType === 'gas') {
      form.setValue('capacity', 'G4');
    } else if (selectedType === 'water') {
      form.setValue('capacity', 'Q3-2.5');
    } else if (selectedType === 'heat') {
      form.setValue('capacity', 'klein');
    }
  }, [selectedType, form]);

  useEffect(() => {
    const fetchConnections = async () => {
      setIsLoading(true);
      try {
        if (projectId) {
          const data = await energyConnectionService.getEnergyConnectionsByProjectId(projectId);
          setConnections(data);
        } else {
          // If no project ID, fetch all connections
          const data = await energyConnectionService.getEnergyConnections();
          setConnections(data);
        }
      } catch (error) {
        console.error("Error fetching connections:", error);
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van de aansluitingen.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, [projectId]);

  const handleNewConnection = () => {
    setNewConnectionDialogOpen(true);
  };

  const getCapacityOptions = () => {
    switch (selectedType) {
      case 'electricity':
        return electricityCapacityOptions;
      case 'gas':
        return gasCapacityOptions;
      case 'water':
        return waterCapacityOptions;
      case 'heat':
        return heatCapacityOptions;
      default:
        return [];
    }
  };

  const handleEanCodeFound = (info: EanCodeInfo) => {
    form.setValue('address', info.address);
    form.setValue('city', info.city);
    form.setValue('postalCode', info.postalCode);
    form.setValue('gridOperator', info.gridOperator);
    form.setValue('type', info.connectionType.toLowerCase());
    form.setValue('capacity', info.capacity);

    toast({
      title: "EAN code gevonden",
      description: "Adresgegevens zijn automatisch ingevuld.",
    });
  };

  const handleSubmitNewConnection = async (values: NewConnectionFormValues) => {
    if (!values.ean || values.ean.trim() === '') {
      toast({
        title: "Validatiefout",
        description: "EAN code is verplicht voor aansluitingen",
        variant: "destructive",
      });
      return;
    }

    try {
      const newConnection = await energyConnectionService.createEnergyConnection({
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
        type: values.type === 'electricity' ? 'Elektriciteit' :
          values.type === 'gas' ? 'Gas' :
            values.type === 'water' ? 'Water' : 'Warmte',
        status: "NEW",
        requestStatus: "NEW" as ConnectionRequestStatus,
        capacity: values.capacity,
        gridOperator: values.gridOperator,
        projectId: projectId,
        requestDate: new Date().toISOString(),
        desiredConnectionDate: new Date(values.desiredConnectionDate).toISOString(),
        meterRole: values.meterRole,
        ean: values.ean,
        objectName: "Object name"
      });

      if (newConnection) {
        setConnections([...connections, newConnection]);

        toast({
          title: "Nieuwe aansluitaanvraag",
          description: "De aanvraag is succesvol aangemaakt."
        });

        setNewConnectionDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating connection:', error);
      toast({
        title: "Fout bij aanmaken",
        description: "Er is een fout opgetreden bij het aanmaken van de aansluitaanvraag.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = () => {
    toast({
      title: "Export gestart",
      description: "De rapportage wordt geëxporteerd naar PDF."
    });
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/connections')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Terug
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Nieuwe aansluiting aanvragen</h1>
              <p className="text-muted-foreground mt-1">Beheer het proces van energieaansluitingen</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/connections')}>
              <FilterIcon className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <DownloadIcon className="h-4 w-4 mr-2" /> Exporteer
            </Button>
            <Button onClick={handleNewConnection}>
              <Plus className="h-4 w-4 mr-2" /> Nieuwe aanvraag
            </Button>
          </div>
        </div>

        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3 text-blue-800">
          <FileText className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Over het aansluitingsproces</p>
            <p className="text-sm mt-1">
              Dit proces volgt de aanvraag tot realisatie van aansluitingen bij netbeheerders zoals gebruikt in MijnAansluiting.nl.
              Sleep aanvragen naar een volgende fase of gebruik de actieknoppen om de status bij te werken.
            </p>
          </div>
        </div>

        <div className="w-full overflow-auto">
          <ScrollArea className="w-full" orientation="horizontal">
            <div className="min-w-[1200px] pb-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent"></div>
                </div>
              ) : (
                <EnergyConnectionPipeline
                  projectId={projectId || ""}
                  connections={connections}
                  setConnections={setConnections}
                />
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <Dialog open={newConnectionDialogOpen} onOpenChange={setNewConnectionDialogOpen}>
        <DialogContent withScroll className="md:max-w-[600px] max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Nieuwe aansluitaanvraag</DialogTitle>
            <DialogDescription>
              Voer de gegevens in voor de nieuwe energieaansluiting
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitNewConnection)} className="space-y-6">
              {/* Hierarchy information would go here in a real implementation */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Hiërarchie informatie</h3>
                <p className="text-xs text-muted-foreground">
                  In een volledig systeem zou hier de hiërarchie selectie komen (organisatie, entiteit, project, object)
                </p>
              </div>

              {/* EAN Code Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Identificatie</h3>
                <FormField
                  control={form.control}
                  name="ean"
                  render={({ field }) => (
                    <FormItem>
                      <EanCodeLookup
                        value={field.value || ""}
                        onChange={field.onChange}
                        onCodeFound={handleEanCodeFound}
                      />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Adresgegevens</h3>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Input placeholder="Hoofdstraat 12" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plaats</FormLabel>
                        <FormControl>
                          <Input placeholder="Amsterdam" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode</FormLabel>
                        <FormControl>
                          <Input placeholder="1234AB" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Connection Type Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Aansluiting Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          <FormLabel>Type aansluiting</FormLabel>
                        </div>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecteer type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="electricity">Elektriciteit</SelectItem>
                            <SelectItem value="gas">Gas</SelectItem>
                            <SelectItem value="water">Water</SelectItem>
                            <SelectItem value="heat">Warmte</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meterRole"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          <FormLabel>Type meter</FormLabel>
                        </div>
                        <MeterTypeSelector
                          value={field.value}
                          onChange={field.onChange}
                          className="mt-0"
                        />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Capacity Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Technische Gegevens</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Capaciteit</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground">
                                <HelpCircle className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="end">
                              <div className="p-4 bg-muted/50">
                                <h4 className="font-medium mb-2">Capaciteit uitleg</h4>
                                <div className="space-y-1 text-sm">
                                  {getCapacityOptions().map(option => (
                                    <div key={option.value} className="grid grid-cols-2 gap-1">
                                      <span className="font-medium">{option.label}</span>
                                      <span className="text-muted-foreground">{option.description}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecteer capaciteit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getCapacityOptions().map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex justify-between items-center w-full">
                                  <span>{option.label}</span>
                                  <span className="text-xs text-muted-foreground ml-2 truncate max-w-[200px]">{option.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gridOperator"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Netbeheerder</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecteer netbeheerder" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="liander">Liander</SelectItem>
                            <SelectItem value="stedin">Stedin</SelectItem>
                            <SelectItem value="enexis">Enexis</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="desiredConnectionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gewenste aansluitdatum</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewConnectionDialogOpen(false)}
                >
                  Annuleren
                </Button>
                <Button
                  type="submit"
                  disabled={!form.getValues().ean}
                >
                  Aanvraag indienen
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
