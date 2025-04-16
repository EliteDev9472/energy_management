
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Header } from '@/components/layout/Header';
import { useIsMobile } from '@/hooks/use-mobile';

type PageLayoutProps = {
  children: React.ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const isMobile = useIsMobile();
  
  // Adjust for mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarWidth(0);
    } else {
      setSidebarWidth(250);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isMobile && <Sidebar />}
      <Header sidebarWidth={sidebarWidth} />
      <main
        className="flex-1 pt-16 transition-all duration-300 overflow-x-hidden"
        style={{ marginLeft: isMobile ? 0 : `${sidebarWidth}px` }}
      >
        <div className="container mx-auto py-4 md:py-6 px-3 md:px-4 max-w-[1600px]">
          {children}
        </div>
      </main>
    </div>
  );
}
