export type Exercise = {
  id: string;
  name: string;
  targetSets: number;
  completedSets: number;
  image: string;
};

export type WorkoutDay = {
  day: string;
  displayName: string;
  exercises: Exercise[];
};

export type Food = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  unit: string; // per 100g, per piece, per cup, etc.
};

export type FoodEntry = {
  id: string;
  food: Food;
  quantity: number;
  timestamp: number;
};

export type Habit = {
  id: string;
  title: string;
  description: string;
  time: string;
  category: string;
  completed: boolean;
  streak: number;
};

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export type EnglishNote = {
  id: string;
  motherLanguage: string;
  english: string;
  needsTranslation?: boolean;
};
