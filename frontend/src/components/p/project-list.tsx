import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import ConfirmDeleteBtn from '../ui/confirm-delete-btn';

import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Edit,
  Eye,
  PlayCircle,
  User,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PORTAL_URL } from '@/constants/site';
import { Project } from '@/types/portal';

type Props = {
  projects: Project[];
  clients: { id: string; name: string; company?: string }[];
  openEditDialog: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
};

const statusConfig = {
  planned: {
    label: 'Planned',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    icon: Circle,
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    icon: PlayCircle,
  },
  done: {
    label: 'Done',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    icon: CheckCircle,
  },
};

const ProjectList = ({
  projects,
  clients,
  openEditDialog,
  onDeleteProject,
}: Props) => {
  const navigate = useNavigate();

  const isOverdue = (deadline: string, status: Project['status']) => {
    if (status === 'done') return false;
    return new Date(deadline) < new Date();
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getClientCompany = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.company || '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project: Project) => {
        const status = statusConfig[project.status];
        const StatusIcon = status.icon;
        const overdue = isOverdue(project.deadline, project.status);
        const daysUntilDeadline = getDaysUntilDeadline(project.deadline);

        return (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className={`${status.bgColor} ${status.textColor} border-0`}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                    {overdue && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Overdue
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {getClientName(project.clientId)}
                    {getClientCompany(project.clientId) && (
                      <span className="text-gray-400">
                        ({getClientCompany(project.clientId)})
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      navigate(`${PORTAL_URL}/projects/${project.id}`)
                    }
                    title="View project details"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(project)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <ConfirmDeleteBtn
                    title="Delete Project"
                    message={`Are you sure you want to delete "${project.name}
                          "? This action cannot be undone.`}
                    action={() => onDeleteProject(project.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Start: {new Date(project.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span className={overdue ? 'text-red-600 font-medium' : ''}>
                    Due: {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
                {project.status !== 'done' && (
                  <div className="text-xs">
                    {daysUntilDeadline > 0 ? (
                      <span className="text-gray-500">
                        {daysUntilDeadline} days remaining
                      </span>
                    ) : daysUntilDeadline === 0 ? (
                      <span className="text-orange-600 font-medium">
                        Due today
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        {Math.abs(daysUntilDeadline)} days overdue
                      </span>
                    )}
                  </div>
                )}
              </div>

              {project.createdAt && (
                <div className="pt-2 border-t text-xs text-gray-400">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProjectList;
