
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnergyContractPipeline } from '@/components/projects/energy-contract/EnergyContractPipeline';
import { ConnectionRequest } from '@/types/project';
import { ConnectionRequestsService } from '@/services/connections/connectionRequestsService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface ConnectionPipelineTabProps {
  objectId: string;
  objectName: string;
  projectId?: string;
}

export const ConnectionPipelineTab = ({ objectId, objectName, projectId }: ConnectionPipelineTabProps) => {
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnectionRequests = async () => {
      setIsLoading(true);
      try {
        // For demo purposes, create some fake connection requests associated with this object
        const mockRequests: ConnectionRequest[] = [
          {
            id: `mock-req-1-${objectId}`,
            address: objectName,
            city: 'Amsterdam',
            postalCode: '1011XY',
            type: 'electricity',
            status: 'aangesloten',
            gridOperator: 'Liander',
            requestDate: new Date().toISOString(),
            desiredConnectionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            ean: '871687167261534600',
            connectionDate: new Date().toISOString(),
            projectId: projectId,
            objectId: objectId,
            objectName: objectName,
            capacity: '3x25A'
          },
          {
            id: `mock-req-2-${objectId}`,
            address: objectName,
            city: 'Amsterdam',
            postalCode: '1011XY',
            type: 'gas',
            status: 'aangesloten',
            gridOperator: 'Stedin',
            requestDate: new Date().toISOString(),
            desiredConnectionDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            ean: '871687167261598700',
            connectionDate: new Date().toISOString(),
            projectId: projectId,
            objectId: objectId,
            objectName: objectName,
            capacity: 'G4'
          }
        ];

        // Fetch real data if available, or use mock data for demo
        const realRequests = await ConnectionRequestsService.getConnectionRequestsByObjectId(objectId);

        setConnectionRequests(realRequests.length > 0 ? realRequests : mockRequests);
      } catch (error) {
        console.error('Error fetching connection requests:', error);
        setConnectionRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnectionRequests();
  }, [objectId, objectName, projectId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Energiecontract aanvragen voor {objectName}</h2>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Energiecontract aanvragen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-muted-foreground">
              Beheer energiecontracten voor aansluitingen in dit object.
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Energiecontract aanvragen</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent"></div>
              </div>
            ) : (
              <EnergyContractPipeline
                projectId={projectId || objectId}
                connectionRequests={connectionRequests}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
