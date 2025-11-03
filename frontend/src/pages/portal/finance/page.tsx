'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Edit,
  Plus,
  Target,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { BarChart3 } from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

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
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { expenseCategories } from '@/constants/p/finance';
import { PORTAL_URL } from '@/constants/site';
import { PlannedExpense, RealExpense } from '@/types/portal';

const addPoints = (action: string, points: number) => {
  const today = new Date().toISOString().split('T')[0];
  const currentPoints = Number.parseInt(
    localStorage.getItem('freelancer-points') || '0'
  );
  localStorage.setItem(
    'freelancer-points',
    (currentPoints + points).toString()
  );

  const activities = JSON.parse(
    localStorage.getItem('freelancer-activities') || '[]'
  );
  activities.push({
    id: Date.now().toString(),
    action,
    points,
    date: today,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem('freelancer-activities', JSON.stringify(activities));

  const dailyActivity = JSON.parse(
    localStorage.getItem('freelancer-daily-activity') || '{}'
  );
  dailyActivity[today] = (dailyActivity[today] || 0) + 1;
  localStorage.setItem(
    'freelancer-daily-activity',
    JSON.stringify(dailyActivity)
  );
};

// Helper functions for period calculations
const getPeriodLabel = (period: string, date: string) => {
  const d = new Date(date);
  const weekStart = new Date(d);
  const weekEnd = new Date(weekStart);
  switch (period) {
    case 'daily':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'weekly':
      weekStart.setDate(d.getDate() - d.getDay());
      weekEnd.setDate(weekStart.getDate() + 6);
      return `Week of ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    case 'monthly':
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    case 'yearly':
      return d.getFullYear().toString();
    default:
      return date;
  }
};

const getDateRangeForPeriod = (period: string, date: string) => {
  const d = new Date(date);
  const weekStart = new Date(d);
  const weekEnd = new Date(weekStart);
  const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
  const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  switch (period) {
    case 'daily':
      return { start: date, end: date };
    case 'weekly':
      weekStart.setDate(d.getDate() - d.getDay());
      weekEnd.setDate(weekStart.getDate() + 6);
      return {
        start: weekStart.toISOString().split('T')[0],
        end: weekEnd.toISOString().split('T')[0],
      };
    case 'monthly':
      return {
        start: monthStart.toISOString().split('T')[0],
        end: monthEnd.toISOString().split('T')[0],
      };
    case 'yearly':
      return {
        start: `${d.getFullYear()}-01-01`,
        end: `${d.getFullYear()}-12-31`,
      };
    default:
      return { start: date, end: date };
  }
};

const isDateInRange = (expenseDate: string, start: string, end: string) => {
  return expenseDate >= start && expenseDate <= end;
};

export default function FinancePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('expenses'); // Changed default to expenses
  const [selectedPeriod, setSelectedPeriod] = useState<
    'daily' | 'weekly' | 'monthly' | 'yearly'
  >('monthly');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // States for planned expenses
  const [plannedExpenses, setPlannedExpenses] = useState<PlannedExpense[]>([]);
  const [isAddingPlanned, setIsAddingPlanned] = useState(false);
  const [editingPlanned, setEditingPlanned] = useState<PlannedExpense | null>(
    null
  );
  const [plannedForm, setPlannedForm] = useState({
    category: '',
    amount: '',
  });

  // States for real expenses
  const [realExpenses, setRealExpenses] = useState<RealExpense[]>([]);
  const [isAddingReal, setIsAddingReal] = useState(false);
  const [editingReal, setEditingReal] = useState<RealExpense | null>(null);
  const [realForm, setRealForm] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find((cookie) =>
        cookie.trim().startsWith('auth-session=')
      );

      if (authCookie && authCookie.includes('authenticated')) {
        setIsAuthenticated(true);
        loadData();
      } else {
        navigate(`${PORTAL_URL}/login`);
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const loadData = () => {
    const savedPlanned = localStorage.getItem('freelancer-planned-expenses');
    if (savedPlanned) {
      setPlannedExpenses(JSON.parse(savedPlanned));
    }

    const savedReal = localStorage.getItem('freelancer-real-expenses');
    if (savedReal) {
      setRealExpenses(JSON.parse(savedReal));
    }
  };

  // Get current period data
  const currentRange = getDateRangeForPeriod(selectedPeriod, selectedDate);
  const currentPlannedExpenses = plannedExpenses.filter(
    (expense) =>
      expense.period === selectedPeriod &&
      isDateInRange(expense.date, currentRange.start, currentRange.end)
  );
  const currentRealExpenses = realExpenses.filter((expense) =>
    isDateInRange(expense.date, currentRange.start, currentRange.end)
  );

  // Planned expense handlers
  const handleAddPlanned = () => {
    if (!plannedForm.category || !plannedForm.amount) return;

    const newExpense: PlannedExpense = {
      id: Date.now().toString(),
      category: plannedForm.category,
      amount: Number.parseFloat(plannedForm.amount),
      period: selectedPeriod,
      date: selectedDate,
      createdAt: new Date().toISOString(),
    };

    const updatedExpenses = [...plannedExpenses, newExpense];
    setPlannedExpenses(updatedExpenses);
    localStorage.setItem(
      'freelancer-planned-expenses',
      JSON.stringify(updatedExpenses)
    );

    addPoints('Added planned expense', 3);
    setPlannedForm({ category: '', amount: '' });
    setIsAddingPlanned(false);
  };

  const handleEditPlanned = () => {
    if (!editingPlanned || !plannedForm.category || !plannedForm.amount) return;

    const updatedExpenses = plannedExpenses.map((expense) =>
      expense.id === editingPlanned.id
        ? {
            ...expense,
            category: plannedForm.category,
            amount: Number.parseFloat(plannedForm.amount),
          }
        : expense
    );

    setPlannedExpenses(updatedExpenses);
    localStorage.setItem(
      'freelancer-planned-expenses',
      JSON.stringify(updatedExpenses)
    );

    addPoints('Updated planned expense', 2);
    setEditingPlanned(null);
    setPlannedForm({ category: '', amount: '' });
  };

  const handleDeletePlanned = (id: string) => {
    const updatedExpenses = plannedExpenses.filter(
      (expense) => expense.id !== id
    );
    setPlannedExpenses(updatedExpenses);
    localStorage.setItem(
      'freelancer-planned-expenses',
      JSON.stringify(updatedExpenses)
    );
    addPoints('Deleted planned expense', 1);
  };

  // Real expense handlers
  const handleAddReal = () => {
    if (!realForm.category || !realForm.amount || !realForm.date) return;

    const newExpense: RealExpense = {
      id: Date.now().toString(),
      category: realForm.category,
      amount: Number.parseFloat(realForm.amount),
      description: realForm.description,
      date: realForm.date,
      createdAt: new Date().toISOString(),
    };

    const updatedExpenses = [...realExpenses, newExpense];
    setRealExpenses(updatedExpenses);
    localStorage.setItem(
      'freelancer-real-expenses',
      JSON.stringify(updatedExpenses)
    );

    addPoints('Added real expense', 3);
    setRealForm({
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsAddingReal(false);
  };

  const handleEditReal = () => {
    if (
      !editingReal ||
      !realForm.category ||
      !realForm.amount ||
      !realForm.date
    )
      return;

    const updatedExpenses = realExpenses.map((expense) =>
      expense.id === editingReal.id
        ? {
            ...expense,
            category: realForm.category,
            amount: Number.parseFloat(realForm.amount),
            description: realForm.description,
            date: realForm.date,
          }
        : expense
    );

    setRealExpenses(updatedExpenses);
    localStorage.setItem(
      'freelancer-real-expenses',
      JSON.stringify(updatedExpenses)
    );

    addPoints('Updated real expense', 2);
    setEditingReal(null);
    setRealForm({
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteReal = (id: string) => {
    const updatedExpenses = realExpenses.filter((expense) => expense.id !== id);
    setRealExpenses(updatedExpenses);
    localStorage.setItem(
      'freelancer-real-expenses',
      JSON.stringify(updatedExpenses)
    );
    addPoints('Deleted real expense', 1);
  };

  // Calculate summary data
  const totalPlanned = currentPlannedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalReal = currentRealExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const difference = totalPlanned - totalReal;
  const budgetUsage = totalPlanned > 0 ? (totalReal / totalPlanned) * 100 : 0;

  // Prepare chart data
  const categoryData = expenseCategories
    .map((category) => {
      const planned = currentPlannedExpenses
        .filter((expense) => expense.category === category.id)
        .reduce((sum, expense) => sum + expense.amount, 0);

      const actual = currentRealExpenses
        .filter((expense) => expense.category === category.id)
        .reduce((sum, expense) => sum + expense.amount, 0);

      return {
        category: category.name,
        planned,
        actual,
        color: category.color,
      };
    })
    .filter((item) => item.planned > 0 || item.actual > 0);

  // Pie chart data for actual expenses
  const pieData = categoryData
    .filter((item) => item.actual > 0)
    .map((item) => ({
      name: item.category,
      value: item.actual,
      color: item.color,
    }));

  // Trend data (last 6 periods)
  const getTrendData = () => {
    const trendData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      if (selectedPeriod === 'monthly') {
        date.setMonth(date.getMonth() - i);
      } else if (selectedPeriod === 'yearly') {
        date.setFullYear(date.getFullYear() - i);
      } else if (selectedPeriod === 'weekly') {
        date.setDate(date.getDate() - i * 7);
      } else {
        date.setDate(date.getDate() - i);
      }

      const dateStr = date.toISOString().split('T')[0];
      const range = getDateRangeForPeriod(selectedPeriod, dateStr);

      const periodReal = realExpenses
        .filter((expense) =>
          isDateInRange(expense.date, range.start, range.end)
        )
        .reduce((sum, expense) => sum + expense.amount, 0);

      trendData.push({
        period: getPeriodLabel(selectedPeriod, dateStr)
          .split(' ')
          .slice(-2)
          .join(' '),
        amount: periodReal,
      });
    }
    return trendData;
  };

  const trendData = getTrendData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Info */}
        <div className="mb-6 flex items-center justify-between">
          <div className="gap-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {getPeriodLabel(selectedPeriod, selectedDate)}
            </h2>
            <p className="text-gray-600">
              Manage your {selectedPeriod} budget and track expenses
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={selectedPeriod}
              onValueChange={(value: any) => setSelectedPeriod(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Planned Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${totalPlanned.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Actual Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalReal.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                {difference >= 0 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                Difference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {difference >= 0 ? '+' : ''}${difference.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Budget Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${budgetUsage > 100 ? 'text-red-600' : 'text-green-600'}`}
              >
                {budgetUsage.toFixed(1)}%
              </div>
              <Progress value={Math.min(budgetUsage, 100)} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Real Expenses
            </TabsTrigger>
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Budget Planning
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Real Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Real Expenses</h3>
              <Dialog open={isAddingReal} onOpenChange={setIsAddingReal}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Real Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Real Expense</DialogTitle>
                    <DialogDescription>
                      Record an actual expense you've made
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="real-category">Category</Label>
                      <Select
                        value={realForm.category}
                        onValueChange={(value) =>
                          setRealForm({ ...realForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <category.icon
                                  className="h-4 w-4"
                                  style={{ color: category.color }}
                                />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="real-amount">Amount ($)</Label>
                      <Input
                        id="real-amount"
                        type="number"
                        step="0.01"
                        value={realForm.amount}
                        onChange={(e) =>
                          setRealForm({ ...realForm, amount: e.target.value })
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="real-description">Description</Label>
                      <Textarea
                        id="real-description"
                        value={realForm.description}
                        onChange={(e) =>
                          setRealForm({
                            ...realForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Optional description..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="real-date">Date</Label>
                      <Input
                        id="real-date"
                        type="date"
                        value={realForm.date}
                        onChange={(e) =>
                          setRealForm({ ...realForm, date: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddReal} className="flex-1">
                        Add Expense
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingReal(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {currentRealExpenses.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No expenses recorded for this {selectedPeriod}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Click "Add Real Expense" to get started
                    </p>
                  </CardContent>
                </Card>
              ) : (
                currentRealExpenses
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((expense) => {
                    const category = expenseCategories.find(
                      (cat) => cat.id === expense.category
                    );
                    const IconComponent = category?.icon || DollarSign;
                    return (
                      <Card key={expense.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{
                                backgroundColor: `${category?.color}20`,
                              }}
                            >
                              <IconComponent
                                className="h-5 w-5"
                                style={{ color: category?.color }}
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{category?.name}</h4>
                              <p className="text-sm text-gray-600">
                                {expense.description}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(expense.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">
                              ${expense.amount.toFixed(2)}
                            </span>
                            <div className="flex gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingReal(expense);
                                      setRealForm({
                                        category: expense.category,
                                        amount: expense.amount.toString(),
                                        description: expense.description,
                                        date: expense.date,
                                      });
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Real Expense</DialogTitle>
                                    <DialogDescription>
                                      Update your expense details
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="edit-real-category">
                                        Category
                                      </Label>
                                      <Select
                                        value={realForm.category}
                                        onValueChange={(value) =>
                                          setRealForm({
                                            ...realForm,
                                            category: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {expenseCategories.map((category) => (
                                            <SelectItem
                                              key={category.id}
                                              value={category.id}
                                            >
                                              <div className="flex items-center gap-2">
                                                <category.icon
                                                  className="h-4 w-4"
                                                  style={{
                                                    color: category.color,
                                                  }}
                                                />
                                                {category.name}
                                              </div>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-real-amount">
                                        Amount ($)
                                      </Label>
                                      <Input
                                        id="edit-real-amount"
                                        type="number"
                                        step="0.01"
                                        value={realForm.amount}
                                        onChange={(e) =>
                                          setRealForm({
                                            ...realForm,
                                            amount: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-real-description">
                                        Description
                                      </Label>
                                      <Textarea
                                        id="edit-real-description"
                                        value={realForm.description}
                                        onChange={(e) =>
                                          setRealForm({
                                            ...realForm,
                                            description: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-real-date">
                                        Date
                                      </Label>
                                      <Input
                                        id="edit-real-date"
                                        type="date"
                                        value={realForm.date}
                                        onChange={(e) =>
                                          setRealForm({
                                            ...realForm,
                                            date: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={handleEditReal}
                                        className="flex-1"
                                      >
                                        Update Expense
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => setEditingReal(null)}
                                        className="flex-1"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Expense
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this
                                      expense? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteReal(expense.id)
                                      }
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
              )}
            </div>
          </TabsContent>

          {/* Budget Planning Tab */}
          <TabsContent value="planning" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Budget Planning</h3>
              <Dialog open={isAddingPlanned} onOpenChange={setIsAddingPlanned}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Planned Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Planned Expense</DialogTitle>
                    <DialogDescription>
                      Plan your {selectedPeriod} budget by category
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="planned-category">Category</Label>
                      <Select
                        value={plannedForm.category}
                        onValueChange={(value) =>
                          setPlannedForm({ ...plannedForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <category.icon
                                  className="h-4 w-4"
                                  style={{ color: category.color }}
                                />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="planned-amount">Planned Amount ($)</Label>
                      <Input
                        id="planned-amount"
                        type="number"
                        step="0.01"
                        value={plannedForm.amount}
                        onChange={(e) =>
                          setPlannedForm({
                            ...plannedForm,
                            amount: e.target.value,
                          })
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddPlanned} className="flex-1">
                        Add to Budget
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingPlanned(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {currentPlannedExpenses.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No budget planned for this {selectedPeriod}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Click "Add Planned Expense" to start planning
                    </p>
                  </CardContent>
                </Card>
              ) : (
                currentPlannedExpenses.map((expense) => {
                  const category = expenseCategories.find(
                    (cat) => cat.id === expense.category
                  );
                  const IconComponent = category?.icon || Target;
                  const actualSpent = currentRealExpenses
                    .filter((real) => real.category === expense.category)
                    .reduce((sum, real) => sum + real.amount, 0);
                  const percentage =
                    expense.amount > 0
                      ? (actualSpent / expense.amount) * 100
                      : 0;

                  return (
                    <Card key={expense.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{
                                backgroundColor: `${category?.color}20`,
                              }}
                            >
                              <IconComponent
                                className="h-5 w-5"
                                style={{ color: category?.color }}
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{category?.name}</h4>
                              <p className="text-sm text-gray-600">
                                ${actualSpent.toFixed(2)} of $
                                {expense.amount.toFixed(2)} spent
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                percentage > 100
                                  ? 'destructive'
                                  : percentage > 80
                                    ? 'secondary'
                                    : 'default'
                              }
                            >
                              {percentage.toFixed(1)}%
                            </Badge>
                            <div className="flex gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingPlanned(expense);
                                      setPlannedForm({
                                        category: expense.category,
                                        amount: expense.amount.toString(),
                                      });
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Edit Planned Expense
                                    </DialogTitle>
                                    <DialogDescription>
                                      Update your budget plan
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="edit-planned-category">
                                        Category
                                      </Label>
                                      <Select
                                        value={plannedForm.category}
                                        onValueChange={(value) =>
                                          setPlannedForm({
                                            ...plannedForm,
                                            category: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {expenseCategories.map((category) => (
                                            <SelectItem
                                              key={category.id}
                                              value={category.id}
                                            >
                                              <div className="flex items-center gap-2">
                                                <category.icon
                                                  className="h-4 w-4"
                                                  style={{
                                                    color: category.color,
                                                  }}
                                                />
                                                {category.name}
                                              </div>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-planned-amount">
                                        Planned Amount ($)
                                      </Label>
                                      <Input
                                        id="edit-planned-amount"
                                        type="number"
                                        step="0.01"
                                        value={plannedForm.amount}
                                        onChange={(e) =>
                                          setPlannedForm({
                                            ...plannedForm,
                                            amount: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={handleEditPlanned}
                                        className="flex-1"
                                      >
                                        Update Budget
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => setEditingPlanned(null)}
                                        className="flex-1"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Planned Expense
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this
                                      planned expense? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeletePlanned(expense.id)
                                      }
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                        <Progress
                          value={Math.min(percentage, 100)}
                          className={`h-2 ${percentage > 100 ? 'bg-red-100' : ''}`}
                        />
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>
                    Planned vs Actual spending by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryData.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No data available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {categoryData.map((item) => (
                        <div key={item.category} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {item.category}
                            </span>
                            <div className="flex gap-4 text-sm">
                              <span className="text-blue-600">
                                Planned: ${item.planned.toFixed(2)}
                              </span>
                              <span className="text-green-600">
                                Actual: ${item.actual.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 bg-blue-100 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                  width: `${Math.min((item.planned / Math.max(...categoryData.map((d) => Math.max(d.planned, d.actual)))) * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <div className="flex-1 bg-green-100 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{
                                  width: `${Math.min((item.actual / Math.max(...categoryData.map((d) => Math.max(d.planned, d.actual)))) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Expense Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Expense Distribution</CardTitle>
                  <CardDescription>
                    How your money is being spent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pieData.length === 0 ? (
                    <div className="text-center py-8">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No expenses to display</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Spending Trend */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Spending Trend</CardTitle>
                  <CardDescription>
                    Your spending pattern over the last 6 {selectedPeriod}s
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {trendData.every((item) => item.amount === 0) ? (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No trend data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ fill: '#10B981' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
