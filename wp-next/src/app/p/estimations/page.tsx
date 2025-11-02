'use client';

import { useEffect, useState } from 'react';

import {
  ArrowLeft,
  Calculator,
  DollarSign,
  Edit,
  FileDown,
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

interface EstimationItem {
  id: string;
  title: string;
  description: string;
  projectId: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Freelancer info - in a real app, this would be configurable
const FREELANCER_INFO = {
  name: 'Your Name',
  company: 'Your Company',
  email: 'your.email@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main Street, City, State 12345',
  website: 'www.yourwebsite.com',
};

export default function EstimationsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [estimations, setEstimations] = useState<EstimationItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEstimation, setEditingEstimation] =
    useState<EstimationItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    quantity: 1,
    unitPrice: 0,
  });
  const router = useRouter();

  const saveEstimations = (updatedEstimations: EstimationItem[]) => {
    console.log('Estimations saved:', updatedEstimations);
    setEstimations(updatedEstimations);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      projectId: '',
      quantity: 1,
      unitPrice: 0,
    });
  };

  const handleAddEstimation = () => {
    if (
      !formData.title.trim() ||
      !formData.projectId ||
      formData.quantity <= 0 ||
      formData.unitPrice < 0
    ) {
      alert('Please fill in all required fields with valid values!');
      return;
    }

    const newEstimation: EstimationItem = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedEstimations = [...estimations, newEstimation];
    saveEstimations(updatedEstimations);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditEstimation = () => {
    if (
      !formData.title.trim() ||
      !formData.projectId ||
      formData.quantity <= 0 ||
      formData.unitPrice < 0
    ) {
      alert('Please fill in all required fields with valid values!');
      return;
    }

    if (!editingEstimation) return;

    const updatedEstimations = estimations.map((estimation) =>
      estimation.id === editingEstimation.id
        ? {
            ...estimation,
            ...formData,
            updatedAt: new Date().toISOString(),
          }
        : estimation
    );

    saveEstimations(updatedEstimations);
    resetForm();
    setEditingEstimation(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteEstimation = (estimationId: string) => {
    const updatedEstimations = estimations.filter(
      (estimation) => estimation.id !== estimationId
    );
    saveEstimations(updatedEstimations);
  };

  const openEditDialog = (estimation: EstimationItem) => {
    setEditingEstimation(estimation);
    setFormData({
      title: estimation.title,
      description: estimation.description,
      projectId: estimation.projectId,
      quantity: estimation.quantity,
      unitPrice: estimation.unitPrice,
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

  const getClient = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;
    return clients.find((c) => c.id === project.clientId) || null;
  };

  const getProject = (projectId: string) => {
    return projects.find((p) => p.id === projectId) || null;
  };

  const filteredEstimations = estimations.filter((estimation) => {
    const matchesSearch =
      estimation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProjectName(estimation.projectId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getClientName(estimation.projectId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesProject =
      selectedProject === 'all' || estimation.projectId === selectedProject;

    return matchesSearch && matchesProject;
  });

  const getProjectTotal = (projectId: string) => {
    return estimations
      .filter((est) => est.projectId === projectId)
      .reduce((total, est) => total + est.quantity * est.unitPrice, 0);
  };

  const generatePDF = async (projectId: string) => {
    const project = getProject(projectId);
    const client = getClient(projectId);
    const projectEstimations = estimations.filter(
      (est) => est.projectId === projectId
    );

    if (!project || !client || projectEstimations.length === 0) {
      alert('Cannot generate PDF: Missing project, client, or estimation data');
      return;
    }

    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Colors
    const COLORS: {
      primary: [number, number, number];
      text: [number, number, number];
      lightGray: [number, number, number];
    } = {
      primary: [41, 128, 185],
      text: [44, 62, 80],
      lightGray: [236, 240, 241],
    };

    let y = 10;

    const addHeader = () => {
      doc.setFillColor(...COLORS.primary);
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('QUOTATION', 20, 25);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Quote #: ${Date.now().toString().slice(-6)}`, 150, 20);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 28);

      doc.setTextColor(...COLORS.text);
      y = 45;
    };

    const addContactSection = () => {
      // FROM
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('FROM:', 20, y);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      let fromY = y + 8;
      doc.text(FREELANCER_INFO.name, 20, fromY);
      if (FREELANCER_INFO.company)
        doc.text(FREELANCER_INFO.company, 20, (fromY += 5));
      doc.text(FREELANCER_INFO.email, 20, (fromY += 5));
      doc.text(FREELANCER_INFO.phone, 20, (fromY += 5));
      doc.text(FREELANCER_INFO.address, 20, (fromY += 5));

      // TO
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('TO:', 120, y);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      let toY = y + 8;
      doc.text(client.name, 120, toY);
      if (client.company) doc.text(client.company, 120, (toY += 5));
      doc.text(client.email, 120, (toY += 5));

      y = Math.max(fromY, toY) + 15;
    };

    const addProjectInfo = () => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('PROJECT:', 20, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(project.name, 20, (y += 8));

      if (project.description) {
        const desc = doc.splitTextToSize(project.description, 170);
        doc.text(desc, 20, (y += 5));
        y += desc.length * 5;
      }

      y += 10;
    };

    const addTable = () => {
      doc.setFillColor(...COLORS.lightGray);
      doc.rect(20, y, 170, 10, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Description', 25, y + 7);
      doc.text('Qty', 130, y + 7);
      doc.text('Unit Price', 145, y + 7);
      doc.text('Total', 170, y + 7);

      y += 15;
      let total = 0;

      doc.setFont('helvetica', 'normal');

      projectEstimations.forEach((item, i) => {
        const lineTotal = item.quantity * item.unitPrice;
        total += lineTotal;

        if (i % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(20, y - 5, 170, 10, 'F');
        }

        const title = doc.splitTextToSize(item.title, 100);
        doc.setTextColor(...COLORS.text);
        doc.text(title, 25, y);

        doc.text(`${item.quantity}`, 130, y);
        doc.text(`$${item.unitPrice.toFixed(2)}`, 145, y);
        doc.text(`$${lineTotal.toFixed(2)}`, 170, y);

        y += Math.max(10, title.length * 5);

        if (item.description) {
          doc.setFontSize(8);
          doc.setTextColor(128, 128, 128);
          const desc = doc.splitTextToSize(item.description, 100);
          doc.text(desc, 25, y);
          y += desc.length * 4;
          doc.setFontSize(10);
          doc.setTextColor(...COLORS.text);
        }

        y += 5;
      });

      return total;
    };

    const addTotal = (grandTotal: number) => {
      y += 10;
      doc.setFillColor(...COLORS.primary);
      doc.rect(130, y - 5, 60, 15, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('TOTAL:', 135, y + 3);
      doc.text(`$${grandTotal.toFixed(2)}`, 170, y + 3);

      y += 30;
    };

    const addFooter = () => {
      doc.setTextColor(...COLORS.text);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Thank you for your business!', 20, y);
      doc.text(
        'This quotation is valid for 30 days from the date above.',
        20,
        y + 8
      );
    };

    // Compose PDF
    addHeader();
    addContactSection();
    addProjectInfo();
    const total = addTable();
    addTotal(total);
    addFooter();

    const fileName = `Quotation_${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  // Group estimations by project
  const projectGroups = projects
    .map((project) => ({
      project,
      estimations: estimations.filter((est) => est.projectId === project.id),
      total: getProjectTotal(project.id),
    }))
    .filter((group) => group.estimations.length > 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Estimations</h2>
          <p className="text-gray-600 mt-1">
            Create and manage project estimations and generate quotations
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Estimation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Estimation</DialogTitle>
              <DialogDescription>
                Create a new estimation item for a project.
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
                  placeholder="Enter estimation title"
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
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: Number.parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unitPrice">Unit Price *</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unitPrice: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Detailed description of the estimation item..."
                  rows={3}
                />
              </div>
              {formData.quantity > 0 && formData.unitPrice > 0 && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Line Total:</span>
                    <span className="text-lg font-bold text-green-600">
                      ${(formData.quantity * formData.unitPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
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
              <Button onClick={handleAddEstimation}>Add Estimation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search estimations by title, description, project, or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => {
              const client = clients.find((c) => c.id === project.clientId);
              return (
                <SelectItem key={project.id} value={project.id}>
                  {project.name} {client && `(${client.name})`}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <Badge variant="secondary" className="px-3 py-1">
            {filteredEstimations.length}{' '}
            {filteredEstimations.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>
      </div>

      {/* Project Groups */}
      {projectGroups.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <Calculator className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No estimations yet
            </h3>
            <p className="text-gray-600 mb-4">
              {projects.length === 0
                ? 'Add some projects first, then create your first estimation'
                : 'Get started by creating your first estimation'}
            </p>
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
                  Add Your First Estimation
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {projectGroups.map((group) => {
            const client = clients.find((c) => c.id === group.project.clientId);
            const visibleEstimations = group.estimations
              .filter(
                (est) =>
                  selectedProject === 'all' || est.projectId === selectedProject
              )
              .filter(
                (est) =>
                  est.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  est.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  group.project.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  (client?.name || '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              );

            if (visibleEstimations.length === 0) return null;

            return (
              <Card key={group.project.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {group.project.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {client?.name || 'Unknown Client'}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Total: ${group.total.toFixed(2)}
                        </span>
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => generatePDF(group.project.id)}
                      className="flex items-center gap-2"
                      disabled={group.estimations.length === 0}
                    >
                      <FileDown className="h-4 w-4" />
                      Export Quotation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {visibleEstimations.map((estimation) => (
                      <div
                        key={estimation.id}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg mb-2">
                              {estimation.title}
                            </h4>
                            {estimation.description && (
                              <p className="text-gray-600 mb-3">
                                {estimation.description}
                              </p>
                            )}
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <span>Qty: {estimation.quantity}</span>
                              <span>
                                Unit Price: ${estimation.unitPrice.toFixed(2)}
                              </span>
                              <span className="font-medium text-green-600">
                                Total: $
                                {(
                                  estimation.quantity * estimation.unitPrice
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditDialog(estimation)}
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
                                  <AlertDialogTitle>
                                    Delete Estimation
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "
                                    {estimation.title}"? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteEstimation(estimation.id)
                                    }
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
                    ))}
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
            <DialogTitle>Edit Estimation</DialogTitle>
            <DialogDescription>
              Update estimation information.
            </DialogDescription>
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
                placeholder="Enter estimation title"
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
                <Label htmlFor="edit-quantity">Quantity *</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number.parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-unitPrice">Unit Price *</Label>
                <Input
                  id="edit-unitPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unitPrice: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Detailed description of the estimation item..."
                rows={3}
              />
            </div>
            {formData.quantity > 0 && formData.unitPrice > 0 && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Line Total:</span>
                  <span className="text-lg font-bold text-green-600">
                    ${(formData.quantity * formData.unitPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setEditingEstimation(null);
                setIsEditDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditEstimation}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
