export type PortalCategory = {
  title: string;
  tools: PortalTool[];
};

export type PortalTool = {
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  status: string;
  color: string;
  slug: string;
};

export interface Activity {
  id: string;
  action: string;
  points: number;
  date: string;
  timestamp: string;
}

export interface DailyActivity {
  [date: string]: number;
}

export type ViewMode = 'week' | 'month' | 'year';

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  website: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookmarkItem {
  id?: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string;
  favorite: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  color: string;
  targetFrequency: 'daily' | 'weekly' | 'custom';
  customDays?: string[]; // For custom frequency: ['monday', 'tuesday', etc.]
  timeRange?: {
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
  createdAt: string;
  updatedAt: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  weight: string;
  duration: string;
  restTime: string;
  notes: string;
  thumbnail: string;
  workoutDays: string[];
  lastPerformed: string;
  totalSessions: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSession {
  exerciseId: string;
  currentSet: number;
  completedSets: number[];
  currentReps: number;
  currentWeight: number;
  notes: string;
  completed: boolean;
}

export interface PlannedExpense {
  id: string;
  category: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: string; // For daily/weekly/monthly/yearly reference
  createdAt: string;
}

export interface RealExpense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  timeframe: 'tomorrow' | 'week' | 'month' | 'year';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdDate: string;
  targetDate?: string;
}

export interface Leader {
  id: string;
  name: string;
  field: string;
  image: string;
  bio: string;
  achievements: string[];
  socialLinks: { platform: string; url: string }[];
}

export interface DailyReport {
  id: string;
  date: string;
  name: string;
  project: string;
  completedTasks: Array<{ task: string; note: string }>;
  inProgressTasks: Array<{ task: string; progress: string }>;
  blockers: Array<{ task: string; issue: string }>;
  nextPlan: Array<{ task: string; description: string }>;
}

export interface Reporter {
  name: string;
  email: string;
  department: string;
  position: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  happy_grateful: string;
  upset_stressed: string;
  learned_today: string;
  created_at: string;
  emoji: string;
  mood?: string;
}

export interface MoodOptions extends Array<{ emoji: string; mood: string }> {}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  startDate: string;
  deadline: string;
  status: 'planned' | 'in-progress' | 'done';
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
}

export interface Estimation {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  totalAmount: number;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  createdDate: string;
  validUntil: string;
  clientNotes: string;
}
