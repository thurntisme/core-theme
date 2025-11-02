'use client';

import { useEffect, useState } from 'react';

import {
  AlertCircle,
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Plus,
  Trash2,
  User,
  XCircle,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Estimation, Project, Task } from '@/types/portal';

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [estimations, setEstimations] = useState<Estimation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');

  // Dialog states
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isEstimationDialogOpen, setIsEstimationDialogOpen] = useState(false);

  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo' as const,
    priority: 'medium' as const,
    assignee: '',
    dueDate: '',
    estimatedHours: 0,
    tags: '',
  });

  const [estimationForm, setEstimationForm] = useState({
    title: '',
    description: '',
    status: 'draft' as const,
    validUntil: '',
    clientNotes: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
  });

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock project data
      const mockProject: Project = {
        id: projectId,
        name: 'E-commerce Website Redesign',
        description:
          "Complete redesign of the client's e-commerce platform with modern UI/UX, improved performance, and mobile responsiveness.",
        client: 'TechCorp Solutions',
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2024-04-15',
        budget: 25000,
        progress: 65,
        priority: 'high',
        tags: ['Web Development', 'UI/UX', 'E-commerce', 'React'],
      };

      // Mock tasks data
      const mockTasks: Task[] = [
        {
          id: '1',
          projectId,
          title: 'Design System Creation',
          description:
            'Create a comprehensive design system with components, colors, and typography',
          status: 'completed',
          priority: 'high',
          assignee: 'John Doe',
          dueDate: '2024-02-01',
          estimatedHours: 40,
          actualHours: 38,
          tags: ['Design', 'UI/UX'],
        },
        {
          id: '2',
          projectId,
          title: 'Frontend Development',
          description: 'Implement the new design using React and TypeScript',
          status: 'in-progress',
          priority: 'high',
          assignee: 'Jane Smith',
          dueDate: '2024-03-15',
          estimatedHours: 80,
          actualHours: 45,
          tags: ['Development', 'React', 'TypeScript'],
        },
        {
          id: '3',
          projectId,
          title: 'API Integration',
          description:
            'Integrate with existing backend APIs and implement new endpoints',
          status: 'todo',
          priority: 'medium',
          assignee: 'Mike Johnson',
          dueDate: '2024-03-30',
          estimatedHours: 32,
          actualHours: 0,
          tags: ['Backend', 'API'],
        },
        {
          id: '4',
          projectId,
          title: 'Testing & QA',
          description:
            'Comprehensive testing including unit tests, integration tests, and user acceptance testing',
          status: 'todo',
          priority: 'medium',
          assignee: 'Sarah Wilson',
          dueDate: '2024-04-10',
          estimatedHours: 24,
          actualHours: 0,
          tags: ['Testing', 'QA'],
        },
      ];

      // Mock estimations data
      const mockEstimations: Estimation[] = [
        {
          id: '1',
          projectId,
          title: 'Initial Project Estimation',
          description:
            'Complete project estimation including design, development, and testing phases',
          status: 'approved',
          totalAmount: 25000,
          items: [
            {
              description: 'UI/UX Design',
              quantity: 1,
              rate: 5000,
              amount: 5000,
            },
            {
              description: 'Frontend Development',
              quantity: 80,
              rate: 100,
              amount: 8000,
            },
            {
              description: 'Backend Integration',
              quantity: 32,
              rate: 120,
              amount: 3840,
            },
            {
              description: 'Testing & QA',
              quantity: 24,
              rate: 80,
              amount: 1920,
            },
            {
              description: 'Project Management',
              quantity: 1,
              rate: 6240,
              amount: 6240,
            },
          ],
          createdDate: '2024-01-10',
          validUntil: '2024-02-10',
          clientNotes: 'Approved with minor adjustments to timeline',
        },
        {
          id: '2',
          projectId,
          title: 'Additional Features Estimation',
          description: 'Estimation for additional features requested by client',
          status: 'sent',
          totalAmount: 8500,
          items: [
            {
              description: 'Advanced Search Functionality',
              quantity: 20,
              rate: 120,
              amount: 2400,
            },
            {
              description: 'User Analytics Dashboard',
              quantity: 30,
              rate: 110,
              amount: 3300,
            },
            {
              description: 'Mobile App Integration',
              quantity: 25,
              rate: 120,
              amount: 3000,
            },
          ],
          createdDate: '2024-02-15',
          validUntil: '2024-03-15',
          clientNotes: 'Pending client review',
        },
      ];

      setProject(mockProject);
      setTasks(mockTasks);
      setEstimations(mockEstimations);
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
      case 'active':
      case 'sent':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'todo':
      case 'draft':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'cancelled':
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
      case 'active':
      case 'sent':
        return 'bg-yellow-100 text-yellow-800';
      case 'todo':
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      projectId,
      title: taskForm.title,
      description: taskForm.description,
      status: taskForm.status,
      priority: taskForm.priority,
      assignee: taskForm.assignee,
      dueDate: taskForm.dueDate,
      estimatedHours: taskForm.estimatedHours,
      actualHours: 0,
      tags: taskForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    setTasks([...tasks, newTask]);
    setTaskForm({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      estimatedHours: 0,
      tags: '',
    });
    setIsTaskDialogOpen(false);
  };

  const handleAddEstimation = () => {
    const totalAmount = estimationForm.items.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const newEstimation: Estimation = {
      id: Date.now().toString(),
      projectId,
      title: estimationForm.title,
      description: estimationForm.description,
      status: estimationForm.status,
      totalAmount,
      items: estimationForm.items,
      createdDate: new Date().toISOString().split('T')[0],
      validUntil: estimationForm.validUntil,
      clientNotes: estimationForm.clientNotes,
    };

    setEstimations([...estimations, newEstimation]);
    setEstimationForm({
      title: '',
      description: '',
      status: 'draft',
      validUntil: '',
      clientNotes: '',
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    });
    setIsEstimationDialogOpen(false);
  };

  const updateEstimationItem = (index: number, field: string, value: any) => {
    const updatedItems = [...estimationForm.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount =
        updatedItems[index].quantity * updatedItems[index].rate;
    }

    setEstimationForm({ ...estimationForm, items: updatedItems });
  };

  const addEstimationItem = () => {
    setEstimationForm({
      ...estimationForm,
      items: [
        ...estimationForm.items,
        { description: '', quantity: 1, rate: 0, amount: 0 },
      ],
    });
  };

  const removeEstimationItem = (index: number) => {
    const updatedItems = estimationForm.items.filter((_, i) => i !== index);
    setEstimationForm({ ...estimationForm, items: updatedItems });
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const deleteEstimation = (estimationId: string) => {
    setEstimations(
      estimations.filter((estimation) => estimation.id !== estimationId)
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Project Not Found
          </h1>
          <Button onClick={() => router.push('/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push('/projects')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Button>
      <div className="flex items-center justify-between py-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-1">{project.description}</p>
        </div>
        <div className="flex items-center space-x-2 w-1/3 justify-end">
          <Badge className={getStatusColor(project.status)}>
            {getStatusIcon(project.status)}
            <span className="ml-1 capitalize">{project.status}</span>
          </Badge>
          <Badge className={getPriorityColor(project.priority)}>
            <span className="capitalize">{project.priority} Priority</span>
          </Badge>
        </div>
      </div>

      {/* Project Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <User className="mr-2 h-4 w-4" />
                Client
              </div>
              <p className="font-semibold">{project.client}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-2 h-4 w-4" />
                Timeline
              </div>
              <p className="font-semibold">
                {new Date(project.startDate).toLocaleDateString()} -{' '}
                {new Date(project.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="mr-2 h-4 w-4" />
                Budget
              </div>
              <p className="font-semibold">
                ${project.budget.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="mr-2 h-4 w-4" />
                Progress
              </div>
              <div className="space-y-1">
                <p className="font-semibold">{project.progress}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <FileText className="mr-2 h-4 w-4" />
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {project?.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="estimations">
            Estimations ({estimations.length})
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Project Tasks</h2>
            <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>
                    Create a new task for this project.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="task-title"
                      value={taskForm.title}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, title: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="task-description"
                      value={taskForm.description}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          description: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={taskForm.status}
                      onValueChange={(value: any) =>
                        setTaskForm({ ...taskForm, status: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-priority" className="text-right">
                      Priority
                    </Label>
                    <Select
                      value={taskForm.priority}
                      onValueChange={(value: any) =>
                        setTaskForm({ ...taskForm, priority: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-assignee" className="text-right">
                      Assignee
                    </Label>
                    <Input
                      id="task-assignee"
                      value={taskForm.assignee}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, assignee: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-due-date" className="text-right">
                      Due Date
                    </Label>
                    <Input
                      id="task-due-date"
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, dueDate: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-hours" className="text-right">
                      Estimated Hours
                    </Label>
                    <Input
                      id="task-hours"
                      type="number"
                      value={taskForm.estimatedHours}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          estimatedHours: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-tags" className="text-right">
                      Tags
                    </Label>
                    <Input
                      id="task-tags"
                      value={taskForm.tags}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, tags: e.target.value })
                      }
                      placeholder="Comma separated tags"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddTask}>
                    Add Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <Badge className={getStatusColor(task.status)}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1 capitalize">
                            {task.status.replace('-', ' ')}
                          </span>
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          <span className="capitalize">{task.priority}</span>
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Assignee:</span>
                          <p className="font-medium">{task.assignee}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Due Date:</span>
                          <p className="font-medium">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Estimated:</span>
                          <p className="font-medium">{task.estimatedHours}h</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Actual:</span>
                          <p className="font-medium">{task.actualHours}h</p>
                        </div>
                      </div>
                      {task.tags.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the task.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteTask(task.id)}
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
            ))}
          </div>
        </TabsContent>

        {/* Estimations Tab */}
        <TabsContent value="estimations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Project Estimations</h2>
            <Dialog
              open={isEstimationDialogOpen}
              onOpenChange={setIsEstimationDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Estimation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Estimation</DialogTitle>
                  <DialogDescription>
                    Create a new estimation for this project.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="estimation-title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="estimation-title"
                      value={estimationForm.title}
                      onChange={(e) =>
                        setEstimationForm({
                          ...estimationForm,
                          title: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="estimation-description"
                      className="text-right"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="estimation-description"
                      value={estimationForm.description}
                      onChange={(e) =>
                        setEstimationForm({
                          ...estimationForm,
                          description: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="estimation-status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={estimationForm.status}
                      onValueChange={(value: any) =>
                        setEstimationForm({ ...estimationForm, status: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="estimation-valid-until"
                      className="text-right"
                    >
                      Valid Until
                    </Label>
                    <Input
                      id="estimation-valid-until"
                      type="date"
                      value={estimationForm.validUntil}
                      onChange={(e) =>
                        setEstimationForm({
                          ...estimationForm,
                          validUntil: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="estimation-notes" className="text-right">
                      Client Notes
                    </Label>
                    <Textarea
                      id="estimation-notes"
                      value={estimationForm.clientNotes}
                      onChange={(e) =>
                        setEstimationForm({
                          ...estimationForm,
                          clientNotes: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="col-span-4">
                    <Label className="text-base font-semibold">
                      Estimation Items
                    </Label>
                    <div className="mt-2 space-y-2">
                      {estimationForm.items.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-2 items-center"
                        >
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) =>
                              updateEstimationItem(
                                index,
                                'description',
                                e.target.value
                              )
                            }
                            className="col-span-5"
                          />
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) =>
                              updateEstimationItem(
                                index,
                                'quantity',
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                            className="col-span-2"
                          />
                          <Input
                            type="number"
                            placeholder="Rate"
                            value={item.rate}
                            onChange={(e) =>
                              updateEstimationItem(
                                index,
                                'rate',
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                            className="col-span-2"
                          />
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={item.amount}
                            readOnly
                            className="col-span-2 bg-gray-50"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeEstimationItem(index)}
                            className="col-span-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addEstimationItem}
                        className="w-full bg-transparent"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </div>
                    <div className="mt-4 text-right">
                      <span className="text-lg font-semibold">
                        Total: $
                        {estimationForm.items
                          .reduce((sum, item) => sum + item.amount, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddEstimation}>
                    Add Estimation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {estimations.map((estimation) => (
              <Card key={estimation.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">
                          {estimation.title}
                        </h3>
                        <Badge className={getStatusColor(estimation.status)}>
                          {getStatusIcon(estimation.status)}
                          <span className="ml-1 capitalize">
                            {estimation.status}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">
                        {estimation.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Total Amount:</span>
                          <p className="font-medium text-lg">
                            ${estimation.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <p className="font-medium">
                            {new Date(
                              estimation.createdDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Valid Until:</span>
                          <p className="font-medium">
                            {new Date(
                              estimation.validUntil
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Items:</span>
                          <p className="font-medium">
                            {estimation.items.length}
                          </p>
                        </div>
                      </div>
                      {estimation.clientNotes && (
                        <div className="mb-4">
                          <span className="text-gray-500 text-sm">
                            Client Notes:
                          </span>
                          <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                            {estimation.clientNotes}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the estimation.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteEstimation(estimation.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Estimation Items Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <h4 className="font-medium">Estimation Breakdown</h4>
                    </div>
                    <div className="divide-y">
                      {estimation.items.map((item, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 grid grid-cols-4 gap-4 text-sm"
                        >
                          <div className="col-span-2">
                            <span className="font-medium">
                              {item.description}
                            </span>
                          </div>
                          <div className="text-center">
                            {item.quantity} × ${item.rate}
                          </div>
                          <div className="text-right font-medium">
                            ${item.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
