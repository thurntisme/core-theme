import { Exercise, Food, Habit } from '@/types/flex-life';

export const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can do it. It's your mind you need to convince.",
  'Success is what comes after you stop making excuses.',
  'The pain you feel today will be the strength you feel tomorrow.',
  "Don't wish for it, work for it.",
  'Champions train, losers complain.',
  'Sweat is just fat crying.',
  'Strong is the new skinny.',
  'The only impossible journey is the one you never begin.',
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
];

export const dayNames = {
  warmup: 'Warm-up',
  monday: 'Monday - Chest & Triceps',
  tuesday: 'Tuesday - Legs',
  wednesday: 'Wednesday - Back & Biceps',
  thursday: 'Thursday - Shoulders',
  friday: 'Friday - Full Body',
};

export const workoutPlan: Record<string, Exercise[]> = {
  monday: [
    {
      id: '1',
      name: 'Incline Dumbbell Press',
      targetSets: 4,
      completedSets: 0,
      image:
        'https://central.thurntisme.com/wp-content/uploads/2025/07/Incline-Dumbbell-Press.jpg',
    },
    {
      id: '2',
      name: 'Flat Dumbbell Press',
      targetSets: 3,
      completedSets: 0,
      image:
        'https://central.thurntisme.com/wp-content/uploads/2025/07/DUMBBELL-PRESS.jpg',
    },
    {
      id: '3',
      name: 'Dumbbell Pullovers',
      targetSets: 3,
      completedSets: 0,
      image:
        'https://central.thurntisme.com/wp-content/uploads/2025/07/DUMBBELL-PULLOVERS.jpg',
    },
    {
      id: '4',
      name: 'Seated Dumbbell Triceps Extension',
      targetSets: 3,
      completedSets: 0,
      image:
        'https://central.thurntisme.com/wp-content/uploads/2025/07/SEATED-DUMBBELL-TRICEPS-EXTENSIONS.jpg',
    },
    {
      id: '5',
      name: 'Dumbbell Triceps Kickbacks',
      targetSets: 3,
      completedSets: 0,
      image:
        'https://central.thurntisme.com/wp-content/uploads/2025/07/TRICEPS-KICKBACKS.jpg',
    },
  ],
  tuesday: [
    {
      id: '1',
      name: 'Dumbbell Goblet Squat',
      targetSets: 4,
      completedSets: 0,
      image: '/placeholder.svg?height=120&width=200&text=Barbell+Back+Squat',
    },
    {
      id: '2',
      name: 'Dumbbell Stiff Leg',
      targetSets: 4,
      completedSets: 0,
      image: '/placeholder.svg?height=120&width=200&text=Romanian+Deadlift',
    },
    {
      id: '3',
      name: 'Dumbbell Sumo Squat',
      targetSets: 4,
      completedSets: 0,
      image: '/placeholder.svg?height=120&width=200&text=Barbell+Back+Squat',
    },
    {
      id: '4',
      name: 'Bulgarian Split Squat',
      targetSets: 4,
      completedSets: 0,
      image: '/placeholder.svg?height=120&width=200&text=Romanian+Deadlift',
    },
    {
      id: '5',
      name: 'Standing Dumbbell Calf Raise',
      targetSets: 4,
      completedSets: 0,
      image: '/placeholder.svg?height=120&width=200&text=Barbell+Back+Squat',
    },
  ],
  wednesday: [
    {
      id: '1',
      name: 'Lat pull-downs',
      targetSets: 4,
      completedSets: 0,
      image:
        'https://central.thurntisme.com/wp-content/uploads/2025/07/LAT-PULL-DOWNS.jpg',
    },
    {
      id: '2',
      name: 'Seated Cable Row',
      targetSets: 3,
      completedSets: 0,
      image: '/placeholder.svg?height=120&width=200&text=Seated+Cable+Row',
    },
    {
      id: '3',
      name: 'One-arm Dumbbell Rows',
      targetSets: 3,
      completedSets: 0,
      image:
        'https://central.thurntisme.com/wp-content/uploads/2025/07/ONE-ARM-DUMBBELL-ROWS.jpg',
    },
    {
      id: '4',
      name: 'Hammer Curls',
      targetSets: 3,
      completedSets: 0,
      image:
        'https://central.thurntisme.com/wp-content/uploads/2025/07/HAMMER-CURLS.jpg',
    },
    {
      id: '5',
      name: 'Concentration Curls',
      targetSets: 3,
      completedSets: 0,
      image:
        'https://central.thurntisme.com/wp-content/uploads/2025/07/CONCENTRATION-CURLS.jpg',
    },
  ],
  thursday: [
    {
      id: '1',
      name: 'Dumbbell Press',
      targetSets: 4,
      completedSets: 0,
      image:
        'https://central.thurntisme.com/wp-content/uploads/2025/07/DUMBBELL-PRESS-1.jpg',
    },
    {
      id: '2',
      name: 'Bent-over Lateral Raise',
      targetSets: 3,
      completedSets: 0,
      image:
        'https://central.thurntisme.com/wp-content/uploads/2025/07/BENT-OVER-LATERAL-RAISES.jpg',
    },
    {
      id: '3',
      name: 'Front Raise',
      targetSets: 3,
      completedSets: 0,
      image: '/placeholder.svg?height=120&width=200&text=Front+Raise',
    },
    {
      id: '4',
      name: 'Reverse Dumbbell Fly',
      targetSets: 3,
      completedSets: 0,
      image: '/placeholder.svg?height=120&width=200&text=Shrugs',
    },
    {
      id: '5',
      name: 'Dumbbell Shrugs',
      targetSets: 3,
      completedSets: 0,
      image: '/placeholder.svg?height=120&width=200&text=Shrugs',
    },
  ],
  friday: [
    {
      id: '1',
      name: 'Romanian Deadlift',
      targetSets: 4,
      completedSets: 0,
      image: '/placeholder.svg?height=120&width=200&text=Deadlift',
    },
    {
      id: '2',
      name: 'Dumbbell Bench Press',
      targetSets: 3,
      completedSets: 0,
      image: '/placeholder.svg?height=120&width=200&text=Dumbbell+Bench+Press',
    },
    {
      id: '3',
      name: 'Overhead Dumbbell Press',
      targetSets: 3,
      completedSets: 0,
      image: '/placeholder.svg?height=120&width=200&text=Goblet+Squat',
    },
  ],
};

