import {
  Briefcase,
  Car,
  Gamepad2,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Plane,
  Receipt,
  Repeat,
  ShoppingCart,
  Utensils,
} from 'lucide-react';

// Expense categories with icons and colors
export const expenseCategories = [
  { id: 'housing', name: 'Housing', icon: Home, color: '#3B82F6' },
  { id: 'transportation', name: 'Transportation', icon: Car, color: '#EF4444' },
  { id: 'groceries', name: 'Groceries', icon: ShoppingCart, color: '#10B981' },
  { id: 'dining', name: 'Dining Out', icon: Utensils, color: '#F59E0B' },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: Gamepad2,
    color: '#8B5CF6',
  },
  { id: 'healthcare', name: 'Healthcare', icon: Heart, color: '#EC4899' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: '#06B6D4' },
  { id: 'business', name: 'Business', icon: Briefcase, color: '#84CC16' },
  { id: 'travel', name: 'Travel', icon: Plane, color: '#F97316' },
  { id: 'gifts', name: 'Gifts', icon: Gift, color: '#A855F7' },
  { id: 'bills', name: 'Bills & Utilities', icon: Receipt, color: '#6B7280' },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    icon: Repeat,
    color: '#14B8A6',
  },
];
