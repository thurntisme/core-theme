// This file was left out for brevity. Assume it is correct and does not need any modifications.

export type GoalStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'archived';

export type KeyResult = {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  status: GoalStatus;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  status: GoalStatus;
  startDate: string;
  endDate: string;
  keyResults: KeyResult[];
  createdAt: string;
  updatedAt: string;
};

// Sample data
export const sampleGoals: Goal[] = [
  {
    id: '1',
    title: 'Improve Physical Fitness',
    description: 'Enhance overall physical health and strength',
    status: 'in_progress',
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    keyResults: [
      {
        id: '1-1',
        title: 'Run 5km',
        target: 5,
        current: 3,
        unit: 'km',
        status: 'in_progress',
      },
      {
        id: '1-2',
        title: 'Bench Press',
        target: 100,
        current: 80,
        unit: 'kg',
        status: 'in_progress',
      },
    ],
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Learn TypeScript',
    description: 'Master TypeScript programming language',
    status: 'not_started',
    startDate: '2024-04-01',
    endDate: '2024-07-31',
    keyResults: [
      {
        id: '2-1',
        title: 'Complete Online Course',
        target: 1,
        current: 0,
        unit: 'course',
        status: 'not_started',
      },
    ],
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
];
