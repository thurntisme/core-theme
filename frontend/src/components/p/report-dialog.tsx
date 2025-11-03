'use client';

import { useEffect, useState } from 'react';

import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DailyReport, Reporter } from '@/types/portal';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: DailyReport | null;
  onSave: (report: DailyReport) => void;
  employee: Reporter; // Added employee prop to get global employee info
}

interface TaskItem {
  task: string;
  note: string;
}

interface ProgressItem {
  task: string;
  progress: string;
}

interface BlockerItem {
  task: string;
  issue: string;
}

interface PlanItem {
  task: string;
  description: string;
}

export function ReportDialog({
  open,
  onOpenChange,
  report,
  onSave,
  employee,
}: ReportDialogProps) {
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    project: '',
  });

  const [completedTasks, setCompletedTasks] = useState<TaskItem[]>([
    { task: '', note: '' },
  ]);
  const [inProgressTasks, setInProgressTasks] = useState<ProgressItem[]>([
    { task: '', progress: '' },
  ]);
  const [blockers, setBlockers] = useState<BlockerItem[]>([
    { task: '', issue: '' },
  ]);
  const [nextPlan, setNextPlan] = useState<PlanItem[]>([
    { task: '', description: '' },
  ]);

  useEffect(() => {
    if (report) {
      setFormData({
        date: report.date,
        name: report.name,
        project: report.project,
      });
      setCompletedTasks(
        report.completedTasks.length > 0
          ? report.completedTasks
          : [{ task: '', note: '' }]
      );
      setInProgressTasks(
        report.inProgressTasks.length > 0
          ? report.inProgressTasks
          : [{ task: '', progress: '' }]
      );
      setBlockers(
        report.blockers.length > 0 ? report.blockers : [{ task: '', issue: '' }]
      );
      setNextPlan(
        report.nextPlan.length > 0
          ? report.nextPlan
          : [{ task: '', description: '' }]
      );
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        date: today,
        name: employee.name || '',
        project: '',
      });
      setCompletedTasks([{ task: '', note: '' }]);
      setInProgressTasks([{ task: '', progress: '' }]);
      setBlockers([{ task: '', issue: '' }]);
      setNextPlan([{ task: '', description: '' }]);
    }
  }, [report, open, employee]);

  const handleSave = () => {
    const reportData: DailyReport = {
      id: report?.id || '',
      ...formData,
      completedTasks: completedTasks.filter((item) => item.task.trim() !== ''),
      inProgressTasks: inProgressTasks.filter(
        (item) => item.task.trim() !== ''
      ),
      blockers: blockers.filter((item) => item.task.trim() !== ''),
      nextPlan: nextPlan.filter((item) => item.task.trim() !== ''),
    };
    onSave(reportData);
  };

  const addItem = <T extends Record<string, string>>(
    items: T[],
    setItems: (items: T[]) => void,
    template: T
  ) => {
    setItems([...items, template]);
  };

  const removeItem = <T,>(
    items: T[],
    setItems: (items: T[]) => void,
    index: number
  ) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = <T extends Record<string, string>>(
    items: any[],
    setItems: (items: any[]) => void,
    index: number,
    field: keyof T,
    value: string
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {report ? 'Edit Report' : 'New Daily Report'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="gap-y-2 flex flex-col">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="gap-y-2 flex flex-col">
              <Label htmlFor="name">Reporter</Label>
              <Input
                id="name"
                value={formData.name}
                readOnly
                placeholder="Your Name"
              />
            </div>
            <div className="gap-y-2 flex flex-col">
              <Label htmlFor="project">Project</Label>
              <Input
                id="project"
                value={formData.project}
                readOnly
                placeholder="Project Name"
              />
            </div>
          </div>

          {/* Completed Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Completed Tasks</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 border-t pt-3">
              <div className="flex gap-2">
                <div className="flex-1 font-medium">Task</div>
                <div className="flex-1 font-medium">Note (optional)</div>
                <div className="w-8">{/* For delete button alignment */}</div>
              </div>
              {completedTasks.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Task description"
                      value={item.task}
                      onChange={(e) =>
                        updateItem(
                          completedTasks,
                          setCompletedTasks,
                          index,
                          'task',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Short note (optional)"
                      value={item.note}
                      onChange={(e) =>
                        updateItem(
                          completedTasks,
                          setCompletedTasks,
                          index,
                          'note',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      removeItem(completedTasks, setCompletedTasks, index)
                    }
                    disabled={completedTasks.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addItem(completedTasks, setCompletedTasks, {
                    task: '',
                    note: '',
                  })
                }
              >
                <Plus className="w-4 h-4" /> Add New Task
              </Button>
            </CardContent>
          </Card>

          {/* In Progress Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">In Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 border-t pt-3">
              <div className="flex gap-2">
                <div className="flex-1 font-medium">Task</div>
                <div className="flex-1 font-medium">% Done or ETA</div>
                <div className="w-8">{/* For delete button alignment */}</div>
              </div>
              {inProgressTasks.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Task description"
                      value={item.task}
                      onChange={(e) =>
                        updateItem(
                          inProgressTasks,
                          setInProgressTasks,
                          index,
                          'task',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="% done or ETA"
                      value={item.progress}
                      onChange={(e) =>
                        updateItem(
                          inProgressTasks,
                          setInProgressTasks,
                          index,
                          'progress',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      removeItem(inProgressTasks, setInProgressTasks, index)
                    }
                    disabled={inProgressTasks.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addItem(inProgressTasks, setInProgressTasks, {
                    task: '',
                    progress: '',
                  })
                }
              >
                <Plus className="w-4 h-4" /> Add New Task
              </Button>
            </CardContent>
          </Card>

          {/* Blockers */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Blockers / Issues</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 border-t pt-3">
              <div className="flex gap-2">
                <div className="flex-1 font-medium">Task</div>
                <div className="flex-1 font-medium">Issue (optional)</div>
                <div className="w-8">{/* For delete button alignment */}</div>
              </div>
              {blockers.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Task description"
                      value={item.task}
                      onChange={(e) =>
                        updateItem(
                          blockers,
                          setBlockers,
                          index,
                          'task',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Issue description"
                      value={item.issue}
                      onChange={(e) =>
                        updateItem(
                          blockers,
                          setBlockers,
                          index,
                          'issue',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(blockers, setBlockers, index)}
                    disabled={blockers.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addItem(blockers, setBlockers, { task: '', issue: '' })
                }
              >
                <Plus className="w-4 h-4" /> Add New Task
              </Button>
            </CardContent>
          </Card>

          {/* Next Plan */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Next Plan (Tomorrow)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 border-t pt-3">
              <div className="flex gap-2">
                <div className="flex-1 font-medium">Task</div>
                <div className="flex-1 font-medium">Additional details</div>
                <div className="w-8">{/* For delete button alignment */}</div>
              </div>
              {nextPlan.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Task description"
                      value={item.task}
                      onChange={(e) =>
                        updateItem(
                          nextPlan,
                          setNextPlan,
                          index,
                          'task',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Additional details"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(
                          nextPlan,
                          setNextPlan,
                          index,
                          'description',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(nextPlan, setNextPlan, index)}
                    disabled={nextPlan.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addItem(nextPlan, setNextPlan, {
                    task: '',
                    description: '',
                  })
                }
              >
                <Plus className="w-4 h-4" /> Add New Task
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {report ? 'Update Report' : 'Save Report'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
