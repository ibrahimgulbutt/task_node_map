'use client';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonListHeader, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SettingsPage() {
  const { tasks, sessions, nodes, settings, updateSettings } = useStore();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
      setMounted(true);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = (ev: any) => {
      setDarkMode(ev.detail.checked);
      document.body.classList.toggle('dark', ev.detail.checked);
  };

  // Analytics Data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalNotes = nodes.length;
  const totalFocusMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

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
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList inset>
            <IonListHeader>
                <IonLabel>Preferences</IonLabel>
            </IonListHeader>
            <IonItem>
                <IonLabel>Dark Mode</IonLabel>
                <IonToggle slot="end" checked={darkMode} onIonChange={toggleDarkMode} />
            </IonItem>
            <IonItem>
                <IonLabel>Notifications</IonLabel>
                <IonToggle slot="end" checked={notifications} onIonChange={e => setNotifications(e.detail.checked)} />
            </IonItem>
            <IonItem>
                <IonSelect 
                    label="Focus Duration" 
                    value={settings.focusDuration.toString()} 
                    onIonChange={(e) => updateSettings({ focusDuration: parseInt(e.detail.value) })}
                    interfaceOptions={{
                        cssClass: 'my-custom-alert'
                    }}
                >
                    <IonSelectOption value="20">20 Minutes</IonSelectOption>
                    <IonSelectOption value="25">25 Minutes</IonSelectOption>
                    <IonSelectOption value="30">30 Minutes</IonSelectOption>
                    <IonSelectOption value="45">45 Minutes</IonSelectOption>
                    <IonSelectOption value="60">60 Minutes</IonSelectOption>
                </IonSelect>
            </IonItem>
        </IonList>

        <div className="px-4 mt-6 mb-2">
            <h2 className="text-lg font-semibold text-foreground ml-2">Analytics</h2>
        </div>

        <IonGrid className="px-4">
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
        </IonGrid>

        <IonCard className="mx-4 mt-4">
            <IonCardHeader>
                <IonCardTitle>Weekly Activity</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <div className="h-48 w-full">
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
        
        <div className="p-4 text-center text-muted-foreground text-sm mt-4">
            <p>Node Mind v1.1.0</p>
        </div>
      </IonContent>
    </IonPage>
  );
}
