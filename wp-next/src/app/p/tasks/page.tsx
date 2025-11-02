'use client';

import { useEffect, useState } from 'react';

import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Edit,
  FileText,
  FolderOpen,
  Minus,
  Plus,
  Search,
  Trash2,
  User,
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

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  website: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  startDate: string;
  deadline: string;
  status: 'planned' | 'in-progress' | 'done';
  createdAt: string;
  updatedAt: string;
}

interface Task {
  id: string;
  name: string;
  projectId: string;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  todo: {
    label: 'To Do',
    color: 'bg-gray-500',
    textColor: 'text-gray-700',
    bgColor: 'bg-gray-50',
    icon: Circle,
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    icon: Clock,
  },
  done: {
    label: 'Done',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    icon: CheckCircle,
  },
};

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

export default function TasksPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    projectId: '',
    dueDate: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    notes: '',
  });
  const router = useRouter();

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      projectId: '',
      dueDate: '',
      status: 'todo',
      priority: 'medium',
      notes: '',
    });
  };

  const handleAddTask = () => {
    if (!formData.name.trim() || !formData.projectId || !formData.dueDate) {
      alert('Name, project, and due date are required!');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditTask = () => {
    if (!formData.name.trim() || !formData.projectId || !formData.dueDate) {
      alert('Name, project, and due date are required!');
      return;
    }

    if (!editingTask) return;

    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id
        ? {
            ...task,
            ...formData,
            updatedAt: new Date().toISOString(),
          }
        : task
    );

    saveTasks(updatedTasks);
    resetForm();
    setEditingTask(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setFormData({
      name: task.name,
      projectId: task.projectId,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      notes: task.notes,
    });
    setIsEditDialogOpen(true);
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getClientName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return 'Unknown Client';
    const client = clients.find((c) => c.id === project.clientId);
    return client ? client.name : 'Unknown Client';
  };

  const isOverdue = (dueDate: string, status: Task['status']) => {
    if (status === 'done') return false;
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProjectName(task.projectId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getClientName(task.projectId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort tasks by priority (high first) and then by due date
  const sortedTasks = filteredTasks.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600 mt-1">
            Manage your tasks and track their progress
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task and assign it to a project.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Task Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter task name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project">Project *</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, projectId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.length === 0 ? (
                      <SelectItem value="no-projects" disabled>
                        No projects available - Add projects first
                      </SelectItem>
                    ) : (
                      projects.map((project) => {
                        const client = clients.find(
                          (c) => c.id === project.clientId
                        );
                        return (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name} {client && `(${client.name})`}
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
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
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: Task['priority']) =>
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
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Task['status']) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Task notes and details..."
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
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tasks by name, notes, project, or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <Badge variant="secondary" className="px-3 py-1">
            {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'}
          </Badge>
        </div>
      </div>

      {/* Tasks Grid */}
      {sortedTasks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <CheckCircle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No tasks found'
                : 'No tasks yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : projects.length === 0
                  ? 'Add some projects first, then create your first task'
                  : 'Get started by creating your first task'}
            </p>
            {!searchTerm &&
              statusFilter === 'all' &&
              priorityFilter === 'all' && (
                <div className="flex gap-2 justify-center">
                  {projects.length === 0 ? (
                    <Button
                      onClick={() => router.push('/projects')}
                      variant="outline"
                    >
                      Add Projects First
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Your First Task
                    </Button>
                  )}
                </div>
              )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTasks.map((task) => {
            const status = statusConfig[task.status];
            const priority = priorityConfig[task.priority];
            const StatusIcon = status.icon;
            const PriorityIcon = priority.icon;
            const overdue = isOverdue(task.dueDate, task.status);
            const daysUntilDue = getDaysUntilDue(task.dueDate);

            return (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {task.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="secondary"
                          className={`${status.bgColor} ${status.textColor} border-0`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
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
                      <CardDescription className="flex items-center gap-1 mb-1">
                        <FolderOpen className="h-3 w-3" />
                        {getProjectName(task.projectId)}
                      </CardDescription>
                      <CardDescription className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {getClientName(task.projectId)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(task)}
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
                            <AlertDialogTitle>Delete Task</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{task.name}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteTask(task.id)}
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
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span className={overdue ? 'text-red-600 font-medium' : ''}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  {task.status !== 'done' && (
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

                  {task.notes && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <p className="line-clamp-2">{task.notes}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t text-xs text-gray-400">
                    Created {new Date(task.createdAt).toLocaleDateString()}
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
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Task Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter task name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-project">Project *</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) =>
                  setFormData({ ...formData, projectId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => {
                    const client = clients.find(
                      (c) => c.id === project.clientId
                    );
                    return (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name} {client && `(${client.name})`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-dueDate">Due Date *</Label>
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
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Task['priority']) =>
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
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Task['status']) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Task notes and details..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setEditingTask(null);
                setIsEditDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
