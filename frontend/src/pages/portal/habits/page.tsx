'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Flame,
  Plus,
  Search,
  Target,
  Trash2,
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { habitCategories, habitColors, weekDays } from '@/constants/habit';
import type { Habit, HabitCompletion } from '@/types/portal';
import { useQuery } from '@tanstack/react-query';

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Health & Fitness',
    color: 'bg-blue-500',
    targetFrequency: 'daily' as Habit['targetFrequency'],
    customDays: [] as string[],
    timeRange: {
      start: '',
      end: '',
    },
  });
  const navigate = useNavigate();

  const {
    data: habitData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const response = await fetch('/api/portal/habit');
      if (!response.ok) {
        throw new Error('Failed to fetch habits');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (habitData) {
      setHabits(habitData);
    }
  }, [habitData]);

  const saveHabits = (updatedHabits: Habit[]) => {
    console.log('Habits saved:', updatedHabits);
    setHabits(updatedHabits);
  };

  const saveCompletions = (updatedCompletions: HabitCompletion[]) => {
    console.log('Completions saved:', updatedCompletions);
    setCompletions(updatedCompletions);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Health & Fitness',
      color: 'bg-blue-500',
      targetFrequency: 'daily',
      customDays: [],
      timeRange: {
        start: '',
        end: '',
      },
    });
  };

  const handleAddHabit = () => {
    if (!formData.name.trim()) {
      alert('Habit name is required!');
      return;
    }

    if (
      formData.targetFrequency === 'custom' &&
      formData.customDays.length === 0
    ) {
      alert('Please select at least one day for custom frequency!');
      return;
    }

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      color: formData.color,
      targetFrequency: formData.targetFrequency,
      customDays:
        formData.targetFrequency === 'custom' ? formData.customDays : undefined,
      timeRange:
        formData.timeRange.start && formData.timeRange.end
          ? {
              start: formData.timeRange.start,
              end: formData.timeRange.end,
            }
          : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedHabits = [...habits, newHabit];
    saveHabits(updatedHabits);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditHabit = () => {
    if (!formData.name.trim()) {
      alert('Habit name is required!');
      return;
    }

    if (
      formData.targetFrequency === 'custom' &&
      formData.customDays.length === 0
    ) {
      alert('Please select at least one day for custom frequency!');
      return;
    }

    if (!editingHabit) return;

    const updatedHabits = habits.map((habit) =>
      habit.id === editingHabit.id
        ? {
            ...habit,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            color: formData.color,
            targetFrequency: formData.targetFrequency,
            customDays:
              formData.targetFrequency === 'custom'
                ? formData.customDays
                : undefined,
            timeRange:
              formData.timeRange.start && formData.timeRange.end
                ? {
                    start: formData.timeRange.start,
                    end: formData.timeRange.end,
                  }
                : undefined,
            updatedAt: new Date().toISOString(),
          }
        : habit
    );

    saveHabits(updatedHabits);
    resetForm();
    setEditingHabit(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== habitId);
    const updatedCompletions = completions.filter(
      (completion) => completion.habitId !== habitId
    );
    saveHabits(updatedHabits);
    saveCompletions(updatedCompletions);
  };

  const openEditDialog = (habit: Habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description,
      category: habit.category,
      color: habit.color,
      targetFrequency: habit.targetFrequency,
      customDays: habit.customDays || [],
      timeRange: habit.timeRange || { start: '', end: '' },
    });
    setIsEditDialogOpen(true);
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    const dateStr = date;
    const existingCompletion = completions.find(
      (c) => c.habitId === habitId && c.date === dateStr
    );

    if (existingCompletion) {
      // Toggle existing completion
      const updatedCompletions = completions.map((completion) =>
        completion.id === existingCompletion.id
          ? {
              ...completion,
              completed: !completion.completed,
              completedAt: !completion.completed
                ? new Date().toISOString()
                : undefined,
            }
          : completion
      );
      saveCompletions(updatedCompletions);
    } else {
      // Create new completion
      const newCompletion: HabitCompletion = {
        id: Date.now().toString(),
        habitId,
        date: dateStr,
        completed: true,
        completedAt: new Date().toISOString(),
      };
      saveCompletions([...completions, newCompletion]);
    }
  };

  const isHabitCompletedOnDate = (habitId: string, date: string) => {
    const completion = completions.find(
      (c) => c.habitId === habitId && c.date === date
    );
    return completion?.completed || false;
  };

  const shouldShowHabitOnDate = (habit: Habit, date: Date) => {
    const dayNames = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const dayName = dayNames[date.getDay()];

    switch (habit.targetFrequency) {
      case 'daily':
        return true;
      case 'weekly':
        return [
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
        ].includes(dayName);
      case 'custom':
        return habit.customDays?.includes(dayName) || false;
      default:
        return true;
    }
  };

  const isHabitCurrentlyActive = (habit: Habit) => {
    if (!habit.timeRange) return false;
    let isMatchDay = true;

    // should check with targetFrequency
    if (habit.targetFrequency === 'weekly') {
      const dayNames = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
      ];
      const dayName = dayNames[new Date().getDay()];
      isMatchDay = habit.customDays?.includes(dayName) || false;
    }
    if (habit.targetFrequency === 'custom') {
      isMatchDay = habit.customDays
        ? habit.customDays.includes(
            new Date()
              .toLocaleDateString('en-US', { weekday: 'long' })
              .toLowerCase()
          )
        : false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = habit.timeRange.start.split(':').map(Number);
    const [endHour, endMin] = habit.timeRange.end.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    return isMatchDay && currentTime >= startTime && currentTime <= endTime;
  };

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedWeek(newDate);
  };

  const getHabitStreak = (habitId: string): number => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return 0;

    let streak = 0;
    const MAX_DAYS = 365;

    for (let i = 0; i < MAX_DAYS; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      if (shouldShowHabitOnDate(habit, date)) {
        if (isHabitCompletedOnDate(habitId, dateStr)) {
          streak++;
        } else {
          break;
        }
      }
    }

    return streak;
  };

  const filteredHabits = habits.filter((habit) => {
    const matchesSearch =
      habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      habit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      habit.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || habit.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const weekDates = getWeekDates(selectedWeek);
  const todayStr = new Date().toISOString().split('T')[0];

  const totalHabits = habits.length;
  const completedToday = habits.filter(
    (habit) =>
      shouldShowHabitOnDate(habit, new Date()) &&
      isHabitCompletedOnDate(habit.id, todayStr)
  ).length;
  const activeHabits = habits.filter((habit) =>
    shouldShowHabitOnDate(habit, new Date())
  ).length;
  const currentlyActive = habits.filter(isHabitCurrentlyActive).length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Habits</h2>
          <p className="text-gray-600 mt-1">
            Track daily habits and build consistent routines
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
              <DialogDescription>
                Create a new habit to track your daily routines.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Habit Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter habit name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {habitCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Color</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) =>
                      setFormData({ ...formData, color: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {habitColors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full ${color.value}`}
                            />
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.targetFrequency}
                  onValueChange={(value: Habit['targetFrequency']) =>
                    setFormData({
                      ...formData,
                      targetFrequency: value,
                      customDays: [],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="custom">Custom Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.targetFrequency === 'custom' && (
                <div className="grid gap-2">
                  <Label>Select Days</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {weekDays.map((day) => (
                      <div
                        key={day.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={day.value}
                          checked={formData.customDays.includes(day.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                customDays: [...formData.customDays, day.value],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                customDays: formData.customDays.filter(
                                  (d) => d !== day.value
                                ),
                              });
                            }
                          }}
                        />
                        <Label htmlFor={day.value} className="text-sm">
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time (Optional)</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.timeRange.start}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeRange: {
                          ...formData.timeRange,
                          start: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time (Optional)</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.timeRange.end}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeRange: {
                          ...formData.timeRange,
                          end: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your habit..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddHabit}>Add Habit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Habits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalHabits}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {activeHabits}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedToday}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Currently Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {currentlyActive}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search habits by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {habitCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Week Navigation */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Week View
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-4">
                {weekDates[0].toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                -{' '}
                {weekDates[6].toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 font-medium text-gray-600 min-w-[200px]">
                    Habit
                  </th>
                  {weekDates.map((date) => (
                    <th
                      key={date.toISOString()}
                      className="text-center p-2 font-medium text-gray-600 min-w-[80px]"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xs">
                          {date.toLocaleDateString('en-US', {
                            weekday: 'short',
                          })}
                        </span>
                        <span
                          className={`text-sm ${
                            date.toDateString() === new Date().toDateString()
                              ? 'font-bold text-blue-600'
                              : ''
                          }`}
                        >
                          {date.getDate()}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="text-center p-2 font-medium text-gray-600 min-w-[80px]">
                    Streak
                  </th>
                  <th className="text-center p-2 font-medium text-gray-600 min-w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredHabits.map((habit) => {
                  const colorConfig = habitColors.find(
                    (c) => c.value === habit.color
                  );
                  const isCurrentlyActive = isHabitCurrentlyActive(habit);
                  const streak = getHabitStreak(habit.id);

                  return (
                    <tr
                      key={habit.id}
                      className={`border-t hover:bg-gray-50 ${
                        isCurrentlyActive
                          ? 'bg-yellow-50 border-yellow-200'
                          : ''
                      }`}
                    >
                      <td className="p-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full ${habit.color}`}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{habit.name}</span>
                              {isCurrentlyActive && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-yellow-100 text-yellow-800"
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  Active Now
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {habit.category}
                              {habit.timeRange && (
                                <span className="ml-2">
                                  {habit.timeRange.start} -{' '}
                                  {habit.timeRange.end}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      {weekDates.map((date) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const shouldShow = shouldShowHabitOnDate(habit, date);
                        const isCompleted = isHabitCompletedOnDate(
                          habit.id,
                          dateStr
                        );
                        const isToday =
                          date.toDateString() === new Date().toDateString();

                        return (
                          <td key={dateStr} className="p-2 text-center">
                            {shouldShow ? (
                              <Checkbox
                                checked={isCompleted}
                                onCheckedChange={() =>
                                  toggleHabitCompletion(habit.id, dateStr)
                                }
                                className={`mx-auto ${isToday ? 'border-blue-500' : ''}`}
                              />
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">{streak}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(habit)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Habit
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{habit.name}
                                  "? This will also delete all completion
                                  history. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteHabit(habit.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredHabits.length === 0 && (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No habits found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first habit'}
              </p>
              {!searchTerm && categoryFilter === 'all' && (
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Habit
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>Update habit information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Habit Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter habit name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {habitCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-color">Color</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) =>
                    setFormData({ ...formData, color: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {habitColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full ${color.value}`}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-frequency">Frequency</Label>
              <Select
                value={formData.targetFrequency}
                onValueChange={(value: Habit['targetFrequency']) =>
                  setFormData({
                    ...formData,
                    targetFrequency: value,
                    customDays: [],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="custom">Custom Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.targetFrequency === 'custom' && (
              <div className="grid gap-2">
                <Label>Select Days</Label>
                <div className="grid grid-cols-2 gap-2">
                  {weekDays.map((day) => (
                    <div
                      key={day.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`edit-${day.value}`}
                        checked={formData.customDays.includes(day.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              customDays: [...formData.customDays, day.value],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              customDays: formData.customDays.filter(
                                (d) => d !== day.value
                              ),
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`edit-${day.value}`} className="text-sm">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-startTime">Start Time (Optional)</Label>
                <Input
                  id="edit-startTime"
                  type="time"
                  value={formData.timeRange.start}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      timeRange: {
                        ...formData.timeRange,
                        start: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endTime">End Time (Optional)</Label>
                <Input
                  id="edit-endTime"
                  type="time"
                  value={formData.timeRange.end}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      timeRange: {
                        ...formData.timeRange,
                        end: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your habit..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setEditingHabit(null);
                setIsEditDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditHabit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
