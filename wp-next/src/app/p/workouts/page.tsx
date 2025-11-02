'use client';

import { useEffect, useState } from 'react';

import {
  Calendar,
  Dumbbell,
  Edit,
  Play,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { PORTAL_URL } from '@/constants/site';
import { Exercise } from '@/types/portal';
import { useQuery } from '@tanstack/react-query';

const exerciseCategories = [
  'General Fitness',
  'Strength Training',
  'Cardio',
  'Flexibility',
  'Bodyweight',
  'Olympic Lifting',
  'Powerlifting',
  'Functional',
  'Rehabilitation',
];

const muscleGroups = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Glutes',
  'Calves',
  'Full Body',
  'Cardio',
];

const weekDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function WorkoutsPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [muscleFilter, setMuscleFilter] = useState<string>('all');
  const [dayFilter, setDayFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Strength Training',
    targetMuscle: 'Chest',
    sets: 3,
    reps: '10-12',
    weight: 'bodyweight',
    duration: '',
    restTime: '60',
    notes: '',
    thumbnail: '',
    workoutDays: [] as string[],
  });
  const router = useRouter();

  const { data: exercisesData } = useQuery({
    queryKey: ['workoutExercises'],
    queryFn: async () => {
      const response = await fetch('/api/portal/workout');
      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (exercisesData) {
      setExercises(exercisesData);
    }
  }, [exercisesData]);

  const saveExercises = (updatedExercises: Exercise[]) => {
    setExercises(updatedExercises);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Strength Training',
      targetMuscle: 'Chest',
      sets: 3,
      reps: '10-12',
      weight: 'bodyweight',
      duration: '',
      restTime: '60',
      notes: '',
      thumbnail: '',
      workoutDays: [],
    });
  };

  const handleAddExercise = () => {
    if (!formData.name.trim()) {
      alert('Exercise name is required!');
      return;
    }

    if (formData.workoutDays.length === 0) {
      alert('Please select at least one workout day!');
      return;
    }

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      targetMuscle: formData.targetMuscle,
      sets: formData.sets,
      reps: formData.reps,
      weight: formData.weight,
      duration: formData.duration,
      restTime: formData.restTime,
      notes: formData.notes,
      thumbnail:
        formData.thumbnail ||
        `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(formData.name)}`,
      workoutDays: formData.workoutDays,
      lastPerformed: '',
      totalSessions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedExercises = [...exercises, newExercise];
    saveExercises(updatedExercises);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditExercise = () => {
    if (!formData.name.trim()) {
      alert('Exercise name is required!');
      return;
    }

    if (formData.workoutDays.length === 0) {
      alert('Please select at least one workout day!');
      return;
    }

    if (!editingExercise) return;

    const updatedExercises = exercises.map((exercise) =>
      exercise.id === editingExercise.id
        ? {
            ...exercise,
            name: formData.name,
            category: formData.category,
            targetMuscle: formData.targetMuscle,
            sets: formData.sets,
            reps: formData.reps,
            weight: formData.weight,
            duration: formData.duration,
            restTime: formData.restTime,
            notes: formData.notes,
            thumbnail: formData.thumbnail || exercise.thumbnail,
            workoutDays: formData.workoutDays,
            updatedAt: new Date().toISOString(),
          }
        : exercise
    );

    saveExercises(updatedExercises);
    resetForm();
    setEditingExercise(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const updatedExercises = exercises.filter(
      (exercise) => exercise.id !== exerciseId
    );
    saveExercises(updatedExercises);
  };

  const openEditDialog = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name,
      category: exercise.category,
      targetMuscle: exercise.targetMuscle,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      duration: exercise.duration,
      restTime: exercise.restTime,
      notes: exercise.notes,
      thumbnail: exercise.thumbnail,
      workoutDays: exercise.workoutDays,
    });
    setIsEditDialogOpen(true);
  };

  const handleWorkoutDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      workoutDays: prev.workoutDays.includes(day)
        ? prev.workoutDays.filter((d) => d !== day)
        : [...prev.workoutDays, day],
    }));
  };

  const getExercisesForDay = (day: string) => {
    return exercises.filter(
      (exercise) => exercise.workoutDays && exercise.workoutDays.includes(day)
    );
  };

  const getTodaysExercises = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return getExercisesForDay(today);
  };

  const todaysExercises = getTodaysExercises();
  const totalSessions = exercises.reduce(
    (sum, exercise) => sum + exercise.totalSessions,
    0
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8 gap-2">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Workouts</h2>
          <p className="text-gray-600 mt-1">
            Manage your exercises and track your fitness progress
          </p>
        </div>
        <Button
          onClick={() => router.push(`${PORTAL_URL}/workouts/today`)}
          className="flex items-center gap-2 ml-auto"
        >
          <Play className="h-4 w-4" />
          Today's Workout
        </Button>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Exercise
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Exercise</DialogTitle>
              <DialogDescription>
                Create a new exercise for your workout routine.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Exercise Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter exercise name"
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
                      {exerciseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="targetMuscle">Target Muscle</Label>
                  <Select
                    value={formData.targetMuscle}
                    onValueChange={(value) =>
                      setFormData({ ...formData, targetMuscle: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {muscleGroups.map((muscle) => (
                        <SelectItem key={muscle} value={muscle}>
                          {muscle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sets">Sets</Label>
                  <Input
                    id="sets"
                    type="number"
                    value={formData.sets}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sets: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    min="1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    id="reps"
                    value={formData.reps}
                    onChange={(e) =>
                      setFormData({ ...formData, reps: e.target.value })
                    }
                    placeholder="10-12"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    placeholder="bodyweight"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (optional)</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="30 seconds"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="restTime">Rest Time (seconds)</Label>
                  <Input
                    id="restTime"
                    value={formData.restTime}
                    onChange={(e) =>
                      setFormData({ ...formData, restTime: e.target.value })
                    }
                    placeholder="60"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Workout Days *</Label>
                <div className="grid grid-cols-4 gap-2">
                  {weekDays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={day}
                        checked={formData.workoutDays.includes(day)}
                        onChange={() => handleWorkoutDayToggle(day)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={day} className="text-sm">
                        {day.slice(0, 3)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Exercise instructions, tips, or notes..."
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
              <Button onClick={handleAddExercise}>Add Exercise</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {exercises.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Today's Exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {todaysExercises.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalSessions}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {new Set(exercises.map((e) => e.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>Your workout schedule for the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const dayExercises = getExercisesForDay(day);
              const isToday =
                day ===
                new Date().toLocaleDateString('en-US', { weekday: 'long' });

              return (
                <div
                  key={day}
                  className={`p-4 rounded-lg border ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <h4
                    className={`font-medium mb-2 ${isToday ? 'text-blue-700' : 'text-gray-900'}`}
                  >
                    {day}
                    {isToday && <Badge className="ml-2 text-xs">Today</Badge>}
                  </h4>
                  <div className="space-y-1">
                    {dayExercises.length === 0 ? (
                      <p className="text-sm text-gray-500">Rest day</p>
                    ) : (
                      dayExercises.slice(0, 3).map((exercise) => (
                        <div
                          key={exercise.id}
                          className="text-sm text-gray-700 truncate"
                        >
                          {exercise.name}
                        </div>
                      ))
                    )}
                    {dayExercises.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{dayExercises.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search exercises..."
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
            {exerciseCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={muscleFilter} onValueChange={setMuscleFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by muscle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Muscles</SelectItem>
            {muscleGroups.map((muscle) => (
              <SelectItem key={muscle} value={muscle}>
                {muscle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={dayFilter} onValueChange={setDayFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Days</SelectItem>
            {weekDays.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exercises Grid */}
      {todaysExercises.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <Dumbbell className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ||
              categoryFilter !== 'all' ||
              muscleFilter !== 'all' ||
              dayFilter !== 'all'
                ? 'No exercises found'
                : 'No exercises yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ||
              categoryFilter !== 'all' ||
              muscleFilter !== 'all' ||
              dayFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first exercise'}
            </p>
            {!searchTerm &&
              categoryFilter === 'all' &&
              muscleFilter === 'all' &&
              dayFilter === 'all' && (
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Exercise
                </Button>
              )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaysExercises.map((exercise) => (
            <Card
              key={exercise.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <img
                    src={exercise.thumbnail || '/placeholder.svg'}
                    alt={exercise.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {exercise.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {exercise.category} • {exercise.targetMuscle}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(exercise)}
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
                          <AlertDialogTitle>Delete Exercise</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{exercise.name}"?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteExercise(exercise.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium">{exercise.sets}</div>
                    <div className="text-gray-500">Sets</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium">{exercise.reps}</div>
                    <div className="text-gray-500">Reps</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium">{exercise.weight}</div>
                    <div className="text-gray-500">Weight</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {(exercise.workoutDays || []).map((day) => (
                    <Badge key={day} variant="secondary" className="text-xs">
                      {day.slice(0, 3)}
                    </Badge>
                  ))}
                </div>

                {exercise.notes && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {exercise.notes}
                  </p>
                )}

                <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
                  <span>Sessions: {exercise.totalSessions}</span>
                  {exercise.lastPerformed && (
                    <span>
                      Last:{' '}
                      {new Date(exercise.lastPerformed).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
            <DialogDescription>Update exercise information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Exercise Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter exercise name"
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
                    {exerciseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-targetMuscle">Target Muscle</Label>
                <Select
                  value={formData.targetMuscle}
                  onValueChange={(value) =>
                    setFormData({ ...formData, targetMuscle: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {muscleGroups.map((muscle) => (
                      <SelectItem key={muscle} value={muscle}>
                        {muscle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-sets">Sets</Label>
                <Input
                  id="edit-sets"
                  type="number"
                  value={formData.sets}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sets: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  min="1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-reps">Reps</Label>
                <Input
                  id="edit-reps"
                  value={formData.reps}
                  onChange={(e) =>
                    setFormData({ ...formData, reps: e.target.value })
                  }
                  placeholder="10-12"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-weight">Weight</Label>
                <Input
                  id="edit-weight"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  placeholder="bodyweight"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-duration">Duration (optional)</Label>
                <Input
                  id="edit-duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="30 seconds"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-restTime">Rest Time (seconds)</Label>
                <Input
                  id="edit-restTime"
                  value={formData.restTime}
                  onChange={(e) =>
                    setFormData({ ...formData, restTime: e.target.value })
                  }
                  placeholder="60"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Workout Days *</Label>
              <div className="grid grid-cols-4 gap-2">
                {weekDays.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-${day}`}
                      checked={formData.workoutDays.includes(day)}
                      onChange={() => handleWorkoutDayToggle(day)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={`edit-${day}`} className="text-sm">
                      {day.slice(0, 3)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-thumbnail">Thumbnail URL (optional)</Label>
              <Input
                id="edit-thumbnail"
                value={formData.thumbnail}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Exercise instructions, tips, or notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setEditingExercise(null);
                setIsEditDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditExercise}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
