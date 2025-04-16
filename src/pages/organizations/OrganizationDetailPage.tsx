
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { OrganizationDetailTabs } from '@/components/organizations/OrganizationDetailTabs';
import { organizationService, type OrganizationWithDeletionInfo } from '@/services/organizations';
import { get24HoursFromNow } from '@/utils/dateUtils';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { hierarchyService } from '@/services/hierarchyService';

export default function OrganizationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<OrganizationWithDeletionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrganization = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const orgData = await organizationService.getOrganizationById(id);

      if (!orgData) {
        toast({
          title: "Organisatie niet gevonden",
          description: "De gevraagde organisatie kon niet worden gevonden.",
          variant: "destructive",
        });
        navigate('/organizations');
        return;
      }

      // Fetch entities for this organization
      const entities = await hierarchyService.getEntitiesByOrganization(id);

      setOrganization({
        ...orgData,
        entities: entities
      });
    } catch (error) {
      console.error('Error fetching organization:', error);
      toast({
        title: "Fout bij ophalen organisatie",
        description: "Er is een fout opgetreden bij het ophalen van de organisatie.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [id, navigate]);

  const handleUpdate = async (updatedData: Partial<OrganizationWithDeletionInfo>) => {
    if (!organization) return;

    try {
      console.log("Updating organization with data:", updatedData);

      const updated = await organizationService.updateOrganization({
        id: organization.id,
        ...updatedData
      });

      if (updated) {
        setOrganization(prev => prev ? { ...prev, ...updated } : updated);

        toast({
          title: "Organisatie bijgewerkt",
          description: "De organisatie is succesvol bijgewerkt.",
        });
      }
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        title: "Fout bij bijwerken",
        description: "Er is een fout opgetreden bij het bijwerken van de organisatie.",
        variant: "destructive",
      });
    }
  };

  const handleMarkForDeletion = async () => {
    if (!organization) return;

    try {
      const scheduledDeletionTime = get24HoursFromNow();
      const success = await organizationService.markForDeletion(organization.id, scheduledDeletionTime);

      if (success) {
        setOrganization(prev => prev ? {
          ...prev,
          pendingDeletion: true,
          scheduledDeletionTime: scheduledDeletionTime.toISOString()
        } : null);

        toast({
          title: "Verwijdering gepland",
          description: "De organisatie wordt over 24 uur verwijderd.",
        });
      }
    } catch (error) {
      console.error('Error marking organization for deletion:', error);
      toast({
        title: "Fout bij plannen verwijdering",
        description: "Er is een fout opgetreden bij het plannen van de verwijdering.",
        variant: "destructive",
      });
    }
  };

  const handleCancelDeletion = async () => {
    if (!organization) return;

    try {
      const success = await organizationService.cancelDeletion(organization.id);

      if (success) {
        setOrganization(prev => prev ? {
          ...prev,
          pendingDeletion: false,
          scheduledDeletionTime: undefined
        } : null);

        toast({
          title: "Verwijdering geannuleerd",
          description: "De geplande verwijdering is geannuleerd.",
        });
      }
    } catch (error) {
      console.error('Error canceling organization deletion:', error);
      toast({
        title: "Fout bij annuleren verwijdering",
        description: "Er is een fout opgetreden bij het annuleren van de verwijdering.",
        variant: "destructive",
      });
    }
  };

  const handleMandateUpload = async (file: File) => {
    if (!organization) return;

    try {
      const success = await organizationService.uploadMandate(organization.id, file);

      if (success) {
        // Refresh organization data to get the new mandate file path
        fetchOrganization();

        toast({
          title: "Volmacht geüpload",
          description: "De volmacht is succesvol geüpload.",
        });
      }
    } catch (error) {
      console.error('Error uploading mandate:', error);
      toast({
        title: "Fout bij uploaden volmacht",
        description: "Er is een fout opgetreden bij het uploaden van de volmacht.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/organizations')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <h1 className="text-3xl font-bold">Organisatie laden...</h1>
        </div>
      </PageLayout>
    );
  }

  if (!organization) {
    return (
      <PageLayout>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/organizations')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <h1 className="text-3xl font-bold">Organisatie niet gevonden</h1>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <RoleGuard allowedRoles={['admin', 'consultant']}>
        <div className="animate-fade-in">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/organizations')}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Terug
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">
                  {organization.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Organisatie Details
                </p>
              </div>
            </div>

            {organization.pendingDeletion ? (
              <Button
                variant="outline"
                className="text-destructive border-destructive"
                onClick={handleCancelDeletion}
              >
                Verwijdering annuleren
              </Button>
            ) : null}
          </div>
          <OrganizationDetailTabs
            organization={organization}
            onUpdate={handleUpdate}
            onMarkForDeletion={handleMarkForDeletion}
            onCancelDeletion={handleCancelDeletion}
            onMandateUpload={handleMandateUpload}
            onRefresh={fetchOrganization}
          />
        </div>
      </RoleGuard>
    </PageLayout>
  );
}
