'use client';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
  const { tasks, sessions, nodes } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
      setMounted(true);
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalNotes = nodes.length;
  const totalFocusMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

  // Mock data for weekly stats (since we don't have historical data in store yet properly aggregated)
  const data = [
      { name: 'Mon', tasks: 4, focus: 2 },
      { name: 'Tue', tasks: 3, focus: 1.5 },
      { name: 'Wed', tasks: 5, focus: 3 },
      { name: 'Thu', tasks: 2, focus: 1 },
      { name: 'Fri', tasks: 6, focus: 4 },
      { name: 'Sat', tasks: 1, focus: 0.5 },
      { name: 'Sun', tasks: 0, focus: 0 },
  ];

  if (!mounted) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Analytics</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonGrid>
            <IonRow>
                <IonCol size="6">
                    <IonCard className="m-0 h-full">
                        <IonCardHeader>
                            <IonCardTitle className="text-lg">Tasks</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <div className="text-3xl font-bold">{completedTasks}/{totalTasks}</div>
                            <div className="text-sm text-muted-foreground">Completed</div>
                        </IonCardContent>
                    </IonCard>
                </IonCol>
                <IonCol size="6">
                    <IonCard className="m-0 h-full">
                        <IonCardHeader>
                            <IonCardTitle className="text-lg">Focus</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <div className="text-3xl font-bold">{totalFocusHours}h</div>
                            <div className="text-sm text-muted-foreground">Total Time</div>
                        </IonCardContent>
                    </IonCard>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol size="12">
                    <IonCard className="m-0 mt-2">
                        <IonCardHeader>
                            <IonCardTitle className="text-lg">Notes Created</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <div className="text-3xl font-bold">{totalNotes}</div>
                        </IonCardContent>
                    </IonCard>
                </IonCol>
            </IonRow>
        </IonGrid>

        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Weekly Activity</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                                itemStyle={{ color: '#f8fafc' }}
                                cursor={{ fill: '#334155', opacity: 0.4 }}
                            />
                            <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="focus" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}
