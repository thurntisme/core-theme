'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

import {
  ArrowLeft,
  Book,
  BookOpen,
  Clock,
  Code,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Plus,
  Search,
  Star,
  StarOff,
  Tag,
  Trash2,
  Video,
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
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

interface QuickLink {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  estimatedReadTime: number;
  tags: string[];
  notes: string;
  isRead: boolean;
  isFavorite: boolean;
  createdAt: string;
  readAt?: string;
}

const categories = [
  { value: 'blog', label: 'Blog Post', icon: BookOpen },
  { value: 'article', label: 'Article', icon: FileText },
  { value: 'tutorial', label: 'Tutorial', icon: Code },
  { value: 'documentation', label: 'Documentation', icon: Book },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'resource', label: 'Resource', icon: Globe },
  { value: 'other', label: 'Other', icon: FileText },
];

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
];

// Points system helper
const addPoints = (action: string, points: number) => {
  const today = new Date().toISOString().split('T')[0];

  // Add to activity log
  const activities = [];
  activities.push({
    id: Date.now().toString(),
    action,
    points,
    date: today,
    timestamp: new Date().toISOString(),
  });

  // Update daily activity count
  const dailyActivity = [];
  // dailyActivity[today] = (dailyActivity[today] || 0) + 1;
};

export default function QuickLinksPage() {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<QuickLink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: 'article',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedReadTime: 5,
    tags: '',
    notes: '',
  });

  useEffect(() => {
    // Check authentication
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('auth-session=')
    );

    if (!authCookie || !authCookie.includes('authenticated')) {
      router.push('/login');
      return;
    }

    // const savedLinks: any[] = [];
    // if (savedLinks) {
    //   const parsedLinks = JSON.parse(savedLinks);
    //   setLinks(parsedLinks);
    //   setFilteredLinks(parsedLinks);
    // }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    // Filter and sort links
    const filtered = links.filter((link) => {
      const matchesSearch =
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        categoryFilter === 'all' || link.category === categoryFilter;
      const matchesPriority =
        priorityFilter === 'all' || link.priority === priorityFilter;

      let matchesStatus = true;
      if (statusFilter === 'unread') matchesStatus = !link.isRead;
      else if (statusFilter === 'read') matchesStatus = link.isRead;
      else if (statusFilter === 'favorites') matchesStatus = link.isFavorite;

      return (
        matchesSearch && matchesCategory && matchesPriority && matchesStatus
      );
    });

    // Sort: favorites first, then unread, then by priority, then by date
    filtered.sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) return b.isFavorite ? 1 : -1;
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;

      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (a.priority !== b.priority)
        return priorityOrder[b.priority] - priorityOrder[a.priority];

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredLinks(filtered);
  }, [links, searchTerm, categoryFilter, priorityFilter, statusFilter]);

  const saveLinks = (newLinks: QuickLink[]) => {
    setLinks(newLinks);
    console.log('Links saved:', newLinks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate URL
    let url = formData.url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const newLink: QuickLink = {
      id: editingLink?.id || Date.now().toString(),
      title: formData.title.trim(),
      url,
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
      estimatedReadTime: formData.estimatedReadTime,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes: formData.notes.trim(),
      isRead: editingLink?.isRead || false,
      isFavorite: editingLink?.isFavorite || false,
      createdAt: editingLink?.createdAt || new Date().toISOString(),
      readAt: editingLink?.readAt,
    };

    if (editingLink) {
      const updatedLinks = links.map((link) =>
        link.id === editingLink.id ? newLink : link
      );
      saveLinks(updatedLinks);
      addPoints('Updated quick link', 2);
    } else {
      saveLinks([...links, newLink]);
      addPoints('Added quick link', 5);
    }

    // Reset form
    setFormData({
      title: '',
      url: '',
      description: '',
      category: 'article',
      priority: 'medium',
      estimatedReadTime: 5,
      tags: '',
      notes: '',
    });
    setIsAddDialogOpen(false);
    setEditingLink(null);
  };

  const toggleRead = (id: string) => {
    const updatedLinks = links.map((link) => {
      if (link.id === id) {
        const isNowRead = !link.isRead;
        if (isNowRead && !link.isRead) {
          addPoints('Read article', 3);
        }
        return {
          ...link,
          isRead: isNowRead,
          readAt: isNowRead ? new Date().toISOString() : undefined,
        };
      }
      return link;
    });
    saveLinks(updatedLinks);
  };

  const toggleFavorite = (id: string) => {
    const updatedLinks = links.map((link) => {
      if (link.id === id) {
        const isNowFavorite = !link.isFavorite;
        if (isNowFavorite) {
          addPoints('Favorited link', 1);
        }
        return { ...link, isFavorite: isNowFavorite };
      }
      return link;
    });
    saveLinks(updatedLinks);
  };

  const deleteLink = (id: string) => {
    const updatedLinks = links.filter((link) => link.id !== id);
    saveLinks(updatedLinks);
  };

  const editLink = (link: QuickLink) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description,
      category: link.category,
      priority: link.priority,
      estimatedReadTime: link.estimatedReadTime,
      tags: link.tags.join(', '),
      notes: link.notes,
    });
    setIsAddDialogOpen(true);
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find((cat) => cat.value === category);
    return categoryData ? categoryData.icon : FileText;
  };

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return null;
    }
  };

  const stats = {
    total: links.length,
    unread: links.filter((link) => !link.isRead).length,
    read: links.filter((link) => link.isRead).length,
    favorites: links.filter((link) => link.isFavorite).length,
    totalReadTime: links
      .filter((link) => link.isRead)
      .reduce((sum, link) => sum + link.estimatedReadTime, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <p className="text-sm text-gray-600">Total Links</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {stats.unread}
            </div>
            <p className="text-sm text-gray-600">Unread</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.read}
            </div>
            <p className="text-sm text-gray-600">Read</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.favorites}
            </div>
            <p className="text-sm text-gray-600">Favorites</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalReadTime}
            </div>
            <p className="text-sm text-gray-600">Minutes Read</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search links, descriptions, URLs, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="favorites">Favorites</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links List */}
      <div className="space-y-4">
        {filteredLinks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No links found
              </h3>
              <p className="text-gray-500 mb-4">
                {links.length === 0
                  ? 'Start building your reading list by adding your first link.'
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
              {links.length === 0 && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Link
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredLinks.map((link) => {
            const CategoryIcon = getCategoryIcon(link.category);
            const priorityData = priorities.find(
              (p) => p.value === link.priority
            );
            const favicon = getFavicon(link.url);

            return (
              <Card
                key={link.id}
                className={`hover:shadow-md transition-shadow ${
                  link.isFavorite ? 'ring-2 ring-yellow-200' : ''
                } ${link.isRead ? 'opacity-75' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {favicon && (
                          <img
                            src={favicon || '/placeholder.svg'}
                            alt=""
                            className="w-4 h-4"
                            onError={(e) =>
                              (e.currentTarget.style.display = 'none')
                            }
                          />
                        )}
                        <CategoryIcon className="h-4 w-4 text-gray-500" />
                        <h3
                          className={`text-lg font-semibold ${link.isRead ? 'line-through text-gray-500' : 'text-gray-900'}`}
                        >
                          {link.title}
                        </h3>
                        {link.isFavorite && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>

                      {link.description && (
                        <p className="text-gray-600 mb-3">{link.description}</p>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className={priorityData?.color}
                        >
                          {priorityData?.label}
                        </Badge>
                        <Badge variant="secondary">
                          {
                            categories.find((c) => c.value === link.category)
                              ?.label
                          }
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {link.estimatedReadTime} min
                        </div>
                      </div>

                      {link.tags.length > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                          <Tag className="h-3 w-3 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {link.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {link.notes && (
                        <p className="text-sm text-gray-500 italic mb-3">
                          {link.notes}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          Added {new Date(link.createdAt).toLocaleDateString()}
                        </span>
                        {link.readAt && (
                          <span>
                            Read {new Date(link.readAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(link.id)}
                        className="text-gray-500 hover:text-yellow-500"
                      >
                        {link.isFavorite ? (
                          <Star className="h-4 w-4 fill-current" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRead(link.id)}
                        className={`${link.isRead ? 'text-green-600' : 'text-gray-500'}`}
                      >
                        {link.isRead ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openLink(link.url)}
                        className="text-gray-500 hover:text-blue-500"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editLink(link)}
                        className="text-gray-500 hover:text-blue-500"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Link</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{link.title}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteLink(link.id)}
                              className="bg-red-600 hover:bg-red-700"
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
            );
          })
        )}
      </div>
    </main>
  );
}
