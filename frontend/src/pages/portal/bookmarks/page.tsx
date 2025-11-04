'use client';

import { useState } from 'react';

import {
  Bookmark,
  Edit,
  ExternalLink,
  Folder,
  Globe,
  Link,
  Plus,
  Search,
  Star,
  Trash2,
} from 'lucide-react';

import AddBookmarkDialog from '@/components/p/add-bookmark-dialog';
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
import { defaultCategories } from '@/constants/bookmark';

interface FormData {
  id?: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string;
  favorite: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<FormData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [favoriteFilter, setFavoriteFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<FormData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    url: '',
    description: '',
    category: 'Development',
    tags: '',
    favorite: false,
  });

  const saveBookmarks = (updatedBookmarks: FormData[]) => {
    console.log('Bookmarks saved:', updatedBookmarks);
    setBookmarks(updatedBookmarks);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      description: '',
      category: 'Development',
      tags: '',
      favorite: false,
    });
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const formatUrl = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const handleAddBookmark = () => {
    if (!formData.title.trim() || !formData.url.trim()) {
      alert('Title and URL are required!');
      return;
    }

    if (!validateUrl(formData.url)) {
      alert('Please enter a valid URL!');
      return;
    }

    const newBookmark = {
      id: Date.now().toString(),
      title: formData.title,
      url: formatUrl(formData.url),
      description: formData.description,
      category: formData.category,
      tags: formData.tags,
      favorite: formData.favorite,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedBookmarks = [...bookmarks, newBookmark];
    saveBookmarks(updatedBookmarks);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditBookmark = () => {
    if (!formData.title.trim() || !formData.url.trim()) {
      alert('Title and URL are required!');
      return;
    }

    if (!validateUrl(formData.url)) {
      alert('Please enter a valid URL!');
      return;
    }

    if (!editingBookmark) return;

    resetForm();
    setEditingBookmark(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteBookmark = (bookmarkId?: string) => {
    console.log('Deleting bookmark with ID:', bookmarkId);
  };

  const handleToggleFavorite = (bookmarkId?: string) => {
    console.log('Toggling favorite for bookmark with ID:', bookmarkId);
  };

  const openEditDialog = (bookmark: FormData) => {
    setEditingBookmark(bookmark);
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      category: bookmark.category,
      tags: bookmark.tags,
      favorite: bookmark.favorite,
    });
    setIsEditDialogOpen(true);
  };

  const openBookmark = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const getUniqueCategories = () => {
    const categories = new Set(bookmarks.map((bookmark) => bookmark.category));
    return Array.from(categories).sort();
  };

  const getAllTags = () => {
    const tags = new Set(bookmarks.flatMap((bookmark) => bookmark.tags));
    return Array.from(tags).sort();
  };

  const favoriteCount = bookmarks.filter(
    (bookmark) => bookmark.favorite
  ).length;
  const categoryCount = getUniqueCategories().length;
  const tagCount = getAllTags().length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Bookmarks</h2>
          <p className="text-gray-600 mt-1">
            Save and organize your favorite websites and resources
          </p>
        </div>
        <AddBookmarkDialog
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          formData={formData}
          setFormData={setFormData}
          resetForm={resetForm}
          handleAddBookmark={handleAddBookmark}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Bookmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {bookmarks.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {favoriteCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {categoryCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{tagCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search bookmarks by title, description, URL, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {getUniqueCategories().map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={favoriteFilter} onValueChange={setFavoriteFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by favorites" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookmarks</SelectItem>
            <SelectItem value="favorites">Favorites Only</SelectItem>
            <SelectItem value="regular">Regular Only</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <Badge variant="secondary" className="px-3 py-1">
            {bookmarks.length}{' '}
            {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
          </Badge>
        </div>
      </div>

      {/* Bookmarks Grid */}
      {bookmarks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <Bookmark className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ||
              categoryFilter !== 'all' ||
              favoriteFilter !== 'all'
                ? 'No bookmarks found'
                : 'No bookmarks yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ||
              categoryFilter !== 'all' ||
              favoriteFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first bookmark'}
            </p>
            {!searchTerm &&
              categoryFilter === 'all' &&
              favoriteFilter === 'all' && (
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Bookmark
                </Button>
              )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => {
            const faviconUrl = getFaviconUrl(bookmark.url);
            const domain = getDomainFromUrl(bookmark.url);

            return (
              <Card
                key={bookmark.title}
                className="hover:shadow-lg transition-shadow group"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0">
                        {faviconUrl ? (
                          <img
                            src={faviconUrl || '/placeholder.svg'}
                            alt=""
                            className="w-6 h-6 rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove(
                                'hidden'
                              );
                            }}
                          />
                        ) : null}
                        <Globe
                          className={`w-6 h-6 text-gray-400 ${faviconUrl ? 'hidden' : ''}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors truncate">
                          {bookmark.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500 truncate">
                          {domain}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggleFavorite(bookmark.id)}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            bookmark.favorite
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-400'
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(bookmark)}
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
                            <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{bookmark.title}
                              "? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBookmark(bookmark.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {bookmark.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {bookmark.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Folder className="h-3 w-3 mr-1" />
                      {bookmark.category}
                    </Badge>
                    {bookmark.favorite && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Favorite
                      </Badge>
                    )}
                  </div>

                  {bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {bookmark.tags
                        .split(',')
                        .slice(0, 3)
                        .map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      {bookmark.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{bookmark.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <Button
                      onClick={() => openBookmark(bookmark.url)}
                      className="w-full flex items-center gap-2"
                      size="sm"
                    >
                      <Link className="h-3 w-3" />
                      Open Link
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>

                  {bookmark?.createdAt ? (
                    <div className="text-xs text-gray-400">
                      Added {new Date(bookmark?.createdAt).toLocaleDateString()}
                    </div>
                  ) : null}
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
            <DialogTitle>Edit Bookmark</DialogTitle>
            <DialogDescription>Update bookmark information.</DialogDescription>
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
                placeholder="Enter bookmark title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-url">URL *</Label>
              <Input
                id="edit-url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://example.com or example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-tags">Tags</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="tag1, tag2, tag3"
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
                placeholder="Brief description of the bookmark..."
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-favorite"
                checked={formData.favorite}
                onChange={(e) =>
                  setFormData({ ...formData, favorite: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-favorite" className="text-sm font-medium">
                Mark as favorite
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setEditingBookmark(null);
                setIsEditDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditBookmark}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
