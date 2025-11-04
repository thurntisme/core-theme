import type { DailyActivity } from '@/types/portal';

export const addPoints = (action: string, points: number) => {
  const today = new Date().toISOString().split('T')[0];

  // Add to total points
  const currentPoints = 0;

  // Add to activity log
  const activities = [];
  activities.push({
    id: Date.now().toString(),
    action,
    points,
    date: today,
    timestamp: new Date().toISOString(),
  });

  // Update daily activity count
  // const dailyActivity = {};
  // dailyActivity[today] = (dailyActivity[today] || 0) + 1;
};

// Calculate streak
export const calculateStreak = (dailyActivity: DailyActivity) => {
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];

  for (let i = 0; i < 365; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    if (dailyActivity[dateString] > 0) {
      streak++;
    } else if (dateString !== today) {
      break;
    }
  }

  return streak;
};
