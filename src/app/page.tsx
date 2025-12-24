'use client';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonLabel, IonCheckbox, IonBadge, IonItemSliding, IonItemOptions, IonItemOption, useIonAlert, IonCard, IonCardContent, IonText, IonButton, IonDatetime, IonDatetimeButton, IonModal } from '@ionic/react';
import { add, trash, pencil, calendarOutline, checkmarkDoneCircleOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import AddTaskModal from '@/components/AddTaskModal';
import { Task } from '@/types';

export default function Home() {
  const { tasks, toggleTask, deleteTask } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTasks = tasks.filter(t => {
      const taskDate = t.date || t.createdAt.split('T')[0];
      return taskDate === selectedDate;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (a.isCompleted === b.isCompleted) return 0;
      return a.isCompleted ? 1 : -1;
  });

  const completedCount = filteredTasks.filter(t => t.isCompleted).length;
  const totalCount = filteredTasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const handleEdit = (task: Task) => {
      setEditingTask(task);
      setShowModal(true);
  };

  const handleDelete = (id: string) => {
      presentAlert({
          header: 'Delete Task',
          message: 'Are you sure you want to delete this task?',
          buttons: [
              'Cancel',
              {
                  text: 'Delete',
                  role: 'destructive',
                  handler: () => deleteTask(id)
              }
          ]
      });
  };

  const handleModalClose = () => {
      setShowModal(false);
      setEditingTask(null);
  };

  if (!mounted) return null;

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="pt-2">
          <IonTitle size="large" className="font-bold text-3xl">{greeting}</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="ion-padding">
        
        {/* Summary Card */}
        <div className="mb-8 mt-2">
            <IonCard className="m-0 bg-gradient-to-br from-primary/20 to-primary/5 border-none shadow-sm">
                <IonCardContent>
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Daily Progress</p>
                            <h2 className="text-3xl font-bold text-foreground mt-1">{Math.round(progress * 100)}%</h2>
                        </div>
                        <div className="bg-background/50 p-2 rounded-full">
                            <IonIcon icon={checkmarkDoneCircleOutline} className="text-2xl text-primary" />
                        </div>
                    </div>
                    <div className="w-full bg-background/50 rounded-full h-3 overflow-hidden">
                        <div 
                            className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${progress * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                        {completedCount} of {totalCount} tasks completed
                    </p>
                </IonCardContent>
            </IonCard>
        </div>

        <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xl font-bold text-foreground">Tasks</h3>
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5 shadow-sm hover:bg-accent/50 transition-colors">
                <IonIcon icon={calendarOutline} className="text-primary" />
                <IonDatetimeButton datetime="page-date"></IonDatetimeButton>
                <IonModal keepContentsMounted={true}>
                    <IonDatetime 
                        id="page-date" 
                        presentation="date"
                        value={selectedDate}
                        onIonChange={(e) => setSelectedDate(typeof e.detail.value === 'string' ? e.detail.value.split('T')[0] : selectedDate)}
                    ></IonDatetime>
                </IonModal>
            </div>
        </div>

        <IonList inset={false} className="bg-transparent p-0 gap-3 flex flex-col">
            {sortedTasks.map(task => (
                <IonItemSliding key={task.id} className="rounded-xl overflow-hidden shadow-sm border border-border bg-card">
                    <IonItemOptions side="start">
                        <IonItemOption color="primary" onClick={() => handleEdit(task)}>
                            <IonIcon slot="icon-only" icon={pencil} />
                        </IonItemOption>
                    </IonItemOptions>

                    <IonItem lines="none" className="py-2" detail={false}>
                        <IonCheckbox 
                            slot="start" 
                            checked={task.isCompleted} 
                            onIonChange={() => toggleTask(task.id)}
                            className="mr-4"
                        />
                        <IonLabel className={task.isCompleted ? 'opacity-50' : ''}>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className={`font-bold text-lg ${task.isCompleted ? 'line-through' : ''}`}>{task.title}</h2>
                                <IonBadge color={task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'light'} className="text-[10px] px-2 py-0.5 rounded-md">
                                    {task.priority}
                                </IonBadge>
                            </div>
                            {task.description && <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>}
                        </IonLabel>
                    </IonItem>

                    <IonItemOptions side="end">
                        <IonItemOption color="danger" onClick={() => handleDelete(task.id)}>
                            <IonIcon slot="icon-only" icon={trash} />
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            ))}
            
            {sortedTasks.length === 0 && (
                <div className="text-center py-16 px-4 text-muted-foreground border-2 border-dashed border-border rounded-xl bg-card/30">
                    <p className="text-lg font-medium mb-1">No tasks for this day</p>
                    <p className="text-sm opacity-70">Enjoy your free time or plan ahead.</p>
                </div>
            )}
        </IonList>

        {/* Spacer for FAB */}
        <div className="h-24"></div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" className="mb-24 mr-4 z-50">
          <IonFabButton onClick={() => setShowModal(true)} color="primary" className="shadow-xl">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <AddTaskModal 
            isOpen={showModal} 
            onClose={handleModalClose} 
            taskToEdit={editingTask}
            selectedDate={selectedDate}
        />
      </IonContent>
    </IonPage>
  );
}
