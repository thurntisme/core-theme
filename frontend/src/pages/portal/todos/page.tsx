'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Calendar,
  CheckCircle,
  Edit,
  Minus,
  Plus,
  Search,
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

interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const priorityConfig = {
  low: {
    label: 'Low',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    icon: ArrowDown,
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    icon: Minus,
  },
  high: {
    label: 'High',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    icon: ArrowUp,
  },
};

const defaultCategories = [
  'Personal',
  'Work',
  'Health',
  'Learning',
  'Shopping',
  'Other',
];

export default function TodosPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as Todo['priority'],
    category: 'Personal',
  });
  const navigate = useNavigate();

  const saveTodos = (updatedTodos: Todo[]) => {
    setTodos(updatedTodos);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: 'Personal',
    });
  };

  const handleAddTodo = () => {
    if (!formData.title.trim()) {
      alert('Title is required!');
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      ...formData,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTodos = [...todos, newTodo];
    saveTodos(updatedTodos);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditTodo = () => {
    if (!formData.title.trim()) {
      alert('Title is required!');
      return;
    }

    if (!editingTodo) return;

    const updatedTodos = todos.map((todo) =>
      todo.id === editingTodo.id
        ? {
            ...todo,
            ...formData,
            updatedAt: new Date().toISOString(),
          }
        : todo
    );

    saveTodos(updatedTodos);
    resetForm();
    setEditingTodo(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteTodo = (todoId: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== todoId);
    saveTodos(updatedTodos);
  };

  const handleToggleComplete = (todoId: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === todoId
        ? {
            ...todo,
            completed: !todo.completed,
            updatedAt: new Date().toISOString(),
          }
        : todo
    );
    saveTodos(updatedTodos);
  };

  const openEditDialog = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      priority: todo.priority,
      category: todo.category,
    });
    setIsEditDialogOpen(true);
  };

  const isOverdue = (dueDate: string, completed: boolean) => {
    if (completed || !dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUniqueCategories = () => {
    const categories = new Set(todos.map((todo) => todo.category));
    return Array.from(categories).sort();
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      priorityFilter === 'all' || todo.priority === priorityFilter;
    const matchesCategory =
      categoryFilter === 'all' || todo.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && todo.completed) ||
      (statusFilter === 'pending' && !todo.completed);

    return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
  });

  // Sort todos: incomplete first, then by priority, then by due date
  const sortedTodos = filteredTodos.sort((a, b) => {
    // Completed todos go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Sort by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    // Sort by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    return 0;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const pendingCount = todos.filter((todo) => !todo.completed).length;
  const overdueCount = todos.filter((todo) =>
    isOverdue(todo.dueDate, todo.completed)
  ).length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Todos</h2>
          <p className="text-gray-600 mt-1">
            Manage your personal tasks and daily activities
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Todo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Todo</DialogTitle>
              <DialogDescription>
                Create a new todo item to track your tasks.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter todo title"
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
                      {defaultCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: Todo['priority']) =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Todo description and details..."
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
              <Button onClick={handleAddTodo}>Add Todo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Todos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {todos.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {pendingCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overdueCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search todos by title, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {getUniqueCategories().map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <Badge variant="secondary" className="px-3 py-1">
            {sortedTodos.length} {sortedTodos.length === 1 ? 'todo' : 'todos'}
          </Badge>
        </div>
      </div>

      {/* Todos List */}
      {sortedTodos.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <CheckCircle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ||
              statusFilter !== 'all' ||
              priorityFilter !== 'all' ||
              categoryFilter !== 'all'
                ? 'No todos found'
                : 'No todos yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ||
              statusFilter !== 'all' ||
              priorityFilter !== 'all' ||
              categoryFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first todo'}
            </p>
            {!searchTerm &&
              statusFilter === 'all' &&
              priorityFilter === 'all' &&
              categoryFilter === 'all' && (
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Todo
                </Button>
              )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedTodos.map((todo) => {
            const priority = priorityConfig[todo.priority];
            const PriorityIcon = priority.icon;
            const overdue = isOverdue(todo.dueDate, todo.completed);
            const daysUntilDue = getDaysUntilDue(todo.dueDate);

            return (
              <Card
                key={todo.id}
                className={`hover:shadow-md transition-shadow ${todo.completed ? 'opacity-75' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleComplete(todo.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-medium mb-2 ${
                              todo.completed
                                ? 'line-through text-gray-500'
                                : 'text-gray-900'
                            }`}
                          >
                            {todo.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">
                              {todo.category}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={`${priority.bgColor} ${priority.textColor} border-0`}
                            >
                              <PriorityIcon className="h-3 w-3 mr-1" />
                              {priority.label}
                            </Badge>
                            {overdue && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                          </div>
                          {todo.description && (
                            <p
                              className={`text-sm mb-3 ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}
                            >
                              {todo.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {todo.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span
                                  className={
                                    overdue && !todo.completed
                                      ? 'text-red-600 font-medium'
                                      : ''
                                  }
                                >
                                  Due:{' '}
                                  {new Date(todo.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {daysUntilDue !== null && !todo.completed && (
                              <div className="text-xs">
                                {daysUntilDue > 0 ? (
                                  <span className="text-gray-500">
                                    {daysUntilDue} days remaining
                                  </span>
                                ) : daysUntilDue === 0 ? (
                                  <span className="text-orange-600 font-medium">
                                    Due today
                                  </span>
                                ) : (
                                  <span className="text-red-600 font-medium">
                                    {Math.abs(daysUntilDue)} days overdue
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(todo)}
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
                                <AlertDialogTitle>Delete Todo</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{todo.title}
                                  "? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTodo(todo.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
            <DialogDescription>Update todo information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter todo title"
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
                    {defaultCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Todo['priority']) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Todo description and details..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setEditingTodo(null);
                setIsEditDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditTodo}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
