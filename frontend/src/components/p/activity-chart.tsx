'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Activity, DailyActivity, ViewMode } from '@/types/portal';
import { useQuery } from '@tanstack/react-query';

export function ActivityChart() {
  const [dailyActivity, setDailyActivity] = useState<DailyActivity>({});
  const [viewMode, setViewMode] = useState<ViewMode>('year');
  const navigate = useNavigate();

  const {
    data: recentActivities,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['recentActivities', viewMode],
    queryFn: async () => {
      const response = await fetch(`/api/portal/activity?view=${viewMode}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    enabled: !!viewMode,
  });

  const onViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Generate days based on view mode
  const generateDays = () => {
    const days = [];
    const today = new Date();
    let daysToShow = 365;

    if (viewMode === 'week') daysToShow = 7;
    else if (viewMode === 'month') daysToShow = 30;

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      days.push({
        date: dateString,
        count: dailyActivity[dateString] || 0,
        day: date.getDay(),
        week: Math.floor(i / 7),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        monthDay: date.getDate(),
      });
    }

    return days;
  };

  const days = generateDays();

  // Get activity level based on count
  const getActivityLevel = (count: number) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  // Get color based on activity level
  const getActivityColor = (level: number) => {
    const colors = [
      'bg-gray-100', // No activity
      'bg-green-200', // Low activity
      'bg-green-300', // Medium activity
      'bg-green-500', // High activity
      'bg-green-700', // Very high activity
    ];
    return colors[level];
  };

  // Render different chart layouts based on view mode
  const renderChart = () => {
    if (viewMode === 'week') {
      return (
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {days.map((day, index) => {
              const level = getActivityLevel(day.count);
              const color = getActivityColor(level);

              return (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded ${color} cursor-pointer hover:ring-2 hover:ring-gray-300`}
                        />
                        <span className="text-xs text-gray-500">
                          {day.dayName}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">
                        {day.count}{' '}
                        {day.count === 1 ? 'activity' : 'activities'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      );
    }

    if (viewMode === 'month') {
      const weeks = Math.ceil(days.length / 7);
      return (
        <div className="space-y-4">
          <TooltipProvider>
            <div className="flex gap-1 justify-center">
              {Array.from({ length: weeks }, (_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const dayData = days[weekIndex * 7 + dayIndex];
                    if (!dayData)
                      return <div key={dayIndex} className="w-4 h-4" />;

                    const level = getActivityLevel(dayData.count);
                    const color = getActivityColor(level);

                    return (
                      <Tooltip key={dayIndex}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-4 h-4 rounded-sm ${color} cursor-pointer hover:ring-2 hover:ring-gray-300`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">
                            {dayData.count}{' '}
                            {dayData.count === 1 ? 'activity' : 'activities'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(dayData.date).toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>
      );
    }

    // Year view (original GitHub-style)
    const weeks = Math.ceil(days.length / 7);
    return (
      <div className="space-y-4">
        {/* Month labels */}
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          {[
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ].map((month, index) => (
            <span key={month} className="w-8 text-center">
              {index % 2 === 0 ? month : ''}
            </span>
          ))}
        </div>

        {/* Activity grid */}
        <TooltipProvider>
          <div className="flex gap-1 overflow-x-auto">
            {Array.from({ length: weeks }, (_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const dayData = days[weekIndex * 7 + dayIndex];
                  if (!dayData)
                    return <div key={dayIndex} className="w-3 h-3" />;

                  const level = getActivityLevel(dayData.count);
                  const color = getActivityColor(level);

                  return (
                    <Tooltip key={dayIndex}>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-3 h-3 rounded-sm ${color} cursor-pointer hover:ring-2 hover:ring-gray-300`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">
                          {dayData.count}{' '}
                          {dayData.count === 1 ? 'activity' : 'activities'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(dayData.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </TooltipProvider>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getActivityColor(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-600">Loading...</h2>
          <p className="mt-2 text-gray-500">
            Please wait while we fetch your data.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">
            Error loading data
          </h2>
          <p className="mt-2 text-gray-500">
            Please try again later or contact support.
          </p>
          <Button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Activity Overview</CardTitle>
              <CardDescription>
                Your daily activity over the selected period. Each square
                represents a day.
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange('week')}
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange('month')}
              >
                Month
              </Button>
              <Button
                variant={viewMode === 'year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange('year')}
              >
                Year
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>{renderChart()}</CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activities</CardTitle>
          <CardDescription>
            Your latest actions and points earned
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No recent activities
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity: Activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    +{activity.points} pts
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
