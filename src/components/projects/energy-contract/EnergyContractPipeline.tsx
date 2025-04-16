import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Zap,
  Send,
  PlusCircle,
  CheckCircle,
  MessageSquare, 
  AlertCircle, 
  FilePlus,
  FileCheck,
  FileX,
  Power,
  Lightbulb,
  Flame,
  BarChartHorizontal,
  HelpCircle,
  Copy
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EnergyContractStatus, EnergyContract, ConnectionRequest, ConnectionConsumption } from "@/types/project";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";

interface EnergyContractPipelineProps {
  projectId: string;
  connectionRequests: ConnectionRequest[];
}

export function EnergyContractPipeline({ projectId, connectionRequests }: EnergyContractPipelineProps) {
  const isMobile = useIsMobile();
  
  const [energyContracts, setEnergyContracts] = useState<EnergyContract[]>([]);
  const [readyToContractConnections, setReadyToContractConnections] = useState<ConnectionRequest[]>([]);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [selectedEANs, setSelectedEANs] = useState<string[]>([]);
  const [connectionConsumptions, setConnectionConsumptions] = useState<Record<string, ConnectionConsumption>>({});
  const [sourceConsumption, setSourceConsumption] = useState<ConnectionConsumption | null>(null);
  const [sourceEAN, setSourceEAN] = useState<string>("");
  const [contractData, setContractData] = useState({
    supplier: "",
    startDate: "",
    endDate: ""
  });
  const [emailTemplate, setEmailTemplate] = useState(`Geachte heer/mevrouw,

Hierbij verzoeken wij u om energielevering te starten voor de volgende aansluiting(en):

[SELECTED_EANS]

Project: [PROJECT_NAME]
Gewenste startdatum: [START_DATE]
Einddatum: [END_DATE]

Met vriendelijke groet,
[USER_NAME]
`);

  useEffect(() => {
    const connectedRequests = connectionRequests.filter(
      conn => conn.status === 'aangesloten' && conn.ean
    );
    
    const availableConnections = connectedRequests.filter(conn => 
      !energyContracts.some(contract => 
        contract.ean === conn.ean && 
        (contract.status === 'ingediend' || contract.status === 'actief')
      )
    );
    
    setReadyToContractConnections(availableConnections);
    
    const initialConsumptions: Record<string, ConnectionConsumption> = {};
    availableConnections.forEach(conn => {
      if (conn.ean) {
        initialConsumptions[conn.ean] = {
          peakUsage: undefined,
          offPeakUsage: undefined,
          hasEnergyReturn: false,
          peakReturn: undefined,
          offPeakReturn: undefined,
          gasUsage: undefined,
          unknownConsumption: false
        };
      }
    });
    
    setConnectionConsumptions(initialConsumptions);
  }, [connectionRequests, energyContracts]);

  const isEANInContracts = (ean: string) => {
    return energyContracts.some(
      contract => contract.ean === ean && 
      (contract.status === 'ingediend' || contract.status === 'actief')
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const validEans = readyToContractConnections
        .filter(conn => conn.ean)
        .map(conn => conn.ean!) as string[];
      setSelectedEANs(validEans);
    } else {
      setSelectedEANs([]);
    }
  };

  const handleToggleEAN = (ean: string) => {
    if (selectedEANs.includes(ean)) {
      setSelectedEANs(selectedEANs.filter(e => e !== ean));
    } else {
      setSelectedEANs([...selectedEANs, ean]);
    }
  };

  const handleRequestContracts = () => {
    setShowRequestDialog(true);
  };

  const handleSubmitRequest = () => {
    setShowRequestDialog(false);
    setShowConfirmDialog(true);
  };

  const handleToggleEnergyReturn = (ean: string, hasReturn: boolean) => {
    setConnectionConsumptions({
      ...connectionConsumptions,
      [ean]: {
        ...connectionConsumptions[ean],
        hasEnergyReturn: hasReturn,
        peakReturn: hasReturn ? connectionConsumptions[ean].peakReturn : undefined,
        offPeakReturn: hasReturn ? connectionConsumptions[ean].offPeakReturn : undefined
      }
    });
  };

  const handleToggleUnknownConsumption = (ean: string, isUnknown: boolean) => {
    setConnectionConsumptions({
      ...connectionConsumptions,
      [ean]: {
        ...connectionConsumptions[ean],
        unknownConsumption: isUnknown,
        peakUsage: isUnknown ? undefined : connectionConsumptions[ean].peakUsage,
        offPeakUsage: isUnknown ? undefined : connectionConsumptions[ean].offPeakUsage,
        gasUsage: isUnknown ? undefined : connectionConsumptions[ean].gasUsage,
        hasEnergyReturn: isUnknown ? false : connectionConsumptions[ean].hasEnergyReturn,
        peakReturn: isUnknown ? undefined : connectionConsumptions[ean].peakReturn,
        offPeakReturn: isUnknown ? undefined : connectionConsumptions[ean].offPeakReturn
      }
    });
  };

  const updateConsumptionValue = (ean: string, field: keyof ConnectionConsumption, value: any) => {
    setConnectionConsumptions({
      ...connectionConsumptions,
      [ean]: {
        ...connectionConsumptions[ean],
        [field]: typeof value === 'string' && value !== '' ? Number(value) : value
      }
    });
  };

  const handleConfirmRequest = () => {
    const newContracts = selectedEANs.map(ean => {
      const connection = readyToContractConnections.find(conn => conn.ean === ean);
      
      return {
        id: `contract-${Date.now()}-${ean}`,
        projectId,
        ean,
        address: connection?.address || "",
        type: connection?.type || "electricity",
        status: 'ingediend' as EnergyContractStatus,
        supplier: contractData.supplier,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        consumption: connectionConsumptions[ean],
        emailLogs: [{
          date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          recipient: `${contractData.supplier.toLowerCase()}@example.com`,
          subject: `Verzoek energielevering voor project ${projectId}`,
          type: 'supplier_request'
        }]
      } as EnergyContract;
    });

    setEnergyContracts([...energyContracts, ...newContracts]);
    setShowConfirmDialog(false);
    setSelectedEANs([]);
    
    toast({
      title: "Aanvraag verstuurd",
      description: `Er zijn ${newContracts.length} energiecontracten aangevraagd bij ${contractData.supplier}`,
    });
  };

  const handleOpenCopyDialog = (ean: string) => {
    setSourceEAN(ean);
    setSourceConsumption(connectionConsumptions[ean]);
    setShowCopyDialog(true);
  };

  const handleCopyConsumption = () => {
    if (!sourceConsumption || !sourceEAN) return;
    
    const sourceConnection = readyToContractConnections.find(conn => conn.ean === sourceEAN);
    if (!sourceConnection) return;
    
    const updatedConsumptions = {...connectionConsumptions};
    
    selectedEANs.forEach(ean => {
      if (ean !== sourceEAN) {
        const targetConnection = readyToContractConnections.find(conn => conn.ean === ean);
        
        if (targetConnection && targetConnection.type === sourceConnection.type) {
          updatedConsumptions[ean] = {...sourceConsumption};
        }
      }
    });
    
    setConnectionConsumptions(updatedConsumptions);
    setShowCopyDialog(false);
    
    toast({
      title: "Verbruiksgegevens gekopieerd",
      description: "De verbruiksgegevens zijn gekopieerd naar alle geselecteerde aansluitingen van hetzelfde type.",
    });
  };

  const handleUpdateContractStatus = (contractId: string, newStatus: EnergyContractStatus) => {
    const updatedContracts = energyContracts.map(contract => 
      contract.id === contractId ? { ...contract, status: newStatus } : contract
    );
    
    setEnergyContracts(updatedContracts);
    
    toast({
      title: "Status bijgewerkt",
      description: `Contractstatus is bijgewerkt naar ${newStatus}`,
    });
  };

  const contractsByStatus: Record<EnergyContractStatus, EnergyContract[]> = {
    aanmelden: [],
    ingediend: [],
    actief: [],
    afmelden: [],
    beëindigd: []
  };

  readyToContractConnections.forEach(conn => {
    if (conn.ean && !isEANInContracts(conn.ean)) {
      contractsByStatus.aanmelden.push({
        id: `potential-${conn.id}`,
        projectId,
        ean: conn.ean,
        address: conn.address,
        type: conn.type,
        status: 'aanmelden',
        supplier: conn.supplier || 'Nog niet bepaald',
        startDate: '',
        // Add other required fields with default values
      } as EnergyContract);
    }
  });

  energyContracts.forEach(contract => {
    contractsByStatus[contract.status].push(contract);
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Energiecontract aanvragen</CardTitle>
            <CardDescription>
              Beheer de energiecontracten voor de aansluitingen in dit project.
            </CardDescription>
          </div>
          <Button 
            onClick={() => setShowRequestDialog(true)}
            disabled={readyToContractConnections.length === 0}
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Nieuwe Contractaanvraag
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {(['aanmelden', 'ingediend', 'actief', 'afmelden', 'beëindigd'] as EnergyContractStatus[]).map((status) => (
              <ContractStatusColumn 
                key={status} 
                status={status} 
                contracts={contractsByStatus[status]}
                onStatusUpdate={handleUpdateContractStatus}
                isPlaceholder={status === 'aanmelden'}
                onRequestContract={status === 'aanmelden' ? handleRequestContracts : undefined}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent withScroll maxHeight={isMobile ? "95vh" : "85vh"} className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Energiecontracten aanvragen</DialogTitle>
            <DialogDescription>
              Selecteer de aansluitingen waarvoor je een energiecontract wilt aanvragen
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="supplier" className="mb-2 block">Leverancier</Label>
                <Input 
                  id="supplier" 
                  value={contractData.supplier}
                  onChange={e => setContractData({ ...contractData, supplier: e.target.value })}
                  placeholder="Bijv. Vattenfall, Eneco, Essent"
                />
              </div>
              <div>
                <Label htmlFor="startDate" className="mb-2 block">Startdatum</Label>
                <Input 
                  id="startDate" 
                  type="date"
                  value={contractData.startDate}
                  onChange={e => setContractData({ ...contractData, startDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="endDate" className="block">Einddatum contract</Label>
              <Input 
                id="endDate" 
                type="date"
                value={contractData.endDate}
                onChange={e => setContractData({ ...contractData, endDate: e.target.value })}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Selecteer aansluitingen</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="selectAll" 
                    checked={selectedEANs.length === readyToContractConnections.length && readyToContractConnections.length > 0}
                    onCheckedChange={(checked) => handleSelectAll(checked === true)}
                  />
                  <Label htmlFor="selectAll" className="text-sm">Alles selecteren</Label>
                </div>
              </div>
              
              <div className="border rounded-md">
                <ScrollArea className={isMobile ? "h-[200px]" : "h-[250px]"}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>EAN</TableHead>
                        <TableHead>Adres</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {readyToContractConnections.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            Geen beschikbare aansluitingen met EAN gevonden
                          </TableCell>
                        </TableRow>
                      ) : (
                        readyToContractConnections.map(connection => (
                          <TableRow key={connection.id}>
                            <TableCell>
                              <Checkbox 
                                checked={connection.ean && selectedEANs.includes(connection.ean)}
                                onCheckedChange={() => connection.ean && handleToggleEAN(connection.ean)}
                                disabled={connection.ean && isEANInContracts(connection.ean)}
                              />
                            </TableCell>
                            <TableCell className="font-mono">{connection.ean}</TableCell>
                            <TableCell>{connection.address}</TableCell>
                            <TableCell>
                              {connection.type === 'electricity' ? 'Elektriciteit' : 'Gas'}
                            </TableCell>
                            <TableCell>
                              {connection.ean && isEANInContracts(connection.ean) ? (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                                  Contract actief
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
                                  Beschikbaar
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
            
            {selectedEANs.length > 0 && (
              <div className="border rounded-md p-4 bg-muted/20 space-y-4">
                <h3 className="font-medium flex items-center">
                  <BarChartHorizontal className="h-4 w-4 mr-2" />
                  Verbruiksgegevens
                </h3>
                
                <ScrollArea className={isMobile ? "max-h-[300px]" : "max-h-[400px]"}>
                  <div className="space-y-6 pr-2">
                    {selectedEANs.map(ean => {
                      const connection = readyToContractConnections.find(conn => conn.ean === ean);
                      const consumption = connectionConsumptions[ean];
                      
                      if (!connection || !consumption) return null;
                      
                      return (
                        <div key={ean} className="border-b pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{connection.address}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">
                                {connection.type === 'electricity' ? 'Elektriciteit' : 'Gas'}
                              </Badge>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-2"
                                onClick={() => handleOpenCopyDialog(ean)}
                              >
                                <Copy className="h-3.5 w-3.5 mr-1" /> Kopieer naar alle
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center mb-4 space-x-2">
                            <Checkbox 
                              id={`unknown-${ean}`}
                              checked={consumption.unknownConsumption}
                              onCheckedChange={(checked) => handleToggleUnknownConsumption(ean, checked === true)}
                            />
                            <Label htmlFor={`unknown-${ean}`} className="text-sm flex items-center">
                              <HelpCircle className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              Ik weet het verbruik niet
                            </Label>
                          </div>
                          
                          {!consumption.unknownConsumption && (
                            <>
                              {connection.type === 'electricity' ? (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor={`peak-usage-${ean}`}>Verbruik piek (kWh/jaar)</Label>
                                      <Input 
                                        id={`peak-usage-${ean}`}
                                        type="number"
                                        placeholder="Bijv. 2500"
                                        value={consumption.peakUsage || ""}
                                        onChange={e => updateConsumptionValue(ean, 'peakUsage', e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`off-peak-usage-${ean}`}>Verbruik dal (kWh/jaar)</Label>
                                      <Input 
                                        id={`off-peak-usage-${ean}`}
                                        type="number"
                                        placeholder="Bijv. 1800"
                                        value={consumption.offPeakUsage || ""}
                                        onChange={e => updateConsumptionValue(ean, 'offPeakUsage', e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Label htmlFor={`has-return-${ean}`}>Teruglevering</Label>
                                      <RadioGroup 
                                        id={`has-return-${ean}`}
                                        value={consumption.hasEnergyReturn ? "yes" : "no"}
                                        onValueChange={(value) => handleToggleEnergyReturn(ean, value === "yes")}
                                        className="flex space-x-4"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="yes" id={`has-return-yes-${ean}`} />
                                          <Label htmlFor={`has-return-yes-${ean}`}>Ja</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="no" id={`has-return-no-${ean}`} />
                                          <Label htmlFor={`has-return-no-${ean}`}>Nee</Label>
                                        </div>
                                      </RadioGroup>
                                    </div>
                                    
                                    {consumption.hasEnergyReturn && (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                        <div>
                                          <Label htmlFor={`peak-return-${ean}`}>Teruglevering piek (kWh/jaar)</Label>
                                          <Input 
                                            id={`peak-return-${ean}`}
                                            type="number"
                                            placeholder="Bijv. 1200"
                                            value={consumption.peakReturn || ""}
                                            onChange={e => updateConsumptionValue(ean, 'peakReturn', e.target.value)}
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor={`off-peak-return-${ean}`}>Teruglevering dal (kWh/jaar)</Label>
                                          <Input 
                                            id={`off-peak-return-${ean}`}
                                            type="number"
                                            placeholder="Bijv. 800"
                                            value={consumption.offPeakReturn || ""}
                                            onChange={e => updateConsumptionValue(ean, 'offPeakReturn', e.target.value)}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <Label htmlFor={`gas-usage-${ean}`}>Gasverbruik (m³/jaar)</Label>
                                  <Input 
                                    id={`gas-usage-${ean}`}
                                    type="number"
                                    placeholder="Bijv. 1500"
                                    value={consumption.gasUsage || ""}
                                    onChange={e => updateConsumptionValue(ean, 'gasUsage', e.target.value)}
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}
            
            <div>
              <Label htmlFor="emailTemplate" className="mb-2 block">E-mail template</Label>
              <Textarea 
                id="emailTemplate"
                rows={6}
                value={emailTemplate}
                onChange={e => setEmailTemplate(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Gebruik placeholders zoals [SELECTED_EANS], [PROJECT_NAME], [START_DATE], etc.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              Annuleren
            </Button>
            <Button 
              onClick={handleSubmitRequest}
              disabled={selectedEANs.length === 0 || !contractData.supplier || !contractData.startDate || !contractData.endDate}
            >
              Aanvragen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={showCopyDialog} 
        onOpenChange={setShowCopyDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kopieer verbruiksgegevens</DialogTitle>
            <DialogDescription>
              Kopieer de verbruiksgegevens naar alle geselecteerde aansluitingen van hetzelfde type.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Let op</AlertTitle>
              <AlertDescription>
                Alle huidige verbruiksgegevens van de geselecteerde aansluitingen worden overschreven.
              </AlertDescription>
            </Alert>
            
            {sourceEAN && (
              <div className="rounded-md bg-muted p-3">
                <h4 className="text-sm font-medium mb-2">Brongegevens</h4>
                <p className="text-xs mb-1">
                  <span className="font-medium">EAN:</span> {sourceEAN}
                </p>
                <p className="text-xs mb-1">
                  <span className="font-medium">Adres:</span> {readyToContractConnections.find(c => c.ean === sourceEAN)?.address}
                </p>
                {sourceConsumption && sourceConsumption.unknownConsumption ? (
                  <p className="text-xs font-medium text-muted-foreground">Verbruik onbekend</p>
                ) : (
                  <>
                    {readyToContractConnections.find(c => c.ean === sourceEAN)?.type === 'electricity' ? (
                      <div className="text-xs space-y-1">
                        <p><span className="font-medium">Piek:</span> {sourceConsumption?.peakUsage || '0'} kWh/jaar</p>
                        <p><span className="font-medium">Dal:</span> {sourceConsumption?.offPeakUsage || '0'} kWh/jaar</p>
                        {sourceConsumption?.hasEnergyReturn && (
                          <>
                            <p><span className="font-medium">Teruglevering piek:</span> {sourceConsumption?.peakReturn || '0'} kWh/jaar</p>
                            <p><span className="font-medium">Teruglevering dal:</span> {sourceConsumption?.offPeakReturn || '0'} kWh/jaar</p>
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs"><span className="font-medium">Gas:</span> {sourceConsumption?.gasUsage || '0'} m³/jaar</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCopyDialog(false)}>
              Annuleren
            </Button>
            <Button
              onClick={handleCopyConsumption}
              className="bg-cedrus-accent hover:bg-cedrus-accent/90"
            >
              <Copy className="h-4 w-4 mr-2" /> Kopieer naar alle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bevestig aanvraag</AlertDialogTitle>
            <AlertDialogDescription>
              Je staat op het punt om {selectedEANs.length} energiecontract(en) aan te vragen bij {contractData.supplier}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <div className="rounded-md bg-muted p-4 mb-4">
              <p className="font-medium mb-2">Contractgegevens</p>
              <ul className="text-sm space-y-1">
                <li><span className="text-muted-foreground">Leverancier:</span> {contractData.supplier}</li>
                <li><span className="text-muted-foreground">Startdatum:</span> {contractData.startDate}</li>
                <li><span className="text-muted-foreground">Einddatum:</span> {contractData.endDate}</li>
                <li><span className="text-muted-foreground">Aantal aansluitingen:</span> {selectedEANs.length}</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  Ik ga akkoord met de algemene voorwaarden voor energiecontracten
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="permission" required />
                <Label htmlFor="permission" className="text-sm">
                  Ik geef toestemming voor het inkopen van energiecontracten voor de geselecteerde aansluitingen
                </Label>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Annuleren
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRequest}>
              Bevestigen en versturen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface ContractStatusColumnProps {
  status: EnergyContractStatus;
  contracts: EnergyContract[];
  onStatusUpdate: (contractId: string, status: EnergyContractStatus) => void;
  isPlaceholder?: boolean;
  onRequestContract?: () => void;
}

function ContractStatusColumn({ 
  status, 
  contracts, 
  onStatusUpdate, 
  isPlaceholder = false,
  onRequestContract 
}: ContractStatusColumnProps) {
  
  const getStatusInfo = (status: EnergyContractStatus) => {
    switch(status) {
      case 'aanmelden':
        return { 
          title: 'Aanmelden', 
          color: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-700',
          icon: <PlusCircle className="h-4 w-4 text-blue-500" />
        };
      case 'ingediend':
        return { 
          title: 'Ingediend', 
          color: 'bg-purple-50 border-purple-200',
          textColor: 'text-purple-700',
          icon: <Send className="h-4 w-4 text-purple-500" />
        };
      case 'actief':
        return { 
          title: 'Actief', 
          color: 'bg-green-50 border-green-200',
          textColor: 'text-green-700',
          icon: <Power className="h-4 w-4 text-green-500" />
        };
      case 'afmelden':
        return { 
          title: 'Afmelden', 
          color: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-700',
          icon: <AlertCircle className="h-4 w-4 text-yellow-500" />
        };
      case 'beëindigd':
        return { 
          title: 'Beëindigd', 
          color: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-700',
          icon: <FileX className="h-4 w-4 text-gray-500" />
        };
    }
  };

  const { title, color, textColor, icon } = getStatusInfo(status);

  const getNextStatus = (currentStatus: EnergyContractStatus): EnergyContractStatus | null => {
    switch(currentStatus) {
      case 'aanmelden': return 'ingediend';
      case 'ingediend': return 'actief';
      case 'actief': return 'afmelden';
      case 'afmelden': return 'beëindigd';
      case 'beëindigd': return null;
    }
  };

  return (
    <div className={`rounded-md ${color} border p-3 h-full min-h-[200px]`}>
      <div className={`font-medium ${textColor} mb-3 flex items-center justify-between`}>
        <div className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </div>
        <Badge variant="outline">{contracts.length}</Badge>
      </div>
      
      <div className="space-y-2">
        {contracts.length === 0 ? (
          <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
            {status === 'aanmelden' 
              ? "Aansluitingen gereed voor contractaanvraag"
              : "Geen contracten"}
          </div>
        ) : (
          contracts.map((contract) => {
            const nextStatus = getNextStatus(contract.status);
            const isPlaceholderContract = isPlaceholder && contract.id.startsWith('potential-');
            
            return (
              <div 
                key={contract.id}
                className="p-3 rounded-md bg-white border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-medium mb-1">
                      {isPlaceholderContract ? "Klaar voor contractaanvraag" : contract.supplier}
                    </div>
                    <div className="text-xs text-muted-foreground mb-1 font-mono">{contract.ean}</div>
                  </div>
                  <Badge variant={contract.type === 'electricity' ? 'default' : 'secondary'} className="text-[10px]">
                    {contract.type === 'electricity' ? 'Elektra' : 'Gas'}
                  </Badge>
                </div>
                
                {!isPlaceholderContract && (
                  <div className="text-xs text-muted-foreground mb-2">
                    Start: {contract.startDate || 'Onbekend'}
                    {contract.endDate && ` • Eind: ${contract.endDate}`}
                  </div>
                )}
                
                {!isPlaceholderContract && nextStatus && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => onStatusUpdate(contract.id, nextStatus)}
                  >
                    {nextStatus === 'ingediend' ? 'Markeer als ingediend' : 
                     nextStatus === 'actief' ? 'Markeer als actief' :
                     nextStatus === 'afmelden' ? 'Markeer voor afmelding' :
                     'Markeer als beëindigd'}
                  </Button>
                )}
                
                {isPlaceholderContract && onRequestContract && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={onRequestContract}
                  >
                    Contract aanvragen
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
