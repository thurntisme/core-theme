'use client';

import { useState } from 'react';

import jsPDF from 'jspdf';
import {
  Code,
  Download,
  Eye,
  FolderOpen,
  GraduationCap,
  Plus,
  User,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
}

interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

interface ResumeData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  education: Education[];
  projects: Project[];
  skills: SkillCategory[];
}

export default function ResumeGenerator() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
    education: [],
    projects: [],
    skills: [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [newTechStack, setNewTechStack] = useState('');

  const updateField = (field: keyof ResumeData, value: any) => {
    setResumeData((prev) => ({ ...prev, [field]: value }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      techStack: [],
    };
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== id),
    }));
  };

  const addTechToProject = (projectId: string, tech: string) => {
    if (!tech.trim()) return;
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === projectId
          ? { ...project, techStack: [...project.techStack, tech.trim()] }
          : project
      ),
    }));
  };

  const removeTechFromProject = (projectId: string, techIndex: number) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              techStack: project.techStack.filter(
                (_, index) => index !== techIndex
              ),
            }
          : project
      ),
    }));
  };

  const addSkillCategory = () => {
    const newCategory: SkillCategory = {
      id: Date.now().toString(),
      category: '',
      skills: [],
    };
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, newCategory],
    }));
  };

  const updateSkillCategory = (id: string, category: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.id === id ? { ...skill, category } : skill
      ),
    }));
  };

  const addSkillToCategory = (categoryId: string, skill: string) => {
    if (!skill.trim()) return;
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((skillCat) =>
        skillCat.id === categoryId
          ? { ...skillCat, skills: [...skillCat.skills, skill.trim()] }
          : skillCat
      ),
    }));
  };

  const removeSkillFromCategory = (categoryId: string, skillIndex: number) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((skillCat) =>
        skillCat.id === categoryId
          ? {
              ...skillCat,
              skills: skillCat.skills.filter(
                (_, index) => index !== skillIndex
              ),
            }
          : skillCat
      ),
    }));
  };

  const removeSkillCategory = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }));
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Helper function to add text with word wrapping
    const addText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      fontSize = 10
    ) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + lines.length * fontSize * 0.4;
    };

    // Header
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(resumeData.fullName, 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(resumeData.jobTitle, 20, yPosition);
    yPosition += 15;

    // Contact Info
    pdf.setFontSize(10);
    const contactInfo = [
      resumeData.email,
      resumeData.phone,
      resumeData.location,
      resumeData.website,
      resumeData.linkedin,
      resumeData.github,
    ]
      .filter(Boolean)
      .join(' | ');

    yPosition = addText(contactInfo, 20, yPosition, pageWidth - 40);
    yPosition += 10;

    // Summary
    if (resumeData.summary) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Professional Summary', 20, yPosition);
      yPosition += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPosition = addText(resumeData.summary, 20, yPosition, pageWidth - 40);
      yPosition += 10;
    }

    // Education
    if (resumeData.education.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Education', 20, yPosition);
      yPosition += 8;

      resumeData.education.forEach((edu) => {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${edu.degree} in ${edu.field}`, 20, yPosition);
        yPosition += 6;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(
          `${edu.school} | ${edu.startDate} - ${edu.endDate}`,
          20,
          yPosition
        );
        yPosition += 6;

        if (edu.description) {
          yPosition = addText(edu.description, 20, yPosition, pageWidth - 40);
        }
        yPosition += 5;
      });
      yPosition += 5;
    }

    // Projects
    if (resumeData.projects.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Projects', 20, yPosition);
      yPosition += 8;

      resumeData.projects.forEach((project) => {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(project.title, 20, yPosition);
        yPosition += 6;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        yPosition = addText(project.description, 20, yPosition, pageWidth - 40);
        yPosition += 3;

        if (project.techStack.length > 0) {
          pdf.text(
            `Tech Stack: ${project.techStack.join(', ')}`,
            20,
            yPosition
          );
          yPosition += 6;
        }
        yPosition += 3;
      });
      yPosition += 5;
    }

    // Skills
    if (resumeData.skills.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Skills', 20, yPosition);
      yPosition += 8;

      resumeData.skills.forEach((skillCat) => {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${skillCat.category}:`, 20, yPosition);

        pdf.setFont('helvetica', 'normal');
        pdf.text(
          skillCat.skills.join(', '),
          20 + pdf.getTextWidth(`${skillCat.category}: `),
          yPosition
        );
        yPosition += 6;
      });
    }

    pdf.save(`${resumeData.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
  };

  const ResumePreview = () => (
    <div className="max-h-[80vh] overflow-y-auto p-1">
      <div className="space-y-6 min-h-[800px] bg-white rounded-lg text-sm shadow-lg px-6 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {resumeData.fullName || 'Your Name'}
          </h1>
          <h2 className="text-xl text-gray-700 mb-4">
            {resumeData.jobTitle || 'Your Job Title'}
          </h2>
          <div className="text-gray-600 space-y-1">
            {resumeData.email && <div>{resumeData.email}</div>}
            {resumeData.phone && <div>{resumeData.phone}</div>}
            {resumeData.location && <div>{resumeData.location}</div>}
            {resumeData.website && <div>{resumeData.website}</div>}
            {resumeData.linkedin && <div>{resumeData.linkedin}</div>}
            {resumeData.github && <div>{resumeData.github}</div>}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">
              Professional Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {resumeData.summary}
            </p>
          </div>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Education
            </h3>
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h4>
                  <span className="text-gray-600 text-sm">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="text-gray-700 mb-1">{edu.school}</div>
                {edu.description && (
                  <p className="text-gray-600 text-sm">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {resumeData.projects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Projects
            </h3>
            {resumeData.projects.map((project) => (
              <div key={project.id} className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {project.title}
                </h4>
                <p className="text-gray-700 mb-2 leading-relaxed">
                  {project.description}
                </p>
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className="text-gray-600 text-sm font-medium">
                      Tech Stack:
                    </span>
                    {project.techStack.map((tech, index) => (
                      <span key={index} className="text-gray-600 text-sm">
                        {tech}
                        {index < project.techStack.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Skills
            </h3>
            {resumeData.skills.map((skillCat) => (
              <div key={skillCat.id} className="mb-2">
                <span className="font-semibold text-gray-900">
                  {skillCat.category}:
                </span>
                <span className="text-gray-700 ml-2">
                  {skillCat.skills.join(', ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-6">
        <Button
          onClick={generatePDF}
          size="sm"
          className="flex items-center gap-2 mx-auto"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resume Generator
          </h1>
          <p className="text-gray-600">
            Create your professional resume with ease
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview Resume
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    Resume Preview
                  </DialogTitle>
                </DialogHeader>
                <ResumePreview />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Skills
            </TabsTrigger>
          </TabsList>

          {/* General Information Tab */}
          <TabsContent value="general" className="space-y-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={resumeData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={resumeData.jobTitle}
                  onChange={(e) => updateField('jobTitle', e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={resumeData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={resumeData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="New York, NY"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={resumeData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="https://johndoe.com"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={resumeData.linkedin}
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={resumeData.github}
                  onChange={(e) => updateField('github', e.target.value)}
                  placeholder="github.com/johndoe"
                />
              </div>
              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={resumeData.summary}
                  onChange={(e) => updateField('summary', e.target.value)}
                  placeholder="Brief professional summary highlighting your key skills and experience..."
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Education
                </h3>
                <Button
                  onClick={addEducation}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Education
                </Button>
              </div>

              {resumeData.education.map((edu) => (
                <div key={edu.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Education Entry</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <Label>School/University</Label>
                    <Input
                      value={edu.school}
                      onChange={(e) =>
                        updateEducation(edu.id, 'school', e.target.value)
                      }
                      placeholder="University of Example"
                    />
                  </div>
                  <div>
                    <Label>Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, 'degree', e.target.value)
                      }
                      placeholder="Bachelor of Science"
                    />
                  </div>
                  <div>
                    <Label>Field of Study</Label>
                    <Input
                      value={edu.field}
                      onChange={(e) =>
                        updateEducation(edu.id, 'field', e.target.value)
                      }
                      placeholder="Computer Science"
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      value={edu.startDate}
                      onChange={(e) =>
                        updateEducation(edu.id, 'startDate', e.target.value)
                      }
                      placeholder="2018"
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      value={edu.endDate}
                      onChange={(e) =>
                        updateEducation(edu.id, 'endDate', e.target.value)
                      }
                      placeholder="2022 or Present"
                    />
                  </div>
                  <div>
                    <Label>Description/Achievements</Label>
                    <Textarea
                      value={edu.description}
                      onChange={(e) =>
                        updateEducation(edu.id, 'description', e.target.value)
                      }
                      placeholder="Relevant coursework, achievements, GPA, etc."
                      rows={2}
                    />
                  </div>
                </div>
              ))}

              {resumeData.education.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    No education entries yet. Click "Add Education" to get
                    started.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Projects
                </h3>
                <Button
                  onClick={addProject}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Project
                </Button>
              </div>

              {resumeData.projects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Project Entry</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(project.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <Label>Project Title</Label>
                    <Input
                      value={project.title}
                      onChange={(e) =>
                        updateProject(project.id, 'title', e.target.value)
                      }
                      placeholder="E-commerce Platform"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) =>
                        updateProject(project.id, 'description', e.target.value)
                      }
                      placeholder="Describe what the project does and your role in it..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Tech Stack</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTechStack}
                        onChange={(e) => setNewTechStack(e.target.value)}
                        placeholder="Add technology (e.g., React, Node.js)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTechToProject(project.id, newTechStack);
                            setNewTechStack('');
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          addTechToProject(project.id, newTechStack);
                          setNewTechStack('');
                        }}
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tech}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() =>
                              removeTechFromProject(project.id, index)
                            }
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {resumeData.projects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    No projects yet. Click "Add Project" to showcase your work.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                <Button
                  onClick={addSkillCategory}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Skill Category
                </Button>
              </div>

              {resumeData.skills.map((skillCat) => (
                <div
                  key={skillCat.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Skill Category</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkillCategory(skillCat.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <Label>Category Name</Label>
                    <Input
                      value={skillCat.category}
                      onChange={(e) =>
                        updateSkillCategory(skillCat.id, e.target.value)
                      }
                      placeholder="Frontend, Backend, Tools, etc."
                    />
                  </div>

                  <div>
                    <Label>Skills</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add skill"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSkillToCategory(skillCat.id, newSkill);
                            setNewSkill('');
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          addSkillToCategory(skillCat.id, newSkill);
                          setNewSkill('');
                        }}
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillCat.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {skill}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() =>
                              removeSkillFromCategory(skillCat.id, index)
                            }
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {resumeData.skills.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    No skills added yet. Click "Add Skill Category" to organize
                    your expertise.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
