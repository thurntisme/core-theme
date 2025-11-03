'use client';

import type React from 'react';
import { useState } from 'react';

import { Edit, Eye, Plus, Trash2 } from 'lucide-react';

import { ReportDialog } from '@/components/p/report-dialog';
import { ReportPreview } from '@/components/p/report-preview';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DailyReport } from '@/types/portal';

export interface Employee {
  name: string;
  email: string;
  department: string;
  position: string;
}

export default function ProjectReportingApp() {
  const [reports, setReports] = useState<DailyReport[]>([
    {
      id: '1',
      date: '2024-01-15',
      name: 'John Doe',
      project: 'Website Redesign',
      completedTasks: [
        {
          task: 'Homepage mockup',
          note: 'Completed design and got approval from client',
        },
        { task: 'User research', note: 'Conducted 5 user interviews' },
      ],
      inProgressTasks: [
        {
          task: 'Component library',
          progress: '70% - Expected completion tomorrow',
        },
      ],
      blockers: [
        {
          task: 'API integration',
          issue: 'Waiting for backend team to provide endpoints',
        },
      ],
      nextPlan: [
        {
          task: 'Finish component library',
          description: 'Complete remaining UI components',
        },
        {
          task: 'Start responsive design',
          description: 'Begin mobile optimization',
        },
      ],
    },
  ]);

  const [employee, setEmployee] = useState<Employee>({
    name: '',
    email: '',
    department: '',
    position: '',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<DailyReport | null>(null);
  const [previewingReport, setPreviewingReport] = useState<DailyReport | null>(
    null
  );

  const handleAddReport = () => {
    setEditingReport(null);
    setDialogOpen(true);
  };

  const handleEditReport = (report: DailyReport) => {
    setEditingReport(report);
    setDialogOpen(true);
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter((report) => report.id !== id));
  };

  const handlePreviewReport = (report: DailyReport) => {
    setPreviewingReport(report);
    setPreviewOpen(true);
  };

  const handleSaveReport = (report: DailyReport) => {
    if (editingReport) {
      setReports(reports.map((r) => (r.id === report.id ? report : r)));
    } else {
      const newReport = { ...report, id: Date.now().toString() };
      setReports([newReport, ...reports]);
    }
    setDialogOpen(false);
    setEditingReport(null);
  };

  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employee.name && employee.email) {
      console.log('Employee information saved:', employee);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Project Reports
          </h1>
          <p className="text-muted-foreground mt-2">
            Track daily progress and manage project updates
          </p>
        </div>
        <Button onClick={handleAddReport}>
          <Plus className="w-4 h-4 mr-2" />
          New Report
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Employee Information</h2>
          <form onSubmit={handleEmployeeSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="emp-name">Name</Label>
                <Input
                  id="emp-name"
                  value={employee.name}
                  onChange={(e) =>
                    setEmployee({ ...employee, name: e.target.value })
                  }
                  placeholder="Employee Name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="emp-email">Email</Label>
                <Input
                  id="emp-email"
                  type="email"
                  value={employee.email}
                  onChange={(e) =>
                    setEmployee({ ...employee, email: e.target.value })
                  }
                  placeholder="employee@company.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="emp-department">Department</Label>
                <Input
                  id="emp-department"
                  value={employee.department}
                  onChange={(e) =>
                    setEmployee({ ...employee, department: e.target.value })
                  }
                  placeholder="Engineering"
                />
              </div>
              <div>
                <Label htmlFor="emp-position">Position</Label>
                <Input
                  id="emp-position"
                  value={employee.position}
                  onChange={(e) =>
                    setEmployee({ ...employee, position: e.target.value })
                  }
                  placeholder="Software Developer"
                />
              </div>
            </div>
            <Button type="submit">Save Employee Info</Button>
          </form>

          {employee.name && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Current Employee</h3>
              <div className="p-3 bg-muted rounded-lg">
                <span className="font-medium">{employee.name}</span>
                <span className="text-muted-foreground ml-2">
                  ({employee.email})
                </span>
                {employee.department && (
                  <span className="text-sm text-muted-foreground ml-2">
                    {employee.department} - {employee.position}
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Daily Reports</h2>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">No reports yet</p>
              <p className="text-sm">
                Create your first daily report to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Employee</th>
                  <th className="p-4 font-medium">Project</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 text-sm">{report.date}</td>
                    <td className="p-4 text-sm font-medium">{report.name}</td>
                    <td className="p-4 text-sm">{report.project}</td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreviewReport(report)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditReport(report)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReport(report.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ReportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        report={editingReport}
        onSave={handleSaveReport}
        employee={employee}
      />

      <ReportPreview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        report={previewingReport}
      />
    </main>
  );
}
