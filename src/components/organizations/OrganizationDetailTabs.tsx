
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrganizationInfoTab } from './OrganizationInfoTab';
import { OrganizationEntitiesTab } from './OrganizationEntitiesTab';
import { OrganizationHierarchyTab } from './OrganizationHierarchyTab';
import { OrganizationFinanceTab } from './OrganizationFinanceTab';
import { OrganizationBillingTab } from './OrganizationBillingTab';
import { OrganizationDeletionDialog } from './OrganizationDeletionDialog';
import type { OrganizationWithDeletionInfo } from '@/services/organizations';

interface OrganizationDetailTabsProps {
  organization: OrganizationWithDeletionInfo;
  onUpdate: (data: Partial<OrganizationWithDeletionInfo>) => Promise<void>;
  onMarkForDeletion: () => Promise<void>;
  onCancelDeletion: () => Promise<void>;
  onMandateUpload: (file: File) => Promise<void>;
  onRefresh: () => void;
}

export function OrganizationDetailTabs({
  organization,
  onUpdate,
  onMarkForDeletion,
  onCancelDeletion,
  onMandateUpload,
  onRefresh
}: OrganizationDetailTabsProps) {
  const [showDeletionDialog, setShowDeletionDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const handleDelete = async () => {
    try {
      await onMarkForDeletion();
      setShowDeletionDialog(false);
    } catch (error) {
      console.error('Error marking organization for deletion:', error);
    }
  };

  return (
    <>
      <Tabs defaultValue="info" className="border rounded-lg" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b px-4 py-2">
          <TabsTrigger value="info">Informatie</TabsTrigger>
          <TabsTrigger value="entities">Entiteiten</TabsTrigger>
          <TabsTrigger value="hierarchy">Hiërarchie</TabsTrigger>
          <TabsTrigger value="finance">Financieel</TabsTrigger>
          <TabsTrigger value="billing">Facturatie</TabsTrigger>
        </TabsList>

        {/* Organization Info Tab */}
        <TabsContent value="info" className="p-4">
          <OrganizationInfoTab
            organization={organization}
            onUpdate={onUpdate}
            onDelete={() => setShowDeletionDialog(true)}
            onCancelDeletion={onCancelDeletion}
            onMandateUpload={onMandateUpload}
          />
        </TabsContent>

        {/* Entities Tab */}
        <TabsContent value="entities" className="p-4">
          <OrganizationEntitiesTab
            organizationId={organization.id}
            organizationName={organization.name}
          />
        </TabsContent>

        {/* Hierarchy Tab */}
        <TabsContent value="hierarchy" className="p-4">
          <OrganizationHierarchyTab
            organizationId={organization.id}
          // onRefresh={onRefresh}
          />
        </TabsContent>

        {/* Finance Tab */}
        <TabsContent value="finance" className="p-4">
          <OrganizationFinanceTab
            organization={organization}
            onUpdate={onUpdate}
          />
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="p-4">
          <OrganizationBillingTab organizationId={organization.id} />
        </TabsContent>
      </Tabs>

      {/* Deletion Confirmation Dialog */}
      <OrganizationDeletionDialog
        open={showDeletionDialog}
        onClose={() => setShowDeletionDialog(false)}
        onConfirm={handleDelete}
        organizationName={organization.name}
      />
    </>
  );
}
