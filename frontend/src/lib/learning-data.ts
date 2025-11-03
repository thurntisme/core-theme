export interface Course {
  id: string;
  title: string;
  description: string;
  provider: string;
  category: string;
  url?: string;
  estimatedHours: number;
  startDate: string;
  completionDate?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  totalModules: number;
  completedModules: number;
  modules?: {
    title: string;
    description: string;
    duration: string;
    completed: boolean;
    lastAccessed?: string;
  }[];
  notes?: {
    title: string;
    content: string;
    date: string;
  }[];
  deadlines?: {
    title: string;
    description: string;
    daysLeft: number;
    urgent: boolean;
  }[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'book' | 'podcast' | 'course' | 'other';
  url?: string;
  source?: string;
  author?: string;
  duration?: string;
  dateAdded: string;
  courseId?: string;
  tags?: string[];
  favorite?: boolean;
  completed?: boolean;
}

export const courses: Course[] = [
  {
    id: 'react-advanced',
    title: 'Advanced React Patterns',
    description:
      'Learn advanced React patterns including render props, compound components, and more.',
    provider: 'Frontend Masters',
    category: 'Web Development',
    url: 'https://frontendmasters.com/courses/advanced-react-patterns/',
    estimatedHours: 12,
    startDate: '2023-12-15',
    status: 'in-progress',
    progress: 65,
    totalModules: 8,
    completedModules: 5,
    modules: [
      {
        title: 'Introduction to Advanced Patterns',
        description:
          'Overview of the course and introduction to advanced React patterns',
        duration: '45 min',
        completed: true,
        lastAccessed: '2023-12-15',
      },
      {
        title: 'Compound Components',
        description: 'Learn how to build flexible and composable components',
        duration: '1.5 hrs',
        completed: true,
        lastAccessed: '2023-12-18',
      },
      {
        title: 'Render Props Pattern',
        description: 'Share code between components using render props',
        duration: '2 hrs',
        completed: true,
        lastAccessed: '2023-12-22',
      },
      {
        title: 'Custom Hooks',
        description: 'Extract and reuse stateful logic with custom hooks',
        duration: '1.5 hrs',
        completed: true,
        lastAccessed: '2024-01-05',
      },
      {
        title: 'Context API',
        description: 'Manage global state with React Context',
        duration: '2 hrs',
        completed: true,
        lastAccessed: '2024-01-10',
      },
      {
        title: 'Higher-Order Components',
        description: 'Enhance components with higher-order components',
        duration: '1.5 hrs',
        completed: false,
      },
      {
        title: 'State Reducers',
        description: 'Control component state with reducers',
        duration: '2 hrs',
        completed: false,
      },
      {
        title: 'Performance Optimization',
        description: 'Optimize React components for better performance',
        duration: '1.5 hrs',
        completed: false,
      },
    ],
    notes: [
      {
        title: 'Compound Components Pattern',
        content:
          "The compound component pattern allows for greater flexibility and control over the rendering of component parts. It's similar to how HTML's <select> and <option> elements work together.",
        date: '2023-12-18',
      },
      {
        title: 'Render Props vs HOCs',
        content:
          'Render props seem more explicit and easier to follow than HOCs. They avoid the naming collision issues that can happen with HOCs.',
        date: '2023-12-22',
      },
    ],
    deadlines: [
      {
        title: 'Complete Course',
        description: 'Finish all modules and exercises',
        daysLeft: 14,
        urgent: false,
      },
      {
        title: 'Build Project',
        description: 'Apply patterns in a real project',
        daysLeft: 7,
        urgent: true,
      },
    ],
  },
  {
    id: 'typescript-fundamentals',
    title: 'TypeScript Fundamentals',
    description:
      'A comprehensive introduction to TypeScript, covering types, interfaces, generics, and more.',
    provider: 'Udemy',
    category: 'Programming',
    url: 'https://udemy.com/course/typescript-fundamentals',
    estimatedHours: 10,
    startDate: '2024-01-05',
    status: 'in-progress',
    progress: 30,
    totalModules: 10,
    completedModules: 3,
  },
  {
    id: 'nextjs-app-router',
    title: 'Next.js App Router Deep Dive',
    description:
      'Master the Next.js App Router and server components for building modern web applications.',
    provider: 'Vercel',
    category: 'Web Development',
    url: 'https://nextjs.org/learn',
    estimatedHours: 8,
    startDate: '2024-02-01',
    status: 'not-started',
    progress: 0,
    totalModules: 6,
    completedModules: 0,
  },
  {
    id: 'data-structures',
    title: 'Data Structures & Algorithms',
    description:
      'Learn essential data structures and algorithms for technical interviews and efficient programming.',
    provider: 'Coursera',
    category: 'Computer Science',
    estimatedHours: 40,
    startDate: '2023-09-10',
    completionDate: '2023-11-15',
    status: 'completed',
    progress: 100,
    totalModules: 12,
    completedModules: 12,
  },
  {
    id: 'ui-design-principles',
    title: 'UI Design Principles',
    description:
      'Learn fundamental UI design principles and how to apply them to create beautiful, usable interfaces.',
    provider: 'Figma',
    category: 'Design',
    url: 'https://figma.com/resources/learn-design/',
    estimatedHours: 15,
    startDate: '2023-10-20',
    status: 'in-progress',
    progress: 45,
    totalModules: 8,
    completedModules: 4,
  },
  {
    id: 'aws-certified-developer',
    title: 'AWS Certified Developer Associate',
    description:
      'Preparation course for the AWS Certified Developer Associate exam, covering key AWS services and best practices.',
    provider: 'A Cloud Guru',
    category: 'Cloud Computing',
    estimatedHours: 30,
    startDate: '2024-01-15',
    status: 'in-progress',
    progress: 20,
    totalModules: 15,
    completedModules: 3,
  },
];

export const resources: Resource[] = [
  {
    id: '1',
    title: "Understanding React's useEffect",
    description:
      "A comprehensive guide to React's useEffect hook and how to use it effectively.",
    type: 'article',
    url: 'https://overreacted.io/a-complete-guide-to-useeffect/',
    author: 'Dan Abramov',
    source: 'Overreacted',
    dateAdded: '2023-12-10',
    courseId: 'react-advanced',
    tags: ['react', 'hooks', 'javascript'],
  },
  {
    id: '2',
    title: 'TypeScript for React Developers',
    description:
      'Learn how to use TypeScript with React to create type-safe components and applications.',
    type: 'video',
    url: 'https://youtube.com/watch?v=typescript-react',
    source: 'YouTube',
    duration: '45 min',
    dateAdded: '2024-01-08',
    courseId: 'typescript-fundamentals',
    tags: ['typescript', 'react'],
  },
  {
    id: '3',
    title: 'Eloquent JavaScript',
    description: 'A modern introduction to web development using JavaScript.',
    type: 'book',
    author: 'Marijn Haverbeke',
    dateAdded: '2023-11-15',
    tags: ['javascript', 'programming'],
    favorite: true,
  },
  {
    id: '4',
    title: 'Next.js App Router: The Full Stack Framework',
    description:
      'Exploring the capabilities of Next.js App Router for building full-stack applications.',
    type: 'article',
    url: 'https://nextjs.org/blog/app-router-the-full-stack-framework',
    source: 'Next.js Blog',
    dateAdded: '2024-01-20',
    courseId: 'nextjs-app-router',
    tags: ['nextjs', 'react', 'full-stack'],
  },
  {
    id: '5',
    title: 'Designing Better User Interfaces',
    description:
      'Principles and practices for creating intuitive and beautiful user interfaces.',
    type: 'video',
    url: 'https://youtube.com/watch?v=ui-design-principles',
    source: 'Figma YouTube',
    duration: '1 hour',
    dateAdded: '2023-10-25',
    courseId: 'ui-design-principles',
    tags: ['design', 'ui', 'ux'],
  },
  {
    id: '6',
    title: 'AWS Lambda Deep Dive',
    description:
      'Everything you need to know about AWS Lambda for serverless applications.',
    type: 'podcast',
    url: 'https://acloudguru.com/podcasts/aws-lambda-deep-dive',
    source: 'A Cloud Guru Podcast',
    duration: '35 min',
    dateAdded: '2024-01-18',
    courseId: 'aws-certified-developer',
    tags: ['aws', 'serverless', 'lambda'],
  },
];
