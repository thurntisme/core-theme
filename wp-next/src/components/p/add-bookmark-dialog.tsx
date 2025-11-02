import React from 'react';

import { Plus } from 'lucide-react';

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
import { Textarea } from '@/components/ui/textarea';
import { defaultCategories } from '@/constants/p/bookmark';
import { BookmarkItem } from '@/types/portal';

type Props = {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  formData: BookmarkItem;
  setFormData: (data: BookmarkItem) => void;
  resetForm: () => void;
  handleAddBookmark: () => void;
};

const AddBookmarkDialog = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  formData,
  setFormData,
  resetForm,
  handleAddBookmark,
}: Props) => {
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Bookmark</DialogTitle>
          <DialogDescription>
            Save a new website or resource to your bookmarks.
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
              placeholder="Enter bookmark title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="https://example.com or example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
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
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value,
                  })
                }
                placeholder="tag1, tag2, tag3"
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
              placeholder="Brief description of the bookmark..."
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="favorite"
              checked={formData.favorite}
              onChange={(e) =>
                setFormData({ ...formData, favorite: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <Label htmlFor="favorite" className="text-sm font-medium">
              Mark as favorite
            </Label>
          </div>
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
          <Button onClick={handleAddBookmark}>Add Bookmark</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookmarkDialog;