export const nutritionTargets = {
  calories: 2500,
  protein: 150, // grams
  carbs: 300, // grams
  fat: 80, // grams
  fiber: 25, // grams
  sugar: 50, // grams (max)
  sodium: 2300, // mg (max)
};

export const foodDatabase: Food[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    unit: '100g',
  },
  {
    id: '2',
    name: 'Brown Rice',
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    fiber: 1.8,
    sugar: 0.4,
    sodium: 5,
    unit: '100g',
  },
  {
    id: '3',
    name: 'Broccoli',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    sugar: 1.5,
    sodium: 33,
    unit: '100g',
  },
  {
    id: '4',
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12,
    sodium: 1,
    unit: '100g',
  },
  {
    id: '5',
    name: 'Salmon',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    unit: '100g',
  },
  {
    id: '6',
    name: 'Sweet Potato',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    fiber: 3,
    sugar: 4.2,
    sodium: 54,
    unit: '100g',
  },
  {
    id: '7',
    name: 'Greek Yogurt',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    fiber: 0,
    sugar: 3.6,
    sodium: 36,
    unit: '100g',
  },
  {
    id: '8',
    name: 'Almonds',
    calories: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    fiber: 12,
    sugar: 4.4,
    sodium: 1,
    unit: '100g',
  },
  {
    id: '9',
    name: 'Oatmeal',
    calories: 68,
    protein: 2.4,
    carbs: 12,
    fat: 1.4,
    fiber: 1.7,
    sugar: 0.3,
    sodium: 49,
    unit: '100g',
  },
  {
    id: '10',
    name: 'Eggs',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    sugar: 1.1,
    sodium: 124,
    unit: '100g',
  },
];

export const defaultHabits: Habit[] = [
  {
    id: '1',
    title: 'Drink Water in the Morning',
    description: 'Drink a glass of water right after waking up.',
    time: '05:10',
    category: 'morning',
    completed: false,
    streak: 0,
  },
  {
    id: '2',
    title: 'Do Morning Warm-up Workout',
    description: 'Complete a short warm-up session to start the day.',
    time: '05:15',
    category: 'morning',
    completed: false,
    streak: 0,
  },
  {
    id: '3',
    title: 'Go to the Gym',
    description: 'Go to the gym for your scheduled workout.',
    time: '06:30',
    category: 'morning',
    completed: false,
    streak: 0,
  },
  {
    id: '4',
    title: 'Take a Nap',
    description: 'Take a short nap to recharge your energy.',
    time: '12:45',
    category: 'afternoon',
    completed: false,
    streak: 0,
  },
  {
    id: '5',
    title: 'Evening Learning Session',
    description: 'Spend time learning or studying in the evening.',
    time: '20:00',
    category: 'evening',
    completed: false,
    streak: 0,
  },
  {
    id: '6',
    title: 'Study English',
    description: 'Dedicate time to studying English.',
    time: '21:00',
    category: 'evening',
    completed: false,
    streak: 0,
  },
  {
    id: '7',
    title: 'Write Daily Journal and Read Aloud',
    description: 'Write your journal and read it aloud to improve speaking.',
    time: '22:00',
    category: 'evening',
    completed: false,
    streak: 0,
  },
];
