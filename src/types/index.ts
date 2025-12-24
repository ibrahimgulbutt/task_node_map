export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: Priority;
  category?: string;
  reminderDateTime?: string;
  repeatType?: 'daily' | 'weekly' | 'monthly' | 'none';
  createdAt: string;
  completedAt?: string;
  tags: string[];
  date?: string; // YYYY-MM-DD
}

export interface MindMap {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  viewport?: { x: number; y: number; zoom: number };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  mapId: string;
}

export interface Node {
  id: string;
  mapId: string;
  title: string;
  content: string;
  emoji?: string;
  tags: string[];
  // connectedNodeIds: string[]; // Deprecated in favor of Edge interface
  position: { x: number; y: number };
  createdAt: string;
  updatedAt: string;
  isMarkdown: boolean;
}

export type SessionType = 'Focus' | 'Short Break' | 'Long Break';

export interface FocusSession {
  id: string;
  durationMinutes: number;
  startTime: string;
  endTime?: string;
  isCompleted: boolean;
  sessionType: SessionType;
  taskId?: string;
  notes?: string;
}

export interface DailyStats {
  date: string;
  tasksCompleted: number;
  focusSessionsCompleted: number;
  totalFocusMinutes: number;
  streak: number;
}
