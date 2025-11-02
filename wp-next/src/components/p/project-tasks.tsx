import { AlertDialogFooter, AlertDialogHeader } from '../ui/alert-dialog';
import { Card, CardContent } from '../ui/card';
import { Textarea } from '../ui/textarea';

import React from 'react';

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Plus,
  Trash2,
  XCircle,
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Task } from '@/types/portal';

type Props = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  taskForm: Task;
  setTaskForm: React.Dispatch<React.SetStateAction<Task>>;
};

const ProjectTasks = ({
  isDialogOpen,
  setIsDialogOpen,
  taskForm,
  setTaskForm,
}: Props) => {
  const tasks: Task[] = [];
  const handleAddTask = () => {
    // Logic to add task goes here
    setIsDialogOpen(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const deleteTask = (taskId: string) => {
    // Logic to delete task goes here
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Project Tasks</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                    setTaskForm({ ...taskForm, tags: [e.target.value] })
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
                          This action cannot be undone. This will permanently
                          delete the task.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteTask(task.id)}>
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
    </>
  );
};

export default ProjectTasks;
