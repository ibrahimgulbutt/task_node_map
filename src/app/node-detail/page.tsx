'use client';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonLabel, IonInput, IonTextarea } from '@ionic/react';
import { arrowBack, saveOutline } from 'ionicons/icons';
import { useStore } from '@/store/useStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function NodeDetailPage() {
  const searchParams = useSearchParams();
  const mapId = searchParams.get('mapId');
  const nodeId = searchParams.get('nodeId');
  
  const { nodes, updateNode } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const node = nodes.find(n => n.id === nodeId);

  // Local state for editing
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    setMounted(true);
    if (node) {
        setTitle(node.title);
        setContent(node.content);
    }
  }, [node]);

  const handleSave = () => {
      if (node && nodeId) {
          updateNode(nodeId, { title, content });
          router.back();
      }
  };

  if (!mounted) return null;

  if (!node || !mapId) {
      return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => router.back()}>
                            <IonIcon slot="icon-only" icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Node Not Found</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="text-center flex flex-col items-center justify-center h-full">
                    <p className="text-muted-foreground">The requested node does not exist.</p>
                    <IonButton onClick={() => router.back()} className="mt-4">Go Back</IonButton>
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
            <IonButton onClick={() => router.back()}>
                <IonIcon slot="icon-only" icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Edit Node</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave} strong color="primary">
                <IonIcon slot="start" icon={saveOutline} />
                Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className="flex flex-col gap-6 max-w-3xl mx-auto h-full">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <IonLabel className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2 block">Title</IonLabel>
                <IonInput 
                    value={title} 
                    onIonInput={e => setTitle(e.detail.value!)} 
                    placeholder="Node Title"
                    className="text-2xl font-bold text-foreground --padding-start-0"
                />
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex-1 flex flex-col min-h-[400px]">
                <IonLabel className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2 block">Content (Markdown)</IonLabel>
                <IonTextarea 
                    value={content} 
                    onIonInput={e => setContent(e.detail.value!)} 
                    placeholder="Enter detailed notes here..."
                    autoGrow={false}
                    className="font-mono text-sm text-foreground flex-1 h-full --padding-start-0 leading-relaxed"
                    style={{ height: '100%' }}
                />
            </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
