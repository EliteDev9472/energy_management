
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { ProfileActivity } from '@/components/profile/ProfileActivity';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/contexts/SettingsContext';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { refreshSettings } = useSettings();

  // Refresh settings when the page loads
  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white mb-2">Mijn Profiel</h1>
        <p className="text-muted-foreground mb-6">Bekijk en bewerk uw persoonlijke informatie.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileInfo />
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recente Activiteit</CardTitle>
                <CardDescription>Uw recente activiteiten en interacties.</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <ProfileActivity />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
