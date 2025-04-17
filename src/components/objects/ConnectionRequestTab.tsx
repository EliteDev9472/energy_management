
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Zap, RefreshCw, ChevronRight, Bolt, Flame } from 'lucide-react';
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
import { EanCodeLookup } from '../connections/forms/EanCodeLookup';
import { EanCodeInfo } from '@/utils/eanUtils';
import { Input } from '@/components/ui/input';

interface ConnectionRequestTabProps {
  objectId: string;
  projectId: string;
  connections: any[];
  objectName: string,
  setConnections: (connections: any[]) => void;
}

export function ConnectionRequestTab({ objectId, projectId, objectName, connections, setConnections }: ConnectionRequestTabProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [newElectricityDialogOpen, setNewElectricityDialogOpen] = useState(false);
  const [newGasDialogOpen, setNewGasDialogOpen] = useState(false);

  // Forms
  const electricityForm = useForm<ConnectionRequestFormValues>({
    resolver: zodResolver(connectionRequestSchema),
    defaultValues: {
      address: objectName,
      city: 'Amsterdam',
      postalCode: '1011XY',
      type: 'electricity',
      capacity: '3x25A',
      gridOperator: 'liander',
      desiredConnectionDate: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString().split('T')[0],
      installer: '',
      installerEmail: '',
      installerPhone: ''
    }
  });

  const gasForm = useForm<ConnectionRequestFormValues>({
    resolver: zodResolver(connectionRequestSchema),
    defaultValues: {
      address: objectName,
      city: 'Amsterdam',
      postalCode: '1011XY',
      type: 'gas',
      capacity: 'G4',
      gridOperator: 'liander',
      desiredConnectionDate: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString().split('T')[0],
      installer: '',
      installerEmail: '',
      installerPhone: ''
    }
  });

  const handleElectricitySubmit = async (values: ConnectionRequestFormValues) => {
    try {
      console.log("Creating new electricity connection for object:", objectId, objectName);
      const newConnection = await energyConnectionService.createEnergyConnection({
        address: values.address,
        city: values.city || 'Amsterdam',
        postalCode: values.postalCode || '1011XY',
        type: 'Elektriciteit',
        status: 'Actief',
        requestStatus: 'NEW',
        capacity: values.capacity,
        gridOperator: values.gridOperator,
        objectId: objectId,
        objectName: objectName,
        desiredConnectionDate: new Date(values.desiredConnectionDate).toISOString(),
        installer: values.installer ? {
          name: values.installer,
          email: values.installerEmail || '',
          phone: values.installerPhone || ''
        } : undefined,
        ean: values.ean,
        meterRole: 'main'
      });

      if (newConnection) {
        setNewElectricityDialogOpen(false);

        toast({
          title: "Aanvraag aangemaakt",
          description: "De aanvraag voor elektriciteitsaansluiting is aangemaakt.",
        });
      }
    } catch (error) {
      console.error('Error creating electricity connection:', error);
      toast({
        title: "Fout bij aanmaken aansluiting",
        description: "Er is een fout opgetreden bij het aanmaken van de aansluiting.",
        variant: "destructive",
      });
    }
  };

  const handleEanCodeFound = (info: EanCodeInfo, form: any) => {
    form.setValue('address', info.address);
    form.setValue('city', info.city);
    form.setValue('postalCode', info.postalCode);
    form.setValue('gridOperator', info.gridOperator);
    form.setValue('capacity', info.capacity);

    toast({
      title: "EAN code gevonden",
      description: "Adresgegevens zijn automatisch ingevuld.",
    });
  };

  const handleGasSubmit = async (values: ConnectionRequestFormValues) => {
    try {
      console.log("Creating new gas connection for object:", objectId, objectName);
      const newConnection = await energyConnectionService.createEnergyConnection({
        address: values.address,
        city: values.city || 'Amsterdam',
        postalCode: values.postalCode || '1011XY',
        type: 'Gas',
        status: 'Actief',
        requestStatus: 'NEW',
        capacity: values.capacity,
        gridOperator: values.gridOperator,
        objectId: objectId,
        objectName: objectName,
        desiredConnectionDate: new Date(values.desiredConnectionDate).toISOString(),
        installer: values.installer ? {
          name: values.installer,
          email: values.installerEmail || '',
          phone: values.installerPhone || ''
        } : undefined,
        ean: values.ean,
        meterRole: 'main'
      });

      if (newConnection) {
        setNewGasDialogOpen(false);

        toast({
          title: "Aanvraag aangemaakt",
          description: "De aanvraag voor gasaansluiting is aangemaakt.",
        });
      }
    } catch (error) {
      console.error('Error creating gas connection:', error);
      toast({
        title: "Fout bij aanmaken aansluiting",
        description: "Er is een fout opgetreden bij het aanmaken van de aansluiting.",
        variant: "destructive",
      });
    }
  };

  const fetchConnectionRequests = async () => {
    if (!objectId) return;

    setLoading(true);
    try {
      const requests = await hierarchicalConnectionService.getConnectionRequestsByObjectId(objectId);
      setConnections(requests);
    } catch (error) {
      console.error('Error fetching connection requests:', error);
      toast({
        title: 'Fout bij laden aansluitingsaanvragen',
        description: 'Er is een fout opgetreden bij het laden van de aansluitingsaanvragen.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectionRequests();
  }, [objectId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Nieuw</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In Behandeling</Badge>;
      case 'OFFER_REQUESTED':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Offerte Aangevraagd</Badge>;
      case 'OFFER_RECEIVED':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Offerte Ontvangen</Badge>;
      case 'OFFER_ACCEPTED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Offerte Geaccepteerd</Badge>;
      case 'PLANNED':
        return <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">Ingepland</Badge>;
      case 'CONNECTED':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Aangesloten</Badge>;
      case 'CANCELED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Geannuleerd</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Elektriciteit':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Bolt className="h-3 w-3 mr-1" /> Elektriciteit
          </Badge>
        );
      case 'Gas':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Flame className="h-3 w-3 mr-1" /> Gas
          </Badge>
        );
      case 'Water':
        return <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">Water</Badge>;
      case 'Warmte':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Warmte</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleCreateConnectionRequest = () => {
    navigate(`/connections/new?objectId=${objectId}&projectId=${projectId}`);
  };

  const handleElectricityConnectionRequest = () => {
    navigate(`/connections/new?objectId=${objectId}&projectId=${projectId}&type=Elektriciteit`);
  };

  const handleGasConnectionRequest = () => {
    navigate(`/connections/new?objectId=${objectId}&projectId=${projectId}&type=Gas`);
  };

  const handleViewRequest = (requestId: string) => {
    navigate(`/connections/${requestId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Aansluitingen aanvragen {objectName}</h3>
        <div className="flex gap-2">
          <Button onClick={() => setNewElectricityDialogOpen(true)}>
            <Zap className="h-4 w-4 mr-2" />
            Elektriciteitsaansluiting aanvragen
          </Button>
          <Button onClick={() => setNewGasDialogOpen(true)}>
            <Flame className="h-4 w-4 mr-2" />
            Gasaansluiting aanvragen
          </Button>
        </div>
      </div>

      {/* <div className="flex gap-4 mb-6">
        <Button
          onClick={handleElectricityConnectionRequest}
          variant="outline"
          className="flex-1"
        >
          <Bolt className="h-4 w-4 mr-2 text-yellow-600" />
          Elektriciteitsaansluiting aanvragen
        </Button>

        <Button
          onClick={handleGasConnectionRequest}
          variant="outline"
          className="flex-1"
        >
          <Flame className="h-4 w-4 mr-2 text-blue-600" />
          Gasaansluiting aanvragen
        </Button>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="bg-blue-50 rounded-md border p-3 h-full min-h-[200px]">
          <div className="font-medium mb-3 flex justify-between">
            Nieuwe aanvraag
            <Badge variant="outline">0</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-md border p-3 h-full min-h-[200px]">
          <div className="font-medium mb-3 flex justify-between">
            In behandeling
            <Badge variant="outline">0</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-md border p-3 h-full min-h-[200px]">
          <div className="font-medium mb-3 flex justify-between">
            Offerte geaccepteerd
            <Badge variant="outline">0</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-md border p-3 h-full min-h-[200px]">
          <div className="font-medium mb-3 flex justify-between">
            Gepland
            <Badge variant="outline">0</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-md border p-3 h-full min-h-[200px]">
          <div className="font-medium mb-3 flex justify-between">
            Uitvoering
            <Badge variant="outline">0</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-md border p-3 h-full min-h-[200px]">
          <div className="font-medium mb-3 flex justify-between">
            Aangesloten
            <Badge variant="outline">0</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>

        <div className="bg-cyan-50 rounded-md border p-3 h-full min-h-[200px]">
          <div className="font-medium mb-3 flex justify-between">
            Contract aanvragen
            <Badge variant="outline">0</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>
      </div>

      {/* {loading ? (
        <div className="flex justify-center items-center h-40">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : connections.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex flex-col items-center text-center">
            <Zap className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">Geen aansluitingsaanvragen</CardTitle>
            <CardDescription className="mb-6">
              Er zijn nog geen aansluitingsaanvragen voor dit object. Maak een nieuwe aanvraag om te beginnen.
            </CardDescription>
            <Button onClick={handleCreateConnectionRequest}>
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe Aanvraag
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Recente aanvragen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map((request) => (
              <Card
                key={request.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewRequest(request.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{request.address}</h4>
                      <p className="text-sm text-muted-foreground">{request.city}</p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      {getStatusBadge(request.status)}
                      {getTypeBadge(request.type)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Netbeheerder:</span>
                      <span>{request.grid_operator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aangevraagd:</span>
                      <span>{formatDate(request.request_date)}</span>
                    </div>
                    {request.ean && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">EAN:</span>
                        <span>{request.ean}</span>
                      </div>
                    )}
                    {request.desired_connection_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gewenste datum:</span>
                        <span>{formatDate(request.desired_connection_date)}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="sm" className="h-8">
                      Details <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )} */}

      {/* Electricity Connection Dialog */}
      <Dialog open={newElectricityDialogOpen} onOpenChange={setNewElectricityDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nieuwe elektriciteitsaansluiting</DialogTitle>
            <DialogDescription>
              Vul de gegevens in om een elektriciteitsaansluiting aan te vragen.
            </DialogDescription>
          </DialogHeader>

          <Form {...electricityForm}>
            <form onSubmit={electricityForm.handleSubmit(handleElectricitySubmit)} className="space-y-4">
              <FormField
                control={electricityForm.control}
                name="ean"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EAN Code (optioneel)</FormLabel>
                    <FormControl>
                      <EanCodeLookup
                        value={field.value || ""}
                        onChange={field.onChange}
                        onCodeFound={(info) => handleEanCodeFound(info, electricityForm)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={electricityForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={electricityForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plaats</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={electricityForm.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postcode</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={electricityForm.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capaciteit</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer capaciteit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1x25A">1x25A</SelectItem>
                          <SelectItem value="3x25A">3x25A</SelectItem>
                          <SelectItem value="3x35A">3x35A</SelectItem>
                          <SelectItem value="3x50A">3x50A</SelectItem>
                          <SelectItem value="3x63A">3x63A</SelectItem>
                          <SelectItem value="3x80A">3x80A</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={electricityForm.control}
                  name="gridOperator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Netbeheerder</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={electricityForm.control}
                  name="desiredConnectionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gewenste aansluitdatum</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={electricityForm.control}
                name="installer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Naam installateur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={electricityForm.control}
                  name="installerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email installateur</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email installateur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={electricityForm.control}
                  name="installerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefoon installateur</FormLabel>
                      <FormControl>
                        <Input placeholder="Telefoon installateur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setNewElectricityDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button type="submit">Aanvragen</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Gas Connection Dialog */}
      <Dialog open={newGasDialogOpen} onOpenChange={setNewGasDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nieuwe gasaansluiting</DialogTitle>
            <DialogDescription>
              Vul de gegevens in om een gasaansluiting aan te vragen.
            </DialogDescription>
          </DialogHeader>

          <Form {...gasForm}>
            <form onSubmit={gasForm.handleSubmit(handleGasSubmit)} className="space-y-4">
              <FormField
                control={gasForm.control}
                name="ean"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EAN Code (optioneel)</FormLabel>
                    <FormControl>
                      <EanCodeLookup
                        value={field.value || ""}
                        onChange={field.onChange}
                        onCodeFound={(info) => handleEanCodeFound(info, gasForm)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={gasForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={gasForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plaats</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={gasForm.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postcode</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={gasForm.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capaciteit</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer capaciteit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="G1.6">G1.6</SelectItem>
                          <SelectItem value="G2.5">G2.5</SelectItem>
                          <SelectItem value="G4">G4</SelectItem>
                          <SelectItem value="G6">G6</SelectItem>
                          <SelectItem value="G10">G10</SelectItem>
                          <SelectItem value="G16">G16</SelectItem>
                          <SelectItem value="G25">G25</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={gasForm.control}
                  name="gridOperator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Netbeheerder</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={gasForm.control}
                  name="desiredConnectionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gewenste aansluitdatum</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={gasForm.control}
                name="installer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Naam installateur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={gasForm.control}
                  name="installerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email installateur</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email installateur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={gasForm.control}
                  name="installerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefoon installateur</FormLabel>
                      <FormControl>
                        <Input placeholder="Telefoon installateur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setNewGasDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button type="submit">Aanvragen</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
