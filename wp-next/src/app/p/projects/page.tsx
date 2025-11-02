'use client';

import { useState } from 'react';

import { FolderOpen, Plus, Search, SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import EditProjectDialog from '@/components/p/edit-project-dialog';
import ProjectList from '@/components/p/project-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PORTAL_URL } from '@/constants/site';
import { Project } from '@/types/portal';
import { useQuery } from '@tanstack/react-query';

const initProject: Project = {
  id: '',
  name: '',
  description: '',
  clientId: '',
  client: '',
  startDate: '',
  deadline: '',
  endDate: '',
  budget: 0,
  progress: 0,
  priority: 'medium',
  status: 'planned',
  createdAt: '',
  updatedAt: '',
};

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Project>(initProject);
  const router = useRouter();

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/portal/project');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      return response.json();
    },
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await fetch('/api/portal/client');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      return response.json();
    },
  });

  const saveProjects = (updatedProjects: Project[]) => {
    console.log('Projects saved:', updatedProjects);
  };

  const resetForm = () => {
    setFormData(initProject);
  };

  const handleSaveProject = () => {
    if (
      !formData.name.trim() ||
      !formData.clientId ||
      !formData.startDate ||
      !formData.deadline
    ) {
      alert('Name, client, start date, and deadline are required!');
      return;
    }

    if (!editingProject) {
      const newProject: Project = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log('Adding new project:', newProject);
    } else {
      console.log('Updating project:', { ...editingProject, ...formData });
    }

    resetForm();
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(
      (project: Project) => project.id !== projectId
    );
    saveProjects(updatedProjects);
  };

  const handleEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      ...project,
      name: project.name,
      description: project.description,
      clientId: project.clientId,
      startDate: project.startDate,
      deadline: project.deadline,
      status: project.status,
    });
    setIsDialogOpen(true);
  };

  const onCancelEdit = () => {
    resetForm();
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600 mt-1">
            Manage your projects and track their progress
          </p>
        </div>
        <EditProjectDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          formData={formData}
          setFormData={setFormData}
          onSaveProject={handleSaveProject}
          onCancelEdit={onCancelEdit}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects by name, description, or client..."
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
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <Button className="px-3 py-1">
            <SearchIcon className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading projects...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading projects.</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {projects.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <FolderOpen className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all'
                    ? 'No projects found'
                    : 'No projects yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : clients.length === 0
                      ? 'Add some clients first, then create your first project'
                      : 'Get started by creating your first project'}
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <div className="flex gap-2 justify-center">
                    {clients.length === 0 ? (
                      <Button
                        onClick={() => router.push(`${PORTAL_URL}/clients`)}
                        variant="outline"
                      >
                        Add Clients First
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Your First Project
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <ProjectList
              projects={projects}
              clients={clients}
              openEditDialog={handleEditDialog}
              onDeleteProject={handleDeleteProject}
            />
          )}
        </>
      )}
    </main>
  );
}
