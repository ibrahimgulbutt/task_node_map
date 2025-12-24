import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Node, FocusSession, DailyStats, Priority, MindMap, Edge, SessionType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  tasks: Task[];
  maps: MindMap[];
  nodes: Node[];
  edges: Edge[];
  sessions: FocusSession[];
  dailyStats: DailyStats[];
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'isCompleted' | 'tags'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;

  // Map Actions
  addMap: (title: string) => string;
  deleteMap: (id: string) => void;
  updateMap: (id: string, updates: Partial<MindMap>) => void;

  // Node Actions
  addNode: (node: Omit<Node, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  deleteNode: (id: string) => void;

  // Edge Actions
  addEdge: (edge: Omit<Edge, 'id'>) => void;
  deleteEdge: (id: string) => void;

  // Session Actions
  addSession: (session: FocusSession) => void;
  updateSession: (id: string, updates: Partial<FocusSession>) => void;

  // Settings
  settings: {
      focusDuration: number; // in minutes
  };
  updateSettings: (settings: Partial<AppState['settings']>) => void;

  // Active Focus State (Persistence)
  activeFocus: {
      isActive: boolean;
      startTime: number | null; // Timestamp
      duration: number; // Total duration in seconds
      pausedAt: number | null; // Timestamp if paused
      remaining: number; // Remaining seconds when paused
      type: SessionType;
      taskId?: string;
  };
  startFocus: (type: SessionType, duration: number, taskId?: string) => void;
  pauseFocus: () => void;
  resumeFocus: () => void;
  stopFocus: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: [],
      maps: [],
      nodes: [],
      edges: [],
      sessions: [],
      dailyStats: [],
      
      settings: {
          focusDuration: 25,
      },

      updateSettings: (newSettings) => set((state) => ({
          settings: { ...state.settings, ...newSettings }
      })),

      activeFocus: {
          isActive: false,
          startTime: null,
          duration: 25 * 60,
          pausedAt: null,
          remaining: 25 * 60,
          type: 'Focus',
      },

      startFocus: (type, duration, taskId) => set({
          activeFocus: {
              isActive: true,
              startTime: Date.now(),
              duration,
              pausedAt: null,
              remaining: duration,
              type,
              taskId
          }
      }),

      pauseFocus: () => {
          const { activeFocus } = get();
          if (!activeFocus.isActive || !activeFocus.startTime) return;
          
          const elapsed = Math.floor((Date.now() - activeFocus.startTime) / 1000);
          const remaining = Math.max(0, activeFocus.duration - elapsed);
          
          set({
              activeFocus: {
                  ...activeFocus,
                  isActive: false,
                  pausedAt: Date.now(),
                  remaining,
                  startTime: null
              }
          });
      },

      resumeFocus: () => {
          const { activeFocus } = get();
          if (activeFocus.isActive) return;

          set({
              activeFocus: {
                  ...activeFocus,
                  isActive: true,
                  startTime: Date.now() - ((activeFocus.duration - activeFocus.remaining) * 1000), // Adjust start time to account for elapsed
                  pausedAt: null
              }
          });
      },

      stopFocus: () => set({
          activeFocus: {
              isActive: false,
              startTime: null,
              duration: 25 * 60,
              pausedAt: null,
              remaining: 25 * 60,
              type: 'Focus'
          }
      }),

      addTask: (taskData) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            ...taskData,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            isCompleted: false,
            tags: [],
            date: taskData.date || new Date().toISOString().split('T')[0],
          },
        ],
      })),

      toggleTask: (id) => {
          const state = get();
          const task = state.tasks.find(t => t.id === id);
          
          // If completing the active focus task, stop the timer
          if (task && !task.isCompleted && state.activeFocus.taskId === id && state.activeFocus.isActive) {
              get().stopFocus();
          }

          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, isCompleted: !t.isCompleted, completedAt: !t.isCompleted ? new Date().toISOString() : undefined } : t
            ),
          }));
      },

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      })),

      addMap: (title) => {
        const id = uuidv4();
        set((state) => ({
          maps: [
            ...state.maps,
            {
              id,
              title,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        }));
        return id;
      },

      deleteMap: (id) => set((state) => ({
        maps: state.maps.filter((m) => m.id !== id),
        nodes: state.nodes.filter((n) => n.mapId !== id),
        edges: state.edges.filter((e) => e.mapId !== id),
      })),

      updateMap: (id, updates) => set((state) => ({
        maps: state.maps.map((m) => (m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m)),
      })),

      addNode: (nodeData) => set((state) => ({
        nodes: [
          ...state.nodes,
          {
            ...nodeData,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      })),

      updateNode: (id, updates) => set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
        ),
      })),

      deleteNode: (id) => set((state) => ({
        nodes: state.nodes.filter((n) => n.id !== id),
        edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      })),

      addEdge: (edgeData) => set((state) => ({
        edges: [...state.edges, { ...edgeData, id: uuidv4() }],
      })),

      deleteEdge: (id) => set((state) => ({
        edges: state.edges.filter((e) => e.id !== id),
      })),

      addSession: (session) => set((state) => ({
        sessions: [...state.sessions, session],
      })),

      updateSession: (id, updates) => set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      })),
    }),
    {
      name: 'node-mind-storage',
    }
  )
);
