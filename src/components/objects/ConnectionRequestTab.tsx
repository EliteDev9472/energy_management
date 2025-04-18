
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Zap, RefreshCw, ChevronRight, Bolt, Flame, Gauge, HelpCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { hierarchicalConnectionService } from '@/services/connections/hierarchicalConnectionService';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/dateUtils';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { connectionRequestSchema, ConnectionRequestFormValues } from './schema/connectionRequestSchema';
import { energyConnectionService } from '@/services/connections/energyConnectionService';
import { EanCodeLookup } from '@/components/connections/forms/EanCodeLookup';
import { EanCodeInfo } from '@/utils/eanUtils';
import { Input } from '@/components/ui/input';
import { ConnectionRequestStatus, EnergyConnection } from '@/types/connection';
import { MeterTypeSelector } from '../connections/forms/MeterTypeSelector';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnergyConnectionPipeline } from '../connections/pipeline/EnergyConnectionPipeline';


interface ConnectionRequestTabProps {
  objectId: string;
  projectId: string;
  // connections: any[];
  objectName: string,
  // setConnections: (connections: any[]) => void;
}

interface NewConnectionFormValues {
  address: string;
  city: string;
  postalCode: string;
  type: string;
  meterRole: 'main' | 'submeter' | 'mloea';
  capacity: string;
  gridOperator: string;
  ean: string;
  desiredConnectionDate: string;
  name: string;
  email: string;
  phonenumber: string;
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

export function ConnectionRequestTab({ objectId, projectId, objectName }: ConnectionRequestTabProps) {
  const [loading, setLoading] = useState(false);
  const [newConnectionDialogOpen, setNewConnectionDialogOpen] = useState(false);
  const [connections, setConnections] = useState<EnergyConnection[]>([]);

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

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };

    fetchConnections();
  }, [projectId]);



  // const fetchConnectionRequests = async () => {
  //   if (!objectId) return;

  //   setLoading(true);
  //   try {
  //     const requests = await hierarchicalConnectionService.getConnectionRequestsByObjectId(objectId);
  //     setConnections(requests);
  //   } catch (error) {
  //     console.error('Error fetching connection requests:', error);
  //     toast({
  //       title: 'Fout bij laden aansluitingsaanvragen',
  //       description: 'Er is een fout opgetreden bij het laden van de aansluitingsaanvragen.',
  //       variant: 'destructive'
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchConnectionRequests();
  // }, [objectId]);


  const handleNewConnection = () => {
    setNewConnectionDialogOpen(true);
  };

  const handleSubmitNewConnection = async (values: NewConnectionFormValues) => {
    // if (!values.ean || values.ean.trim() === '') {
    //   toast({
    //     title: "Validatiefout",
    //     description: "EAN code is verplicht voor aansluitingen",
    //     variant: "destructive",
    //   });
    //   return;
    // }

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
        objectId: objectId,
        // ean: values.ean,
        objectName: objectName
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

  const selectedType = form.watch('type');

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


  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={handleNewConnection}>
          <Plus className="h-4 w-4 mr-2" /> Nieuwe aanvraag
        </Button>
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
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent"></div>
              </div>
            ) : (
              <EnergyConnectionPipeline
                projectId={projectId || ""}
                objectId={objectId || ""}
                connections={connections}
                setConnections={setConnections}
              />
            )}
          </div>
        </ScrollArea>
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

              {/* Address Section */}
              <div className="space-y-4">
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
                        <MeterTypeSelector
                          showIcon={true}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Naam</FormLabel>
                      <FormControl>
                        <Input  {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1">
                <FormField
                  control={form.control}
                  name="phonenumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefoonnummer</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                // disabled={!form.getValues().ean}
                >
                  Aanvraag indienen
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
