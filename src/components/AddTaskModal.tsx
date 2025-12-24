'use client';

import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonInput, IonTextarea, IonSelect, IonSelectOption, IonLabel, IonDatetime, IonDatetimeButton } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Priority, Task } from '@/types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  selectedDate?: string;
}

export default function AddTaskModal({ isOpen, onClose, taskToEdit, selectedDate }: AddTaskModalProps) {
  const { addTask, updateTask } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
      if (taskToEdit) {
          setTitle(taskToEdit.title);
          setDescription(taskToEdit.description || '');
          setPriority(taskToEdit.priority);
          setDate(taskToEdit.date || taskToEdit.createdAt.split('T')[0]);
      } else {
          setTitle('');
          setDescription('');
          setPriority('Medium');
          setDate(selectedDate || new Date().toISOString().split('T')[0]);
      }
  }, [taskToEdit, isOpen, selectedDate]);

  const handleSave = () => {
    if (!title) return;
    
    if (taskToEdit) {
        updateTask(taskToEdit.id, {
            title,
            description,
            priority,
            date
        });
    } else {
        addTask({
            title,
            description,
            priority,
            category: 'General',
            repeatType: 'none',
            date: date
        });
    }
    
    // Reset only if adding new, or just close
    if (!taskToEdit) {
        setTitle('');
        setDescription('');
        setPriority('Medium');
    }
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{taskToEdit ? 'Edit Task' : 'New Task'}</IonTitle>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>Cancel</IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={handleSave}>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="flex flex-col gap-4">
            <div className="bg-card rounded-xl p-2 border border-border">
                <IonItem lines="none" className="bg-transparent">
                    <IonInput
                        label="Title"
                        labelPlacement="stacked"
                        placeholder="Enter task title"
                        value={title}
                        onIonInput={(e) => setTitle(e.detail.value!)}
                        className="font-bold text-lg"
                    />
                </IonItem>
            </div>
            
            <div className="bg-card rounded-xl p-2 border border-border">
                <IonItem lines="none" className="bg-transparent">
                    <IonTextarea
                        label="Description"
                        labelPlacement="stacked"
                        placeholder="Enter description"
                        value={description}
                        onIonInput={(e) => setDescription(e.detail.value!)}
                        rows={3}
                    />
                </IonItem>
            </div>

            <div className="bg-card rounded-xl p-2 border border-border flex items-center justify-between px-4">
                <IonLabel className="font-medium text-muted-foreground">Date</IonLabel>
                <div className="flex items-center">
                    <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
                    <IonModal keepContentsMounted={true}>
                        <IonDatetime 
                            id="datetime" 
                            presentation="date"
                            value={date}
                            onIonChange={(e) => setDate(typeof e.detail.value === 'string' ? e.detail.value.split('T')[0] : date)}
                        ></IonDatetime>
                    </IonModal>
                </div>
            </div>

            <div className="bg-card rounded-xl p-2 border border-border">
                <IonItem lines="none" className="bg-transparent">
                    <IonSelect 
                        label="Priority" 
                        value={priority} 
                        onIonChange={(e) => setPriority(e.detail.value)}
                    >
                        <IonSelectOption value="Low">Low</IonSelectOption>
                        <IonSelectOption value="Medium">Medium</IonSelectOption>
                        <IonSelectOption value="High">High</IonSelectOption>
                    </IonSelect>
                </IonItem>
            </div>
        </div>
      </IonContent>
    </IonModal>
  );
}
