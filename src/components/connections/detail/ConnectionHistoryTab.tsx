
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Connection } from "@/types/connection";
import { getPurchaseStatusBadgeStyle, getPurchaseStatusLabel, getProjectPhaseLabel } from "@/utils/connectionUtils";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { CalendarClock, Package, FileText, Zap, AlertTriangle, CheckCircle } from "lucide-react";

interface ConnectionHistoryTabProps {
  connectionId: string;
  connection?: Connection;
}

export function ConnectionHistoryTab({ connectionId, connection }: ConnectionHistoryTabProps) {
  const [activeHistoryTab, setActiveHistoryTab] = useState('timeline');
  
  // Voorbeeld historie data (in een echte implementatie zou dit van de API komen)
  const historyEvents = connection?.history || [
    {
      date: '2024-01-01',
      event: 'Contract verlengd',
      description: 'Contract verlengd voor 12 maanden',
      status: 'success'
    },
    {
      date: '2023-09-15',
      event: 'Meterwissel',
      description: 'Upgrade naar slimme meter',
      status: 'info'
    },
    {
      date: '2023-06-10',
      event: 'Inkoop energie',
      description: 'Energie ingekocht voor komende periode',
      status: 'ORDERED'
    },
    {
      date: '2023-03-20',
      event: 'Prijswijziging',
      description: 'Nieuwe tarieven doorgevoerd',
      status: 'warning'
    },
    {
      date: '2023-01-01',
      event: 'Leverancierswissel',
      description: 'Switch van Vattenfall naar Cedrus Energy',
      status: 'success'
    },
    {
      date: '2022-06-15',
      event: 'Aansluiting geactiveerd',
      description: 'Nieuwe aansluiting geactiveerd',
      status: 'success'
    },
    {
      date: '2022-05-01',
      event: 'Aanvraag ingediend',
      description: 'Aanvraag voor nieuwe aansluiting',
      status: 'REQUEST'
    }
  ];
  
  // Inkoophistorie (in een echte implementatie zou dit van de API komen)
  const purchaseHistory = [
    {
      date: '2023-06-08',
      action: 'Offerteaanvraag',
      status: 'REQUESTED',
      supplier: connection?.supplier || 'Cedrus Energy',
      reference: 'INK-2023-001'
    },
    {
      date: '2023-06-10',
      action: 'Offerte ontvangen',
      status: 'QUOTED',
      supplier: connection?.supplier || 'Cedrus Energy',
      reference: 'OFF-2023-042'
    },
    {
      date: '2023-06-10',
      action: 'Energie ingekocht',
      status: 'ORDERED',
      supplier: connection?.supplier || 'Cedrus Energy',
      reference: 'ORD-2023-078'
    },
    {
      date: '2023-06-15',
      action: 'Inkoop bevestigd',
      status: 'DELIVERED',
      supplier: connection?.supplier || 'Cedrus Energy',
      reference: 'LEV-2023-078'
    }
  ];
  
  // Statushistorie (in een echte implementatie zou dit van de API komen)
  const statusHistory = [
    {
      date: '2022-05-01',
      status: 'In aanvraag',
      phase: 'REQUEST',
      description: 'Aansluiting aangevraagd'
    },
    {
      date: '2022-05-15',
      status: 'In aanvraag',
      phase: 'PLANNING',
      description: 'Planning aansluitdatum'
    },
    {
      date: '2022-06-01',
      status: 'In aanvraag',
      phase: 'IMPLEMENTATION',
      description: 'Uitvoering werkzaamheden'
    },
    {
      date: '2022-06-15',
      status: 'Actief',
      phase: 'ACTIVE',
      description: 'Aansluiting geactiveerd'
    }
  ];
  
  // Helper functie voor status badges
  const getStatusBadge = (status: string) => {
    if (['REQUESTED', 'QUOTED', 'ORDERED', 'DELIVERED', 'CANCELED'].includes(status)) {
      return (
        <Badge 
          variant="outline" 
          className={getPurchaseStatusBadgeStyle(status)}
        >
          {getPurchaseStatusLabel(status)}
        </Badge>
      );
    }
    
    switch(status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Voltooid</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Let op</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Fout</Badge>;
      case 'info':
      default:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Info</Badge>;
    }
  };
  
  // Helper function voor iconen
  const getEventIcon = (event: string, status: string) => {
    if (['REQUESTED', 'QUOTED', 'ORDERED', 'DELIVERED', 'CANCELED'].includes(status)) {
      return <Package className="h-4 w-4 text-cedrus-accent" />;
    }
    
    if (event.toLowerCase().includes('contract')) {
      return <FileText className="h-4 w-4 text-cedrus-accent" />;
    }
    
    if (event.toLowerCase().includes('meter') || event.toLowerCase().includes('aansluiting')) {
      return <Zap className="h-4 w-4 text-cedrus-accent" />;
    }
    
    if (status === 'warning' || status === 'error') {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    }
    
    if (status === 'success') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    return <CalendarClock className="h-4 w-4 text-cedrus-accent" />;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Historische gegevens</h3>
        
        <Tabs value={activeHistoryTab} onValueChange={setActiveHistoryTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="timeline">Tijdlijn</TabsTrigger>
            <TabsTrigger value="purchase">Inkoophistorie</TabsTrigger>
            <TabsTrigger value="status">Statushistorie</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline">
            <div className="space-y-6">
              <div className="border-l-2 border-cedrus-accent/30 pl-4 space-y-6">
                {historyEvents.map((event, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-cedrus-accent"></div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getEventIcon(event.event, event.status)}
                        <p className="text-sm font-medium">{event.event}</p>
                        {getStatusBadge(event.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(event.date), 'd MMMM yyyy', { locale: nl })}
                      </p>
                      <p className="text-sm mt-1">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="purchase">
            <div className="space-y-4">
              {purchaseHistory.map((item, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-cedrus-accent" />
                        <p className="font-medium">{item.action}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(parseISO(item.date), 'd MMMM yyyy', { locale: nl })}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getPurchaseStatusBadgeStyle(item.status)}
                    >
                      {getPurchaseStatusLabel(item.status)}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>Leverancier: {item.supplier}</p>
                    <p>Referentie: {item.reference}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="status">
            <div className="space-y-6">
              <div className="border-l-2 border-cedrus-accent/30 pl-4 space-y-6">
                {statusHistory.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-cedrus-accent"></div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Status: {item.status}</p>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {getProjectPhaseLabel(item.phase)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(item.date), 'd MMMM yyyy', { locale: nl })}
                      </p>
                      <p className="text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
