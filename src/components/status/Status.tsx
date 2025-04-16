
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface StatusProps {
  status: string;
}

export const Status: React.FC<StatusProps> = ({ status }) => {
  const getStatusBadge = () => {
    const lowercaseStatus = status.toLowerCase();
    
    if (lowercaseStatus === 'new' || lowercaseStatus === 'nieuw' || lowercaseStatus === 'concept') {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Nieuw</Badge>;
    }
    
    if (lowercaseStatus === 'in_progress' || lowercaseStatus === 'in behandeling' || lowercaseStatus === 'ingediend') {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In behandeling</Badge>;
    }
    
    if (lowercaseStatus === 'offer_accepted' || lowercaseStatus === 'offerte geaccepteerd') {
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Offerte geaccepteerd</Badge>;
    }
    
    if (lowercaseStatus === 'planned' || lowercaseStatus === 'gepland' || lowercaseStatus === 'goedgekeurd') {
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Gepland</Badge>;
    }
    
    if (lowercaseStatus === 'execution' || lowercaseStatus === 'uitvoering') {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Uitvoering</Badge>;
    }
    
    if (lowercaseStatus === 'connected' || lowercaseStatus === 'aangesloten') {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aangesloten</Badge>;
    }
    
    if (lowercaseStatus === 'active' || lowercaseStatus === 'actief') {
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Actief</Badge>;
    }
    
    if (lowercaseStatus === 'canceled' || lowercaseStatus === 'geannuleerd' || lowercaseStatus === 'beëindigd') {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Geannuleerd</Badge>;
    }
    
    if (lowercaseStatus === 'supplier_request' || lowercaseStatus === 'aanmelden' || lowercaseStatus === 'contract_request') {
      return <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">Contract aanvragen</Badge>;
    }
    
    return <Badge variant="outline">{status}</Badge>;
  };

  return getStatusBadge();
};

interface StatusGroupProps {
  title: string;
  status: string;
  count: number;
  children: React.ReactNode;
}

export const StatusGroup: React.FC<StatusGroupProps> = ({ title, status, count, children }) => {
  const getColorClassByStatus = (status: string) => {
    const lowercaseStatus = status.toLowerCase();
    
    if (lowercaseStatus === 'new' || lowercaseStatus === 'nieuw' || lowercaseStatus === 'concept') {
      return 'bg-blue-50 border-blue-200';
    }
    
    if (lowercaseStatus === 'in_progress' || lowercaseStatus === 'in behandeling' || lowercaseStatus === 'ingediend') {
      return 'bg-yellow-50 border-yellow-200';
    }
    
    if (lowercaseStatus === 'offer_accepted' || lowercaseStatus === 'offerte geaccepteerd') {
      return 'bg-purple-50 border-purple-200';
    }
    
    if (lowercaseStatus === 'planned' || lowercaseStatus === 'gepland' || lowercaseStatus === 'goedgekeurd') {
      return 'bg-indigo-50 border-indigo-200';
    }
    
    if (lowercaseStatus === 'execution' || lowercaseStatus === 'uitvoering') {
      return 'bg-amber-50 border-amber-200';
    }
    
    if (lowercaseStatus === 'connected' || lowercaseStatus === 'aangesloten') {
      return 'bg-green-50 border-green-200';
    }
    
    if (lowercaseStatus === 'active' || lowercaseStatus === 'actief') {
      return 'bg-emerald-50 border-emerald-200';
    }
    
    if (lowercaseStatus === 'offer_sent' || lowercaseStatus === 'offerte verstuurd') {
      return 'bg-sky-50 border-sky-200';
    }
    
    if (lowercaseStatus === 'completed' || lowercaseStatus === 'afgerond') {
      return 'bg-teal-50 border-teal-200';
    }
    
    if (lowercaseStatus === 'canceled' || lowercaseStatus === 'geannuleerd' || lowercaseStatus === 'beëindigd') {
      return 'bg-red-50 border-red-200';
    }
    
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <Card className={`${getColorClassByStatus(status)} border h-full`}>
      <CardContent className="p-3">
        <div className="font-medium mb-3 flex justify-between">
          <span>{title}</span>
          <Badge variant="outline">{count}</Badge>
        </div>
        <div className="space-y-2">
          {count === 0 ? (
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aansluitingen
            </div>
          ) : (
            children
          )}
        </div>
      </CardContent>
    </Card>
  );
};
