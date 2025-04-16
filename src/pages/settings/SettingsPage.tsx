
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { General } from '@/components/settings/General';
import { Password } from '@/components/settings/Password';
import { Notifications } from '@/components/settings/Notifications';
import { useSettings } from '@/contexts/SettingsContext';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Users, Building } from 'lucide-react';
import { UserManagement } from '@/components/settings/UserManagement';
import { ClientManagement } from '@/components/settings/ClientManagement';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { refreshSettings, loading } = useSettings();
  const { loading: authLoading, isAdmin, isConsultant } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const navigate = useNavigate();

  // Refresh settings when the page loads
  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // Redirect to appropriate section based on URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section && ['general', 'password', 'notifications', 'users', 'clients'].includes(section)) {
      setActiveTab(section);
    }
  }, []);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/settings?section=${value}`, { replace: true });
  };

  if (authLoading || loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="h-12 w-12 animate-spin text-cedrus-blue" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white mb-2">Instellingen</h1>
        <p className="text-muted-foreground mb-6">Beheer uw accountinstellingen en voorkeuren.</p>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Instellingen</CardTitle>
            <CardDescription>Pas uw account aan naar uw voorkeuren.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-4">
                <TabsTrigger value="general">Algemeen</TabsTrigger>
                <TabsTrigger value="password">Wachtwoord</TabsTrigger>
                <TabsTrigger value="notifications">Notificaties</TabsTrigger>
                {isAdmin() && (
                  <TabsTrigger value="users">
                    <Users className="mr-2 h-4 w-4" />
                    Gebruikersbeheer
                  </TabsTrigger>
                )}
                {(isAdmin() || isConsultant()) && (
                  <TabsTrigger value="clients">
                    <Building className="mr-2 h-4 w-4" />
                    Klantenbeheer
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="general">
                <General />
              </TabsContent>
              <TabsContent value="password">
                <Password />
              </TabsContent>
              <TabsContent value="notifications">
                <Notifications />
              </TabsContent>
              {isAdmin() && (
                <TabsContent value="users">
                  <UserManagement />
                </TabsContent>
              )}
              {(isAdmin() || isConsultant()) && (
                <TabsContent value="clients">
                  <ClientManagement />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
