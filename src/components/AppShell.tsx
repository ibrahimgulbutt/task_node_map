'use client';

import { IonApp, IonRouterOutlet } from '@ionic/react';
import BottomNav from './BottomNav';
import { usePathname } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <IonApp>
      {/* 
        We wrap children in a div that takes full height minus the tab bar.
        Or we rely on IonPage in children to handle it.
        But we need to ensure content isn't hidden behind the tab bar.
        IonTabBar is usually fixed.
      */}
      <div className="flex-1 h-full overflow-hidden pb-[56px]">
        {children}
      </div>
      <BottomNav />
    </IonApp>
  );
}
