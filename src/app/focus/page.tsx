'use client';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonModal, IonList, IonItem, IonCheckbox, IonNote, useIonAlert } from '@ionic/react';
import { play, pause, refresh, checkmarkCircle } from 'ionicons/icons';
import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { SessionType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function FocusPage() {
  const { activeFocus, startFocus, pauseFocus, resumeFocus, stopFocus, addSession, tasks, toggleTask, settings } = useStore();
  const [selectedType, setSelectedType] = useState<SessionType>('Focus');
  
  // Dynamic durations based on settings
  const getDurations = () => ({
      'Focus': (settings?.focusDuration || 25) * 60,
      'Short Break': 5 * 60,
      'Long Break': 15 * 60,
  });

  const [displayTime, setDisplayTime] = useState(getDurations()['Focus']);
  const [mounted, setMounted] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [presentAlert] = useIonAlert();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
      setMounted(true);
      // Initialize display time from store
      if (activeFocus.isActive && activeFocus.startTime) {
          const elapsed = Math.floor((Date.now() - activeFocus.startTime) / 1000);
          setDisplayTime(Math.max(0, activeFocus.duration - elapsed));
      } else {
          // If not active, update to current setting if it's a fresh state
          if (activeFocus.remaining === activeFocus.duration) {
             setDisplayTime(getDurations()['Focus']);
          } else {
             setDisplayTime(activeFocus.remaining);
          }
      }
  }, []);

  // Sync selected type with active focus if active
  useEffect(() => {
      if (activeFocus.isActive || activeFocus.remaining !== activeFocus.duration) {
          setSelectedType(activeFocus.type);
      }
  }, [activeFocus.type, activeFocus.isActive, activeFocus.remaining, activeFocus.duration]);

  // Update display time when selection changes (and not active)
  useEffect(() => {
      if (!activeFocus.isActive && activeFocus.remaining === activeFocus.duration) {
          setDisplayTime(getDurations()[selectedType]);
      }
  }, [selectedType, activeFocus.isActive, activeFocus.remaining, activeFocus.duration, settings.focusDuration]); // Added settings dependency

  // Timer Logic
  useEffect(() => {
      if (activeFocus.isActive && activeFocus.startTime) {
          timerRef.current = setInterval(() => {
              const elapsed = Math.floor((Date.now() - activeFocus.startTime!) / 1000);
              const remaining = activeFocus.duration - elapsed;
              
              if (remaining <= 0) {
                  // Session Complete
                  stopFocus();
                  addSession({
                      id: uuidv4(),
                      durationMinutes: activeFocus.duration / 60,
                      startTime: new Date(activeFocus.startTime!).toISOString(),
                      endTime: new Date().toISOString(),
                      isCompleted: true,
                      sessionType: activeFocus.type,
                      taskId: activeFocus.taskId
                  });
                  setDisplayTime(0);
                  presentAlert({
                      header: 'Session Complete!',
                      message: 'Great job! Take a break or start another session.',
                      buttons: ['OK']
                  });
              } else {
                  setDisplayTime(remaining);
              }
          }, 1000);
      } else {
          // If paused or stopped, show stored remaining
          if (activeFocus.remaining !== activeFocus.duration || activeFocus.isActive) {
             setDisplayTime(activeFocus.remaining);
          }
          if (timerRef.current) clearInterval(timerRef.current);
      }

      return () => {
          if (timerRef.current) clearInterval(timerRef.current);
      };
  }, [activeFocus, stopFocus, addSession, presentAlert]);

  const handleStartClick = () => {
      if (activeFocus.remaining < activeFocus.duration && activeFocus.remaining > 0) {
          // Resuming
          resumeFocus();
      } else {
          // Starting new
          if (selectedType === 'Focus') {
             setShowTaskModal(true);
          } else {
             startFocus(selectedType, getDurations()[selectedType]);
          }
      }
  };

  const confirmStart = () => {
      setShowTaskModal(false);
      startFocus('Focus', getDurations()['Focus'], selectedTaskId || undefined);
  };

  const handleReset = () => {
      stopFocus();
      setDisplayTime(getDurations()[selectedType]);
  };

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const duration = activeFocus.isActive || activeFocus.remaining !== activeFocus.duration ? activeFocus.duration : getDurations()[selectedType];
  const progress = 1 - (displayTime / duration);

  if (!mounted) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Focus Mode</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className="flex flex-col items-center justify-center h-full gap-8 max-w-md mx-auto">
            
            <IonSegment 
                value={selectedType} 
                disabled={activeFocus.isActive || (activeFocus.remaining !== activeFocus.duration)}
                onIonChange={(e) => setSelectedType(e.detail.value as SessionType)}
                className="w-full"
            >
                <IonSegmentButton value="Focus">
                    <IonLabel>Focus</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="Short Break">
                    <IonLabel>Short</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="Long Break">
                    <IonLabel>Long</IonLabel>
                </IonSegmentButton>
            </IonSegment>

            {/* Timer Circle */}
            <div className="relative w-72 h-72 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted opacity-20" />
                    <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        strokeDasharray="283" 
                        strokeDashoffset={283 * (1 - progress)}
                        className="text-primary transition-all duration-1000 ease-linear"
                        strokeLinecap="round"
                    />
                </svg>
                
                <div className="flex flex-col items-center z-10">
                    <div className="text-7xl font-bold font-mono tracking-tighter text-foreground">
                        {formatTime(displayTime)}
                    </div>
                    <div className="text-muted-foreground font-medium mt-2 uppercase tracking-widest text-sm">
                        {activeFocus.isActive ? 'Running' : (activeFocus.remaining !== activeFocus.duration ? 'Paused' : 'Ready')}
                    </div>
                </div>
            </div>

            {/* Active Task Display */}
            {activeFocus.taskId && (
                <div className="w-full max-w-xs bg-card/50 border border-border rounded-xl p-4 text-center backdrop-blur-sm">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Focusing on</p>
                    <p className="font-bold text-lg line-clamp-1 mb-2">{tasks.find(t => t.id === activeFocus.taskId)?.title || 'Unknown Task'}</p>
                    
                    {activeFocus.isActive && (
                        <IonButton 
                            fill="solid" 
                            size="small" 
                            color="success" 
                            shape="round"
                            onClick={() => toggleTask(activeFocus.taskId!)}
                        >
                            <IonIcon slot="start" icon={checkmarkCircle} />
                            Complete Task
                        </IonButton>
                    )}
                </div>
            )}

            {/* Controls */}
            <div className="flex gap-6 items-center justify-center">
                 {/* Reset Button */}
                 {(activeFocus.isActive || activeFocus.remaining !== activeFocus.duration) && (
                    <IonButton 
                        size="large" 
                        fill="outline" 
                        shape="round"
                        color="medium" 
                        onClick={handleReset}
                    >
                        <IonIcon slot="icon-only" icon={refresh} />
                    </IonButton>
                )}

                {!activeFocus.isActive ? (
                    <IonButton 
                        size="large" 
                        shape="round" 
                        className="w-24 h-24 shadow-xl"
                        color="primary"
                        onClick={handleStartClick}
                    >
                        <IonIcon slot="icon-only" icon={play} size="large" />
                    </IonButton>
                ) : (
                    <IonButton 
                        size="large" 
                        shape="round" 
                        color="warning" 
                        className="w-24 h-24 shadow-xl"
                        onClick={pauseFocus}
                    >
                        <IonIcon slot="icon-only" icon={pause} size="large" />
                    </IonButton>
                )}
            </div>
        </div>

        {/* Task Selection Modal */}
        <IonModal isOpen={showTaskModal} onDidDismiss={() => setShowTaskModal(false)} initialBreakpoint={0.5} breakpoints={[0, 0.5, 0.75]}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Select a Task</IonTitle>
                    <IonButton slot="end" fill="clear" onClick={() => setShowTaskModal(false)}>Close</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="p-4">
                    <p className="text-muted-foreground text-sm mb-4 text-center">
                        Choose a task to work on during this session.
                    </p>
                    <IonList inset>
                        {tasks.filter(t => !t.isCompleted && (t.date === new Date().toISOString().split('T')[0] || (!t.date && t.createdAt.split('T')[0] === new Date().toISOString().split('T')[0]))).map(task => (
                            <IonItem key={task.id} button onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}>
                                <IonCheckbox slot="start" checked={selectedTaskId === task.id} />
                                <IonLabel>
                                    <h2>{task.title}</h2>
                                    <p>{task.priority} Priority</p>
                                </IonLabel>
                            </IonItem>
                        ))}
                        {tasks.filter(t => !t.isCompleted && (t.date === new Date().toISOString().split('T')[0] || (!t.date && t.createdAt.split('T')[0] === new Date().toISOString().split('T')[0]))).length === 0 && (
                            <div className="text-center p-4 text-muted-foreground">
                                No pending tasks for today.
                            </div>
                        )}
                    </IonList>
                    <IonButton expand="block" className="mt-4" onClick={confirmStart}>
                        Start Focus {selectedTaskId ? 'With Task' : 'Without Task'}
                    </IonButton>
                </div>
            </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
}
