
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EnergyConnection } from '@/types/connection';
import { handleDragStart, handleDragOver, handleDrop, isValidStatusTransition, formatStatusChange } from '@/utils/dragAndDrop';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, ArrowRight, Clock, FileText, Plus, Zap, Flame, FileDigit, Calendar, AlertCircle, SendIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ConnectionRequestStatus } from '@/types/connection/pipeline';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { energyConnectionService } from '@/services/connections/energyConnectionService';
import { supabase } from '@/integrations/supabase/client';

export interface EnergyConnectionPipelineProps {
  projectId: string;
  connections?: EnergyConnection[];
  setConnections?: React.Dispatch<React.SetStateAction<EnergyConnection[]>>;
  objectId?: string;
}

export const EnergyConnectionPipeline = ({
  projectId,
  connections: initialConnections = [],
  setConnections,
  objectId
}: EnergyConnectionPipelineProps) => {
  const [localConnections, setLocalConnections] = useState<EnergyConnection[]>(initialConnections);
  const [showEanCodeModal, setShowEanCodeModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<EnergyConnection | null>(null);
  const [eanCode, setEanCode] = useState('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let fetchedConnections: EnergyConnection[] = [];

        // Verify we have either a projectId or objectId
        if (!projectId && !objectId) {
          console.error("No projectId or objectId provided to EnergyConnectionPipeline");
          setError("Geen project of object ID opgegeven");
          setIsLoading(false);
          return;
        }

        if (objectId) {
          console.log("Fetching connections for object ID:", objectId);
          fetchedConnections = await energyConnectionService.getEnergyConnectionsByObjectId(objectId);
        } else if (projectId) {
          console.log("Fetching connections for project ID:", projectId);
          fetchedConnections = await energyConnectionService.getEnergyConnectionsByProjectId(projectId);
        }

        console.log("Fetched connections:", fetchedConnections);
        setLocalConnections(fetchedConnections);
        // if (setConnections) {
        //   setConnections(fetchedConnections);
        // }
      } catch (error) {
        console.error('Error fetching connections:', error);
        setError("Er is een fout opgetreden bij het ophalen van de aansluitingen");
        toast({
          title: "Fout bij ophalen aansluitingen",
          description: "Er is een fout opgetreden bij het ophalen van de aansluitingen.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we don't have connections passed in or if we're accessing by object/project ID
    if (initialConnections.length === 0 || objectId || projectId) {
      fetchConnections();
    } else {
      setLocalConnections(initialConnections);
      setIsLoading(false);
    }
  }, [projectId, initialConnections, setConnections, objectId]);

  useEffect(() => {
    // Guard clause - don't set up subscription if we have neither
    if (!objectId && !projectId) {
      console.log("No objectId or projectId provided, skipping realtime subscription");
      return;
    }

    // Set up realtime subscription for energy connections
    const filterCondition = objectId
      ? `object_id=eq.${objectId}`
      : `project_id=eq.${projectId}`;

    console.log("Setting up realtime subscription with filter:", filterCondition);

    const channel = supabase
      .channel('energy_connections_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'energy_connections',
          filter: filterCondition
        },
        (payload) => {
          console.log("Realtime update received:", payload);

          // Handle different event types
          if (payload.eventType === 'INSERT') {
            const newConnection = mapEnergyConnectionFromPayload(payload.new);
            console.log("Adding new connection to state:", newConnection);

            setLocalConnections(prev => {
              // Check if connection already exists to avoid duplicates
              if (prev.some(conn => conn.id === newConnection.id)) {
                return prev;
              }
              return [...prev, newConnection];
            });

            if (setConnections) {
              setConnections(prev => {
                if (prev.some(conn => conn.id === newConnection.id)) {
                  return prev;
                }
                return [...prev, newConnection];
              });
            }
          }
          else if (payload.eventType === 'UPDATE') {
            const updatedConnection = mapEnergyConnectionFromPayload(payload.new);
            console.log("Updating connection in state:", updatedConnection);

            setLocalConnections(prev =>
              prev.map(conn =>
                conn.id === updatedConnection.id ? updatedConnection : conn
              )
            );

            if (setConnections) {
              setConnections(prev =>
                prev.map(conn =>
                  conn.id === updatedConnection.id ? updatedConnection : conn
                )
              );
            }
          }
          else if (payload.eventType === 'DELETE') {
            console.log("Removing connection from state:", payload.old.id);

            setLocalConnections(prev =>
              prev.filter(conn => conn.id !== payload.old.id)
            );

            if (setConnections) {
              setConnections(prev =>
                prev.filter(conn => conn.id !== payload.old.id)
              );
            }
          }
        }
      )
      .subscribe((status) => {
        console.log("Supabase channel status:", status);
      });

    // Cleanup subscription on unmount
    return () => {
      console.log("Removing realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [projectId, objectId, setConnections]);

  const mapEnergyConnectionFromPayload = (payload: any): EnergyConnection => {
    console.log("Mapping connection from payload:", payload);

    // Safely handle installer data
    let installer;
    try {
      if (payload.installer) {
        installer = typeof payload.installer === 'string'
          ? JSON.parse(payload.installer)
          : payload.installer;
      }
    } catch (e) {
      console.error("Error parsing installer JSON:", e);
      installer = undefined;
    }

    return {
      id: payload.id,
      address: payload.address || '',
      city: payload.city || '',
      postalCode: payload.postal_code || '',
      type: payload.type || '',
      status: payload.status || '',
      requestStatus: payload.status as ConnectionRequestStatus,
      capacity: payload.capacity || '',
      gridOperator: payload.grid_operator || '',
      projectId: payload.project_id || null,
      objectId: payload.object_id || null,
      objectName: payload.object_name || '',
      requestDate: payload.request_date || null,
      desiredConnectionDate: payload.desired_connection_date || null,
      // ean: payload.ean || null,
      plannedConnectionDate: payload.planned_connection_date || null,
      gridOperatorWorkNumber: payload.grid_operator_work_number || null,
      inProgressDate: payload.in_progress_date || null,
      activationDate: payload.activation_date || null,
      isActiveSubscription: Boolean(payload.is_active_subscription),
      installer: installer,
      meteringType: payload.metering_type,
      hasFeedback: false,
      meterRole: (payload.meter_role as 'main' | 'submeter' | 'mloea') || 'main'
    };
  };

  // The main pipeline states
  const pipelineStates: ConnectionRequestStatus[] = [
    'NEW', 'IN_PROGRESS', 'OFFER_ACCEPTED', 'PLANNED', 'EXECUTION', 'CONNECTED', 'CONTRACT_REQUEST'
  ];

  const stateDisplayNames: Record<ConnectionRequestStatus, string> = {
    'NEW': 'Nieuwe aanvraag',
    'IN_PROGRESS': 'In behandeling',
    'OFFER_ACCEPTED': 'Offerte geaccepteerd',
    'PLANNED': 'Gepland',
    'EXECUTION': 'Uitvoering',
    'CONNECTED': 'Aangesloten',
    'WAITING_FOR_EVI': 'Wacht op EVI',
    'WAITING_FOR_APPROVAL': 'Wacht op goedkeuring',
    'CONTRACT_REQUEST': 'Contract aanvragen',
    'ACTIVE': 'Actief',
    'COMPLETED': 'Afgerond',
    'CANCELLED': 'Geannuleerd',
    'concept': 'Concept',
    'ingediend': 'Ingediend',
    'in_behandeling': 'In behandeling',
    'goedgekeurd': 'Goedgekeurd',
    'aangesloten': 'Aangesloten',
    'supplier_request': 'Leveranciersaanvraag',
    'aanmelden': 'Aanmelden',
    'actief': 'Actief',
    'afmelden': 'Afmelden',
    'beëindigd': 'Beëindigd'
  };

  const updateConnectionStatus = async (connectionId: string, oldStatus: ConnectionRequestStatus, newStatus: ConnectionRequestStatus) => {
    if (!isValidStatusTransition(oldStatus, newStatus)) {
      toast({
        title: "Ongeldige statusovergang",
        description: `Je kunt niet direct van ${stateDisplayNames[oldStatus]} naar ${stateDisplayNames[newStatus]} gaan.`,
        variant: "destructive",
      });
      return;
    }

    // Find the connection to update
    const connectionToUpdate = localConnections.find(conn => conn.id === connectionId);
    if (!connectionToUpdate) {
      console.error("Connection not found for update:", connectionId);
      return;
    }

    // Set special timestamps based on status changes
    let updatedFields: Partial<EnergyConnection> = {
      requestStatus: newStatus,
      status: newStatus
    };

    if (newStatus === 'IN_PROGRESS' && oldStatus !== 'IN_PROGRESS') {
      updatedFields.inProgressDate = new Date().toISOString();
    }

    // Update in Supabase
    try {
      console.log("Updating connection status:", connectionId, oldStatus, "->", newStatus);

      const updatedConnection = await energyConnectionService.updateEnergyConnection({
        ...connectionToUpdate,
        ...updatedFields
      });

      if (updatedConnection) {
        // We don't need to manually update the state since the realtime listener will catch this
        toast({
          title: "Status bijgewerkt",
          description: `Status gewijzigd: ${formatStatusChange(oldStatus, newStatus)}`,
        });
      }
    } catch (error) {
      console.error('Error updating connection status:', error);
      toast({
        title: "Fout bij bijwerken status",
        description: "Er is een fout opgetreden bij het bijwerken van de status.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: ConnectionRequestStatus) => {
    switch (status) {
      case 'NEW':
      case 'concept':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'IN_PROGRESS':
      case 'PLANNED':
      case 'EXECUTION':
      case 'ingediend':
      case 'in_behandeling':
        return <ArrowRight className="h-4 w-4 text-amber-500" />;
      case 'CONNECTED':
      case 'ACTIVE':
      case 'COMPLETED':
      case 'goedgekeurd':
      case 'aangesloten':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELLED':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'WAITING_FOR_EVI':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'CONTRACT_REQUEST':
        return <FileDigit className="h-4 w-4 text-indigo-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleAddEanCode = async () => {
    if (!selectedConnection) return;
    if (!eanCode.trim()) {
      toast({
        title: "EAN code ontbreekt",
        description: "Voer een geldige EAN code in",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("Adding EAN code:", eanCode, "to connection:", selectedConnection.id);

      const updatedConnection = await energyConnectionService.updateEnergyConnection({
        ...selectedConnection,
        ean: eanCode,
        requestStatus: 'CONTRACT_REQUEST',
        status: 'CONTRACT_REQUEST'
      });

      if (updatedConnection) {
        // No need to manually update state, the realtime listener will handle this
        toast({
          title: "EAN code toegevoegd",
          description: "De EAN code is toegevoegd en status bijgewerkt naar 'Contract aanvragen'",
        });
      }
    } catch (error) {
      console.error('Error adding EAN code:', error);
      toast({
        title: "Fout bij toevoegen EAN code",
        description: "Er is een fout opgetreden bij het toevoegen van de EAN code.",
        variant: "destructive",
      });
    }

    setShowEanCodeModal(false);
    setSelectedConnection(null);
    setEanCode('');
  };

  const handleRequestContract = (connection: EnergyConnection) => {
    // Navigate to contract pipeline
    navigate(`/energiecontracten`, {
      state: {
        fromConnection: true,
        connectionData: {
          id: connection.id,
          address: connection.address,
          // ean: connection.ean,
          type: connection.type === 'Elektriciteit' ? 'electricity' : 'gas',
          projectId: projectId,
          objectId: objectId
        }
      }
    });

    toast({
      title: "Aanvraag doorgestuurd",
      description: "De aanvraag is doorgestuurd naar energiecontracten",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fout</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {pipelineStates.map(status => {
          const statusConnections = localConnections.filter(conn =>
            conn.requestStatus === status
          );

          return (
            <div
              key={status}
              className={`rounded-md border p-4 ${getStatusBackgroundColor(status)} min-h-[300px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => {
                handleDrop(e, status, (connectionId, oldStatus, newStatus) => {
                  updateConnectionStatus(
                    connectionId,
                    oldStatus as ConnectionRequestStatus,
                    newStatus as ConnectionRequestStatus
                  );
                });
              }}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  {getStatusIcon(status)}
                  <span className="ml-2 font-medium">{stateDisplayNames[status]}</span>
                </div>
                <Badge variant="outline">{statusConnections.length}</Badge>
              </div>

              <div className="space-y-3">
                {statusConnections.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-8 border border-dashed rounded-md">
                    Geen aansluitingen
                  </div>
                ) : (
                  statusConnections.map(connection => (
                    <ConnectionCard
                      key={connection.id}
                      connection={connection}
                      currentStatus={status}
                      onStatusChange={(oldStatus, newStatus) => {
                        updateConnectionStatus(connection.id, oldStatus, newStatus);
                      }}
                      onAddEanCode={() => {
                        setSelectedConnection(connection);
                        setShowEanCodeModal(true);
                      }}
                      onRequestContract={() => {
                        handleRequestContract(connection);
                      }}
                      setShowEmailDialog={setShowEmailDialog}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* EAN Code Dialog */}
      <Dialog open={showEanCodeModal} onOpenChange={setShowEanCodeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>EAN Code toevoegen</DialogTitle>
            <DialogDescription>
              Voeg een EAN code toe om het contract aan te kunnen vragen.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="ean">EAN Code</Label>
              <Input
                id="ean"
                placeholder="871687167261534600"
                value={eanCode}
                onChange={(e) => setEanCode(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEanCodeModal(false)}>
              Annuleren
            </Button>
            <Button onClick={handleAddEanCode}>
              Opslaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Verstuur naar netbeheerder</DialogTitle>
            <DialogDescription>
              Aanvraag versturen naar de netbeheerder van deze aansluiting.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email-subject">Onderwerp</Label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email-body">Bericht</Label>
              <Textarea
                id="email-body"
                rows={10}
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Annuleren
            </Button>
            <Button>
              Versturen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ConnectionCardProps {
  connection: EnergyConnection;
  currentStatus: ConnectionRequestStatus;
  onStatusChange: (oldStatus: ConnectionRequestStatus, newStatus: ConnectionRequestStatus) => void;
  onAddEanCode: () => void;
  onRequestContract: () => void;
  setShowEmailDialog: (Boolean) => void;
}

function ConnectionCard({
  connection,
  currentStatus,
  onStatusChange,
  onAddEanCode,
  onRequestContract,
  setShowEmailDialog
}: ConnectionCardProps) {
  const typeIcon = connection.type === 'Elektriciteit' || connection.type === 'electricity'
    ? <Zap className="h-3 w-3" />
    : <Flame className="h-3 w-3" />;

  const typeColor = connection.type === 'Elektriciteit' || connection.type === 'electricity'
    ? 'bg-blue-100 text-blue-800'
    : 'bg-orange-100 text-orange-800';

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Niet beschikbaar';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return 'Ongeldige datum';
    }
  };

  return (
    <div
      className="border rounded-md p-3 bg-white shadow-sm"
      draggable
      onDragStart={(e) => handleDragStart(e, connection.id, currentStatus)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium text-sm">{connection.address}</p>
          <div className="flex gap-1 items-center text-xs text-muted-foreground">
            {connection.city}, {connection.postalCode}
          </div>
        </div>
        <Badge className={`${typeColor} flex items-center gap-1`}>
          {typeIcon} {connection.type}
        </Badge>
      </div>

      <div className="flex flex-col gap-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Capaciteit:</span>
          <span>{connection.capacity || 'Onbekend'}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Netbeheerder:</span>
          <span>{connection.gridOperator || 'Onbekend'}</span>
        </div>

        {/* {connection.ean && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">EAN:</span>
            <span>{connection.ean}</span>
          </div>
        )} */}

        {/* Display important dates for billing */}
        {connection.inProgressDate && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" /> In behandeling sinds:
            </span>
            <span className="font-medium text-amber-600">{formatDate(connection.inProgressDate)}</span>
          </div>
        )}

        {connection.activationDate && connection.isActiveSubscription && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" /> Actief sinds:
            </span>
            <span className="font-medium text-green-600">{formatDate(connection.activationDate)}</span>
          </div>
        )}

        {connection.objectName && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Object:</span>
            <span>{connection.objectName}</span>
          </div>
        )}
      </div>

      {/* Action buttons based on status */}
      <div className="mt-3 pt-2 border-t">
        {currentStatus === 'NEW' && (
          <Button size="sm" variant="outline" className="w-full text-xs h-7" onClick={() => setShowEmailDialog(true)}>
            <SendIcon className="h-3 w-3 mr-1" /> Versturen naar netbeheerder
          </Button>
        )}
        {currentStatus === 'CONNECTED' && (
          <Button size="sm" variant="outline" className="w-full text-xs h-7" onClick={onAddEanCode}>
            <FileDigit className="h-3 w-3 mr-1" /> EAN code toevoegen
          </Button>
        )}

        {currentStatus === 'CONTRACT_REQUEST' && (
          <Button size="sm" className="w-full text-xs h-7" onClick={onRequestContract}>
            <FileText className="h-3 w-3 mr-1" /> Contract aanvragen
          </Button>
        )}
      </div>
    </div>
  );
}

function getStatusBackgroundColor(status: ConnectionRequestStatus): string {
  switch (status) {
    case 'NEW':
      return 'bg-blue-50 border-blue-200';
    case 'IN_PROGRESS':
      return 'bg-amber-50 border-amber-200';
    case 'OFFER_ACCEPTED':
      return 'bg-purple-50 border-purple-200';
    case 'PLANNED':
      return 'bg-indigo-50 border-indigo-200';
    case 'EXECUTION':
      return 'bg-orange-50 border-orange-200';
    case 'CONNECTED':
      return 'bg-green-50 border-green-200';
    case 'CONTRACT_REQUEST':
      return 'bg-teal-50 border-teal-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
}
