'use client';

import { useEffect, useState } from 'react';

import {
  Calendar,
  CalendarDays,
  Clock,
  Edit2,
  Plus,
  Save,
  Target,
  Trash2,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plan } from '@/types/portal';
import { useQuery } from '@tanstack/react-query';

export default function PlanPage() {
  const [plans, setPlans] = useState<Plan[]>([]);

  const [planTitle, setPlanTitle] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planTimeframe, setPlanTimeframe] = useState<
    'tomorrow' | 'week' | 'month' | 'year'
  >('tomorrow');
  const [planPriority, setPlanPriority] = useState<'low' | 'medium' | 'high'>(
    'medium'
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTimeframe, setEditTimeframe] = useState<
    'tomorrow' | 'week' | 'month' | 'year'
  >('tomorrow');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>(
    'medium'
  );
  const [editStatus, setEditStatus] = useState<
    'pending' | 'in-progress' | 'completed'
  >('pending');

  const { data: planData } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await fetch('/api/portal/plan');
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (planData) {
      setPlans(planData);
    }
  }, [planData]);

  const handleAddPlan = () => {
    if (planTitle.trim() && planDescription.trim()) {
      const getTargetDate = (timeframe: string) => {
        const today = new Date();
        switch (timeframe) {
          case 'tomorrow':
            today.setDate(today.getDate() + 1);
            break;
          case 'week':
            today.setDate(today.getDate() + 7);
            break;
          case 'month':
            today.setMonth(today.getMonth() + 1);
            break;
          case 'year':
            today.setFullYear(today.getFullYear() + 1);
            break;
        }
        return today.toISOString().split('T')[0];
      };

      const newPlan: Plan = {
        id: Date.now().toString(),
        title: planTitle.trim(),
        description: planDescription.trim(),
        timeframe: planTimeframe,
        priority: planPriority,
        status: 'pending',
        createdDate: new Date().toISOString().split('T')[0],
        targetDate: getTargetDate(planTimeframe),
      };
      setPlans([newPlan, ...plans]);
      setPlanTitle('');
      setPlanDescription('');
      setPlanTimeframe('tomorrow');
      setPlanPriority('medium');
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingId(plan.id);
    setEditTitle(plan.title);
    setEditDescription(plan.description);
    setEditTimeframe(plan.timeframe);
    setEditPriority(plan.priority);
    setEditStatus(plan.status);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim() && editDescription.trim()) {
      setPlans(
        plans.map((plan) =>
          plan.id === editingId
            ? {
                ...plan,
                title: editTitle.trim(),
                description: editDescription.trim(),
                timeframe: editTimeframe,
                priority: editPriority,
                status: editStatus,
              }
            : plan
        )
      );
      setEditingId(null);
      setEditTitle('');
      setEditDescription('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleDelete = (id: string) => {
    setPlans(plans.filter((plan) => plan.id !== id));
  };

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'tomorrow':
        return <Clock className="w-4 h-4" />;
      case 'week':
        return <Calendar className="w-4 h-4" />;
      case 'month':
        return <CalendarDays className="w-4 h-4" />;
      case 'year':
        return <Target className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe) {
      case 'tomorrow':
        return 'bg-red-100 text-red-800';
      case 'week':
        return 'bg-orange-100 text-orange-800';
      case 'month':
        return 'bg-blue-100 text-blue-800';
      case 'year':
        return 'bg-purple-100 text-purple-800';
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const groupedPlans = {
    tomorrow: plans.filter((plan) => plan.timeframe === 'tomorrow'),
    week: plans.filter((plan) => plan.timeframe === 'week'),
    month: plans.filter((plan) => plan.timeframe === 'month'),
    year: plans.filter((plan) => plan.timeframe === 'year'),
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Plans</h1>
        <p className="text-gray-600">Set goals and track your progress</p>
      </div>

      {/* Add New Plan Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700 block">
              Title
            </label>
            <Input
              placeholder="What do you want to achieve?"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700 block">
                Timeframe
              </label>
              <Select
                value={planTimeframe}
                onValueChange={(value: any) => setPlanTimeframe(value)}
              >
                <SelectTrigger className="w-full md:w-60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="week">Next Week</SelectItem>
                  <SelectItem value="month">Next Month</SelectItem>
                  <SelectItem value="year">Next Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700 block">
                Priority
              </label>
              <Select
                value={planPriority}
                onValueChange={(value: any) => setPlanPriority(value)}
              >
                <SelectTrigger className="w-full md:w-60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700 block">
              Description
            </label>
            <Textarea
              placeholder="Describe your plan in detail..."
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
          <Button
            onClick={handleAddPlan}
            disabled={!planTitle.trim() || !planDescription.trim()}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Plan
          </Button>
        </CardContent>
      </Card>

      {/* Plans by Timeframe */}
      {Object.entries(groupedPlans).map(([timeframe, timeframePlans]) => (
        <div key={timeframe} className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            {getTimeframeIcon(timeframe)}
            {timeframe === 'tomorrow' && 'Tomorrow'}
            {timeframe === 'week' && 'Next Week'}
            {timeframe === 'month' && 'Next Month'}
            {timeframe === 'year' && 'Next Year'}
            <span className="text-sm text-gray-500">
              ({timeframePlans.length})
            </span>
          </h2>
          <div className="space-y-4">
            {timeframePlans.map((plan) => (
              <Card
                key={plan.id}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>
                        Target: {plan.targetDate && formatDate(plan.targetDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={getTimeframeColor(plan.timeframe)}
                      >
                        {plan.timeframe}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={getPriorityColor(plan.priority)}
                      >
                        {plan.priority}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(plan.status)}
                      >
                        {plan.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(plan)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(plan.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingId === plan.id ? (
                    <div className="space-y-4">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="font-semibold"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                          value={editTimeframe}
                          onValueChange={(value: any) =>
                            setEditTimeframe(value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tomorrow">Tomorrow</SelectItem>
                            <SelectItem value="week">Next Week</SelectItem>
                            <SelectItem value="month">Next Month</SelectItem>
                            <SelectItem value="year">Next Year</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={editPriority}
                          onValueChange={(value: any) => setEditPriority(value)}
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
                        <Select
                          value={editStatus}
                          onValueChange={(value: any) => setEditStatus(value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveEdit}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {plan.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {timeframePlans.length === 0 && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">
                    No plans for this timeframe yet
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ))}
    </main>
  );
}
