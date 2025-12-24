'use client';

import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { checkmarkDoneCircleOutline, gitNetworkOutline, timerOutline, mapOutline, settingsOutline } from 'ionicons/icons';
import { usePathname, useRouter } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <IonTabBar slot="bottom" className="border-t border-border pb-safe">
      <IonTabButton tab="tasks" selected={pathname === '/'} onClick={() => router.push('/')}>
        <IonIcon icon={checkmarkDoneCircleOutline} />
        <IonLabel>Tasks</IonLabel>
      </IonTabButton>
      <IonTabButton tab="mindmap" selected={pathname === '/mindmap'} onClick={() => router.push('/mindmap')}>
        <IonIcon icon={gitNetworkOutline} />
        <IonLabel>Mind Map</IonLabel>
      </IonTabButton>
      <IonTabButton tab="maps" selected={pathname === '/maps'} onClick={() => router.push('/maps')}>
        <IonIcon icon={mapOutline} />
        <IonLabel>Maps</IonLabel>
      </IonTabButton>
      <IonTabButton tab="focus" selected={pathname === '/focus'} onClick={() => router.push('/focus')}>
        <IonIcon icon={timerOutline} />
        <IonLabel>Focus</IonLabel>
      </IonTabButton>
      <IonTabButton tab="settings" selected={pathname === '/settings'} onClick={() => router.push('/settings')}>
        <IonIcon icon={settingsOutline} />
        <IonLabel>Settings</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
}
