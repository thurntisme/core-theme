'use client';

import { useEffect, useState } from 'react';

import {
  Check,
  Clock,
  Dumbbell,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Target,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PORTAL_URL } from '@/constants/site';
import { Exercise, WorkoutSession } from '@/types/portal';
import { useQuery } from '@tanstack/react-query';

export default function TodayWorkoutPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<
    Record<string, WorkoutSession>
  >({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const router = useRouter();

  const { data: exercisesData } = useQuery({
    queryKey: ['workoutExercisesToday'],
    queryFn: async () => {
      const response = await fetch('/api/portal/workout/today');
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

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout> | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const initializeWorkoutSessions = (exercises: Exercise[]) => {
    const sessions: Record<string, WorkoutSession> = {};
    exercises.forEach((exercise) => {
      sessions[exercise.id] = {
        exerciseId: exercise.id,
        currentSet: 1,
        completedSets: [],
        currentReps: Number.parseInt(exercise.reps.split('-')[0]) || 10,
        currentWeight: Number.parseFloat(exercise.weight) || 0,
        notes: '',
        completed: false,
      };
    });
    setWorkoutSessions(sessions);
  };

  const startWorkout = () => {
    initializeWorkoutSessions(exercises);
    setWorkoutStarted(true);
    setIsTimerRunning(true);
  };

  const pauseResumeTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateReps = (exerciseId: string, increment: boolean) => {
    setWorkoutSessions((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        currentReps: Math.max(
          1,
          prev[exerciseId].currentReps + (increment ? 1 : -1)
        ),
      },
    }));
  };

  const updateWeight = (exerciseId: string, increment: boolean) => {
    setWorkoutSessions((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        currentWeight: Math.max(
          0,
          prev[exerciseId].currentWeight + (increment ? 2.5 : -2.5)
        ),
      },
    }));
  };

  const completeSet = (exerciseId: string) => {
    const session = workoutSessions[exerciseId];
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (!session || !exercise) return;

    const newCompletedSets = [...session.completedSets, session?.currentSet];
    const isExerciseCompleted = newCompletedSets.length >= exercise.sets;

    setWorkoutSessions((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        completedSets: newCompletedSets,
        currentSet: isExerciseCompleted
          ? exercise.sets
          : session?.currentSet + 1,
        completed: isExerciseCompleted,
      },
    }));

    // Check if all exercises are completed
    const allCompleted = Object.values(workoutSessions).every((s) =>
      s.exerciseId === exerciseId ? isExerciseCompleted : s.completed
    );

    if (allCompleted) {
      setWorkoutCompleted(true);
      setIsTimerRunning(false);

      // Update exercise statistics
      const updatedExercises = exercises.map((exercise) => {
        return {
          ...exercise,
          lastPerformed: new Date().toISOString(),
          totalSessions: exercise.totalSessions + 1,
        };
      });

      setExercises(updatedExercises);
    }
  };

  const updateNotes = (exerciseId: string, notes: string) => {
    setWorkoutSessions((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        notes,
      },
    }));
  };

  const completedExercises = Object.values(workoutSessions).filter(
    (s) => s.completed
  ).length;
  const totalSets = exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
  const completedSets = Object.values(workoutSessions).reduce(
    (sum, session) => sum + session?.completedSets.length,
    0
  );

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center h-16 mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Today's Workout
          </h1>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="font-mono text-lg font-medium">
              {formatTime(timerSeconds)}
            </span>
          </div>
          {workoutStarted && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={pauseResumeTimer}>
                {isTimerRunning ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={resetTimer}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Workout Stats */}
      {workoutStarted && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {completedExercises}/{exercises.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Sets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {completedSets}/{totalSets}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((completedSets / totalSets) * 100) || 0}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Workout Completion */}
      {workoutCompleted && (
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="text-center py-8">
            <div className="text-green-600 mb-4">
              <Check className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Workout Completed! 🎉
            </h2>
            <p className="text-green-700 mb-4">
              Great job! You completed {exercises.length} exercises in{' '}
              {formatTime(timerSeconds)}.
            </p>
            <Button
              onClick={() => router.push(`${PORTAL_URL}/workouts`)}
              className="bg-green-600 hover:bg-green-700"
            >
              Back to Workouts
            </Button>
          </CardContent>
        </Card>
      )}

      {/* No Exercises Today */}
      {exercises.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <Dumbbell className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No exercises scheduled for today
            </h3>
            <p className="text-gray-600 mb-4">
              Enjoy your rest day or add some exercises to your routine!
            </p>
            <Button
              onClick={() => router.push(`${PORTAL_URL}/workouts`)}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Manage Exercises
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Start Workout */
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-blue-600 mb-4">
              <Target className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ready to start your workout?
            </h3>
            <p className="text-gray-600 mb-6">
              You have {exercises.length} exercises scheduled for today.
            </p>
            {workoutStarted ? (
              <Button
                onClick={resetTimer}
                variant="outline"
                className="flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="h-5 w-5" />
                Reset Workout
              </Button>
            ) : (
              <Button
                onClick={startWorkout}
                size="lg"
                className="flex items-center gap-2 mx-auto"
              >
                <Play className="h-5 w-5" />
                Start Workout
              </Button>
            )}
            {/* Exercise List */}
            <div className="space-y-6 mt-10">
              {exercises.map((exercise) => {
                const session = workoutSessions[exercise.id];
                // if (!session) return null;

                return (
                  <Card
                    key={exercise.id}
                    className={`${session?.completed ? 'border-green-200 bg-green-50' : ''}`}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <img
                          src={exercise.thumbnail || '/placeholder.svg'}
                          alt={exercise.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">
                              {exercise.name}
                            </CardTitle>
                            {session?.completed && (
                              <Badge className="bg-green-600">
                                <Check className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="mt-1 text-left">
                            {exercise.category} • {exercise.targetMuscle}
                          </CardDescription>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>{exercise.sets} sets</span>
                            <span>{exercise.reps} reps</span>
                            <span>{exercise.weight} weight</span>
                            {exercise.restTime && (
                              <span>{exercise.restTime}s rest</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Set Progress */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Set Progress:
                        </span>
                        <div className="flex gap-1">
                          {Array.from({ length: exercise.sets }, (_, i) => (
                            <div
                              key={i}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                session?.completedSets.includes(i + 1)
                                  ? 'bg-green-600 text-white'
                                  : i + 1 === session?.currentSet
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>

                      {!session?.completed && (
                        <>
                          {/* Current Set Controls */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Reps
                              </Label>
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  disabled={!session}
                                  onClick={() => updateReps(exercise.id, false)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-12 text-center font-medium">
                                  {session?.currentReps || 0}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  disabled={!session}
                                  onClick={() => updateReps(exercise.id, true)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Weight (kg)
                              </Label>
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  disabled={!session}
                                  onClick={() =>
                                    updateWeight(exercise.id, false)
                                  }
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-12 text-center font-medium">
                                  {session?.currentWeight || 0}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  disabled={!session}
                                  onClick={() =>
                                    updateWeight(exercise.id, true)
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Complete Set Button */}
                          <Button
                            onClick={() => completeSet(exercise.id)}
                            className="w-full"
                            disabled={!session}
                            size="lg"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Complete Set {session?.currentSet}
                          </Button>

                          {/* Notes */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Notes (optional)
                            </Label>
                            <Textarea
                              value={session?.notes}
                              onChange={(e) =>
                                updateNotes(exercise.id, e.target.value)
                              }
                              disabled={!session}
                              placeholder="Add notes about this exercise..."
                              rows={2}
                            />
                          </div>
                        </>
                      )}

                      {/* Exercise Notes */}
                      {exercise.notes && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Exercise Notes:</strong> {exercise.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
