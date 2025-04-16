import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ConnectionRequest, ConnectionRequestStatus, EmailLog } from '@/types/project';
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle, 
  Mailbox, 
  Send,
  Mail
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  handleDragStart, 
  handleDragOver, 
  handleDrop, 
  isValidStatusTransition, 
  formatStatusChange 
} from '@/utils/dragAndDrop';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ConnectionRequestPipelineProps {
  projectId: string;
  connectionRequests: ConnectionRequest[];
  setConnectionRequests: React.Dispatch<React.SetStateAction<ConnectionRequest[]>>;
  projectEndDate?: string;
}

export function ConnectionRequestPipeline({ 
  projectId, 
  connectionRequests = [], 
  setConnectionRequests,
  projectEndDate
}: ConnectionRequestPipelineProps) {
  const [selectedRequest, setSelectedRequest] = useState<ConnectionRequest | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [connectionDate, setConnectionDate] = useState('');
  const [gridOperatorWorkNumber, setGridOperatorWorkNumber] = useState('');
  
  const gridOperators = [
    { id: 'liander', name: 'Liander', email: 'aansluitingen@liander.nl' },
    { id: 'stedin', name: 'Stedin', email: 'projecten@stedin.net' },
    { id: 'enexis', name: 'Enexis', email: 'aansluitingen@enexis.nl' },
    { id: 'coteq', name: 'Coteq', email: 'info@coteq.nl' },
    { id: 'rendo', name: 'Rendo', email: 'info@rendo.nl' },
  ];

  const statusColumns: ConnectionRequestStatus[] = [
    'concept', 'ingediend', 'in_behandeling', 'goedgekeurd', 'aangesloten'
  ];

  const statusDisplayNames: Record<ConnectionRequestStatus, string> = {
    'concept': 'Nieuwe aanvraag',
    'ingediend': 'In behandeling',
    'in_behandeling': 'Offerte geaccepteerd',
    'goedgekeurd': 'Gepland',
    'aangesloten': 'Aangesloten',
    'NEW': 'Nieuwe aanvraag',
    'IN_PROGRESS': 'In behandeling',
    'OFFER_ACCEPTED': 'Offerte geaccepteerd',
    'PLANNED': 'Gepland',
    'EXECUTION': 'Uitvoering',
    'CONNECTED': 'Aangesloten',
    'WAITING_FOR_EVI': 'Wacht op installateursverklaring',
    'WAITING_FOR_APPROVAL': 'Wacht op goedkeuring',
    'ACTIVE': 'Actief',
    'COMPLETED': 'Afgerond',
    'CANCELLED': 'Geannuleerd',
    'supplier_request': 'Leveranciersaanvraag',
    'CONTRACT_REQUEST': 'Contract aanvragen'
  };

  const handleUpdateRequestStatus = (requestId: string, oldStatus: ConnectionRequestStatus, newStatus: ConnectionRequestStatus) => {
    if (!isValidStatusTransition(oldStatus, newStatus)) {
      toast({
        title: "Ongeldige statuswijziging",
        description: `Kan status niet wijzigen van ${formatConnectionRequestStatus(oldStatus)} naar ${formatConnectionRequestStatus(newStatus)}`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedRequests = connectionRequests.map(request => {
      if (request.id === requestId) {
        if (oldStatus === 'concept' && newStatus === 'ingediend') {
          setSelectedRequest({ ...request, status: newStatus });
          prepareGridOperatorEmail(request);
          setShowEmailDialog(true);
          return request;
        }
        
        if (newStatus === 'goedgekeurd') {
          setSelectedRequest({ ...request, status: newStatus });
          setPlannedDate('');
          return request;
        }
        
        if (newStatus === 'aangesloten') {
          setSelectedRequest({ ...request, status: newStatus });
          setConnectionDate(format(new Date(), 'yyyy-MM-dd'));
          return request;
        }
        
        return { ...request, status: newStatus };
      }
      return request;
    });
    
    if (oldStatus !== 'concept' && newStatus !== 'goedgekeurd' && newStatus !== 'aangesloten') {
      setConnectionRequests(updatedRequests);
      
      toast({
        title: "Status bijgewerkt",
        description: `Aanvraagstatus is bijgewerkt: ${formatStatusChange(oldStatus, newStatus)}`,
      });
    }
  };

  const prepareGridOperatorEmail = (request: ConnectionRequest) => {
    const gridOperator = request.gridOperator ? 
      gridOperators.find(op => op.id === request.gridOperator) : 
      null;
    
    const subject = `Nieuwe aansluitaanvraag: ${request.type === 'electricity' ? 'Elektra' : 'Gas'} - ${request.address}`;
    
    let emailBody = `
Geachte ${gridOperator?.name || 'netbeheerder'},
    
Hierbij doen wij een aanvraag voor een nieuwe aansluiting:

Projectnaam: [Project Naam]
Adres: ${request.address}
Type aansluiting: ${request.type === 'electricity' ? 'Elektriciteit' : 'Gas'}
${request.capacity ? `Gevraagde capaciteit: ${request.capacity}` : ''}
${request.desiredConnectionDate ? `Gewenste aansluitdatum: ${format(new Date(request.desiredConnectionDate), 'dd-MM-yyyy')}` : ''}

Bijgevoegd vindt u de benodigde installatieschema's (indien aanwezig).

Graag ontvangen wij een bevestiging met uw referentienummer voor deze aanvraag.

Met vriendelijke groet,
[Uw naam]
[Uw bedrijf]
[Uw contactgegevens]
`;

    setEmailSubject(subject);
    setEmailContent(emailBody);
  };
  
  const handleSendEmail = () => {
    if (!selectedRequest) return;
    
    toast({
      title: "E-mail verzonden",
      description: "De aanvraag is succesvol verzonden naar de netbeheerder.",
    });
    
    const updatedRequests = connectionRequests.map(request => {
      if (request.id === selectedRequest.id) {
        const newEmailLog: EmailLog = {
          date: new Date().toISOString(),
          recipient: gridOperators.find(op => op.id === request.gridOperator)?.email || 'onbekend',
          subject: emailSubject,
          type: 'grid_operator_request'
        };
        
        return {
          ...request,
          status: 'ingediend' as ConnectionRequestStatus,
          emailLogs: [...(request.emailLogs || []), newEmailLog]
        };
      }
      return request;
    }) as ConnectionRequest[];
    
    setConnectionRequests(updatedRequests);
    setShowEmailDialog(false);
    setSelectedRequest(null);
  };
  
  const handleSetPlannedDate = () => {
    if (!selectedRequest || !plannedDate) return;
    
    const updatedRequests = connectionRequests.map(request => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          status: 'goedgekeurd' as ConnectionRequestStatus,
          plannedConnectionDate: plannedDate,
          gridOperatorWorkNumber
        };
      }
      return request;
    }) as ConnectionRequest[];
    
    setConnectionRequests(updatedRequests);
    setSelectedRequest(null);
    setPlannedDate('');
    setGridOperatorWorkNumber('');
    
    toast({
      title: "Datum gepland",
      description: `Aansluitdatum gepland op ${format(new Date(plannedDate), 'dd-MM-yyyy')}`,
    });
  };
  
  const handleSetConnectionDate = () => {
    if (!selectedRequest || !connectionDate) return;
    
    const updatedRequests = connectionRequests.map(request => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          status: 'aangesloten' as ConnectionRequestStatus,
          connectionDate: connectionDate
        };
      }
      return request;
    }) as ConnectionRequest[];
    
    setConnectionRequests(updatedRequests);
    setSelectedRequest(null);
    setConnectionDate('');
    
    toast({
      title: "Aansluiting bevestigd",
      description: `Aansluiting uitgevoerd op ${format(new Date(connectionDate), 'dd-MM-yyyy')}`,
    });
  };

  const formatConnectionRequestStatus = (status: ConnectionRequestStatus) => {
    switch(status) {
      case 'concept': return 'Concept';
      case 'ingediend': return 'Ingediend bij netbeheerder';
      case 'in_behandeling': return 'In behandeling';
      case 'goedgekeurd': return 'Gepland';
      case 'aangesloten': return 'Aangesloten';
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statusoverzicht aansluitingen</CardTitle>
        <CardDescription>
          Beheer aansluitingsaanvragen van concept tot realisatie. Sleep een aanvraag naar een andere kolom 
          om de status te wijzigen, of gebruik de knoppen binnen de aanvraag.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {statusColumns.map((status) => {
            const statusRequests = connectionRequests.filter(
              req => req.status === status
            );
            
            return (
              <PipelineColumn 
                key={status} 
                status={status} 
                requests={statusRequests}
                formatStatus={(s) => statusDisplayNames[s]}
                onCardClick={(requestId) => {
                  const request = connectionRequests.find(r => r.id === requestId);
                  if (request) {
                    setSelectedRequest(request);
                  }
                }}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(
                  event, 
                  status,
                  handleUpdateRequestStatus
                )}
              />
            );
          })}
        </div>

        <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Verzend aanvraag naar netbeheerder</DialogTitle>
              <DialogDescription>
                Pas het e-mailbericht aan en klik op verzenden om de aanvraag in te dienen bij de netbeheerder.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <Label htmlFor="recipient">Aan:</Label>
                </div>
                <div className="col-span-3">
                  <Input 
                    id="recipient" 
                    value={selectedRequest?.gridOperator ? 
                      gridOperators.find(op => op.id === selectedRequest.gridOperator)?.email || '' : 
                      ''}
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <Label htmlFor="subject">Onderwerp:</Label>
                </div>
                <div className="col-span-3">
                  <Input 
                    id="subject" 
                    value={emailSubject} 
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <Label htmlFor="message">Bericht:</Label>
                </div>
                <div className="col-span-3">
                  <Textarea 
                    id="message" 
                    value={emailContent} 
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={15}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                Annuleren
              </Button>
              <Button onClick={handleSendEmail}>
                <Send className="h-4 w-4 mr-2" /> E-mail verzenden
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog 
          open={selectedRequest?.status === 'goedgekeurd' && !showEmailDialog} 
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aansluiting inplannen</DialogTitle>
              <DialogDescription>
                Voer de geplande aansluitdatum in en eventueel het werknummer van de netbeheerder.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="planned-date">Geplande aansluitdatum</Label>
                <Input
                  id="planned-date"
                  type="date"
                  value={plannedDate}
                  onChange={(e) => setPlannedDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work-number">Werknummer netbeheerder</Label>
                <Input
                  id="work-number"
                  type="text"
                  placeholder="Optioneel"
                  value={gridOperatorWorkNumber}
                  onChange={(e) => setGridOperatorWorkNumber(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Annuleren
              </Button>
              <Button onClick={handleSetPlannedDate} disabled={!plannedDate}>
                Bevestigen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog 
          open={selectedRequest?.status === 'aangesloten' && !showEmailDialog} 
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aansluiting bevestigen</DialogTitle>
              <DialogDescription>
                Bevestig de datum waarop de aansluiting is gerealiseerd.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="connection-date">Datum aansluiting</Label>
                <Input
                  id="connection-date"
                  type="date"
                  value={connectionDate}
                  onChange={(e) => setConnectionDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Annuleren
              </Button>
              <Button onClick={handleSetConnectionDate} disabled={!connectionDate}>
                Bevestigen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

interface PipelineColumnProps {
  status: ConnectionRequestStatus;
  requests: ConnectionRequest[];
  formatStatus: (status: ConnectionRequestStatus) => string;
  onCardClick: (id: string) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, requestId: string, status: ConnectionRequestStatus) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
}

function PipelineColumn({ 
  status, 
  requests, 
  formatStatus,
  onCardClick,
  onDragStart,
  onDragOver,
  onDrop
}: PipelineColumnProps) {
  const getStatusInfo = (status: ConnectionRequestStatus) => {
    switch(status) {
      case 'concept':
        return { 
          title: 'Concept', 
          color: 'bg-gray-100 border-gray-300',
          textColor: 'text-gray-700'
        };
      case 'ingediend':
        return { 
          title: 'Ingediend bij netbeheerder', 
          color: 'bg-blue-50 border-blue-300',
          textColor: 'text-blue-700'
        };
      case 'in_behandeling':
        return { 
          title: 'In behandeling', 
          color: 'bg-yellow-50 border-yellow-300',
          textColor: 'text-yellow-700'
        };
      case 'goedgekeurd':
        return { 
          title: 'Gepland', 
          color: 'bg-purple-50 border-purple-300',
          textColor: 'text-purple-700'
        };
      case 'aangesloten':
        return { 
          title: 'Aangesloten', 
          color: 'bg-green-50 border-green-300',
          textColor: 'text-green-700'
        };
      default:
        return { 
          title: 'Onbekend', 
          color: 'bg-gray-100 border-gray-300',
          textColor: 'text-gray-700'
        };
    }
  };

  const { title, color, textColor } = getStatusInfo(status);

  return (
    <div 
      className={`rounded-md ${color} border p-3 h-full min-h-[500px]`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className={`font-medium ${textColor} mb-3 flex justify-between`}>
        {formatStatus(status)}
        <Badge variant="outline">{requests.length}</Badge>
      </div>
      
      <div className="space-y-2">
        {requests.length === 0 ? (
          <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
            Geen aanvragen
          </div>
        ) : (
          requests.map((request) => (
            <RequestCard 
              key={request.id}
              request={request}
              status={status}
              onDragStart={onDragStart}
              onClick={() => onCardClick(request.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface RequestCardProps {
  request: ConnectionRequest;
  status: ConnectionRequestStatus;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, requestId: string, status: ConnectionRequestStatus) => void;
  onClick: () => void;
}

function RequestCard({ request, status, onDragStart, onClick }: RequestCardProps) {
  return (
    <div 
      className="p-3 rounded-md bg-white border shadow-sm cursor-move hover:shadow-md transition-shadow"
      onClick={onClick}
      draggable
      onDragStart={(e) => onDragStart(e, request.id, status)}
    >
      <div className="text-sm font-medium mb-1 truncate">{request.address}</div>
      <div className="grid grid-cols-2 gap-1 text-xs mb-2">
        <div className="flex items-center">
          <Badge variant={request.type === 'electricity' ? 'default' : 'secondary'} className="text-[10px]">
            {request.type === 'electricity' ? 'Elektra' : 'Gas'}
          </Badge>
        </div>
        <div className="text-muted-foreground text-right truncate">
          {request.capacity || 'Geen capaciteit'}
        </div>
        
        {request.gridOperator && (
          <div className="text-muted-foreground col-span-2 truncate">
            Netbeheerder: {request.gridOperator}
          </div>
        )}
        
        {request.plannedConnectionDate && (
          <div className="flex items-center gap-1 col-span-2 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(request.plannedConnectionDate), 'dd-MM-yyyy')}
          </div>
        )}
        
        {request.gridOperatorWorkNumber && (
          <div className="col-span-2 text-muted-foreground truncate">
            Werknr: {request.gridOperatorWorkNumber}
          </div>
        )}
        
        {request.emailLogs && request.emailLogs.length > 0 && (
          <div className="col-span-2 text-muted-foreground flex items-center gap-1">
            <Mail className="h-3 w-3" />
            <span className="truncate">
              Email: {format(new Date(request.emailLogs[request.emailLogs.length - 1].date), 'dd-MM-yyyy')}
            </span>
          </div>
        )}
      </div>
      
      {status === 'concept' && (
        <Button size="sm" variant="default" className="w-full text-xs h-7" onClick={(e) => {
          e.stopPropagation();
          onDragStart(e as any, request.id, status);
          const dropEvent = new DragEvent('drop');
          handleDrop(dropEvent as any, 'ingediend' as ConnectionRequestStatus, (id, oldStatus, newStatus) => {
            // This will trigger the email dialog
          });
        }}>
          <Send className="h-3 w-3 mr-1" /> Verstuur aanvraag
        </Button>
      )}

      {status === 'in_behandeling' && (
        <Button size="sm" variant="outline" className="w-full text-xs h-7" onClick={(e) => {
          e.stopPropagation();
          onDragStart(e as any, request.id, status);
          const dropEvent = new DragEvent('drop');
          handleDrop(dropEvent as any, 'goedgekeurd' as ConnectionRequestStatus, (id, oldStatus, newStatus) => {
            // This will trigger the planning dialog
          });
        }}>
          <Calendar className="h-3 w-3 mr-1" /> Plan aansluiting
        </Button>
      )}

      {status === 'goedgekeurd' && (
        <Button size="sm" variant="outline" className="w-full text-xs h-7" onClick={(e) => {
          e.stopPropagation();
          onDragStart(e as any, request.id, status);
          const dropEvent = new DragEvent('drop');
          handleDrop(dropEvent as any, 'aangesloten' as ConnectionRequestStatus, (id, oldStatus, newStatus) => {
            // This will trigger the connection dialog
          });
        }}>
          <CheckCircle className="h-3 w-3 mr-1" /> Bevestig aansluiting
        </Button>
      )}
    </div>
  );
}
