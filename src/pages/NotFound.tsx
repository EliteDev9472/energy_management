
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="mb-8 rounded-full bg-orange-100 p-4 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
          <AlertTriangle className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-center">Pagina Niet Gevonden</h1>
        <p className="text-lg text-muted-foreground mb-6 text-center max-w-md">
          De pagina die u zoekt bestaat niet of is verplaatst.
        </p>
        <Button className="bg-cedrus-green hover:bg-cedrus-green-dark" asChild>
          <a href="/">Terug naar Dashboard</a>
        </Button>
      </div>
    </PageLayout>
  );
};

export default NotFound;
