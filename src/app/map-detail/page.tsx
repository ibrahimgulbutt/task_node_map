'use client';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButtons, IonBackButton, IonButton, IonIcon, useIonAlert } from '@ionic/react';
import { pencil, openOutline, arrowBack } from 'ionicons/icons';
import { useStore } from '@/store/useStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';

export default function MapDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { maps, nodes, updateMap } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [presentAlert] = useIonAlert();

  const map = maps.find(m => m.id === id);
  const mapNodes = useMemo(() => nodes.filter(n => n.mapId === id), [nodes, id]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditTitle = () => {
    if (!map || !id) return;
    presentAlert({
      header: 'Edit Map Name',
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: map.title,
          placeholder: 'Enter map name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: (data) => {
            if (data.title) {
                updateMap(id, { title: data.title });
            }
          },
        },
      ],
    });
  };

  if (!mounted) return null;

  if (!map || !id) {
      return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => router.push('/maps')}>
                            <IonIcon slot="icon-only" icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Map Not Found</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="text-center flex flex-col items-center justify-center h-full">
                    <p className="text-muted-foreground mb-4">The requested map does not exist.</p>
                    <IonButton onClick={() => router.push('/maps')}>Go Back</IonButton>
                </div>
            </IonContent>
        </IonPage>
      );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => router.push('/maps')}>
                <IonIcon slot="icon-only" icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{map.title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleEditTitle}>
                <IonIcon slot="icon-only" icon={pencil} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        
        <div className="flex justify-center mb-8 mt-4">
            <IonButton expand="block" className="w-full max-w-md h-12 font-bold" onClick={() => router.push(`/mindmap?id=${id}`)}>
                <IonIcon slot="start" icon={openOutline} className="mr-2" />
                Open Mind Map Canvas
            </IonButton>
        </div>

        <div className="px-2 mb-4 border-b border-border pb-2">
            <h2 className="text-xl font-bold text-foreground">Nodes ({mapNodes.length})</h2>
        </div>

        <IonList inset className="bg-transparent m-0 p-0">
          {mapNodes.map((node) => (
            <IonItem 
                key={node.id} 
                button 
                onClick={() => router.push(`/node-detail?mapId=${id}&nodeId=${node.id}`)}
                className="mb-3 rounded-xl border border-border bg-card overflow-hidden"
                lines="none"
            >
              <IonLabel className="py-2">
                <h3 className="font-bold text-lg text-foreground">{node.title}</h3>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {node.content || 'No additional content'}
                </p>
              </IonLabel>
            </IonItem>
          ))}
          {mapNodes.length === 0 && (
             <div className="text-center p-10 text-muted-foreground border-2 border-dashed border-border rounded-xl bg-card/50">
                <p className="text-lg font-medium">No nodes yet</p>
                <p className="text-sm opacity-70 mt-1">Open the canvas to add your first idea!</p>
            </div>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
