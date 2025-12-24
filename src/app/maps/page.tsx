'use client';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonButton, IonButtons, useIonAlert, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { add, mapOutline, trashOutline, openOutline, timeOutline, arrowForward } from 'ionicons/icons';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function MapsPage() {
  const { maps, addMap, deleteMap, nodes } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateMap = () => {
    presentAlert({
      header: 'New Mind Map',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Enter map name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Create',
          handler: (data) => {
            if (data.title) {
                const id = addMap(data.title);
                router.push(`/map-detail?id=${id}`);
            }
          },
        },
      ],
    });
  };

  const handleDeleteMap = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    presentAlert({
        header: 'Delete Map',
        message: 'Are you sure? This will delete all nodes in this map.',
        buttons: [
            'Cancel',
            {
                text: 'Delete',
                role: 'destructive',
                handler: () => deleteMap(id)
            }
        ]
    });
  };

  const getMapNodeCount = (mapId: string) => {
      return nodes.filter(n => n.mapId === mapId).length;
  };

  if (!mounted) return null;

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="pt-4 pb-2">
          <IonTitle size="large" className="font-bold text-4xl tracking-tight">My Maps</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="bg-background">
        <div className="px-5 pt-2 pb-32 grid grid-cols-1 gap-5">
          {maps.map((map) => (
            <div 
                key={map.id} 
                onClick={() => router.push(`/map-detail?id=${map.id}`)}
                className="group relative overflow-hidden rounded-3xl bg-card border border-white/5 shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-opacity group-hover:opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
                
                <div className="relative p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-inner group-hover:from-primary/30 transition-colors">
                                <IonIcon icon={mapOutline} className="text-2xl text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{map.title}</h3>
                                <p className="text-xs text-muted-foreground font-medium mt-1 flex items-center gap-1.5">
                                    <IonIcon icon={timeOutline} />
                                    {new Date(map.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={(e) => handleDeleteMap(e, map.id)}
                            className="text-muted-foreground/40 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2 rounded-full hover:bg-red-500/10"
                        >
                            <IonIcon icon={trashOutline} className="text-xl" />
                        </button>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-secondary/50 border border-white/5 text-xs font-semibold text-secondary-foreground">
                                {getMapNodeCount(map.id)} Nodes
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                            Open <IonIcon icon={arrowForward} />
                        </div>
                    </div>
                </div>
            </div>
          ))}

          {maps.length === 0 && (
            <div className="text-center py-24 px-6 text-muted-foreground border-2 border-dashed border-border/50 rounded-3xl bg-card/20 mt-4 flex flex-col items-center justify-center">
                <div className="bg-muted/30 w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <IonIcon icon={mapOutline} className="text-4xl opacity-50" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No Mind Maps Yet</h3>
                <p className="text-sm opacity-70 max-w-xs mx-auto leading-relaxed">
                    Create your first mind map to start organizing your thoughts visually.
                </p>
            </div>
          )}
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" className="mb-24 mr-4 z-50">
          <IonFabButton onClick={handleCreateMap} color="primary" className="shadow-xl hover:scale-110 transition-transform">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}
