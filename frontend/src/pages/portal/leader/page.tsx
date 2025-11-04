'use client';

import { useState } from 'react';

import {
  Edit,
  Eye,
  Github,
  Globe,
  Linkedin,
  Minus,
  Plus,
  Search,
  Trash2,
  Twitter,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
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
import { leaders } from '@/mock/portal';
import type { Leader } from '@/types/portal';

export default function FamousPeoplePage() {
  const [people, setPeople] = useState<Leader[]>(leaders);
  const [selectedPerson, setSelectedPerson] = useState<Leader | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Leader | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('all');

  const [newPerson, setNewPerson] = useState<Omit<Leader, 'id'>>({
    name: '',
    field: '',
    image: '',
    bio: '',
    achievements: [],
    socialLinks: [],
  });

  const filteredPeople = people.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesField =
      selectedField === 'all' ||
      person.field.toLowerCase().includes(selectedField.toLowerCase());

    return matchesSearch && matchesField;
  });

  const uniqueFields = [
    'all',
    ...Array.from(new Set(people.map((person) => person.field))),
  ];

  const handleAddNew = () => {
    setSelectedPerson(null);
    setIsEditOpen(true);
  };

  const handleViewDetails = (person: Leader) => {
    setSelectedPerson(person);
    setIsDetailsOpen(true);
  };

  const handleEdit = (person: Leader) => {
    setEditingPerson(person);
    setNewPerson({
      name: person.name,
      field: person.field,
      image: person.image,
      bio: person.bio,
      achievements: person.achievements,
      socialLinks: person.socialLinks,
    });
    setIsEditOpen(true);
  };

  const handleRemove = (id: string) => {
    setPeople(people.filter((person) => person.id !== id));
  };

  const handleCreateNew = () => {
    const id = Date.now().toString();
    setPeople([...people, { ...newPerson, id }]);
    setNewPerson({
      name: '',
      field: '',
      image: '',
      bio: '',
      achievements: [],
      socialLinks: [],
    });
    setIsAddOpen(false);
  };

  const handleSaveEdit = () => {
    if (editingPerson) {
      setPeople(
        people.map((person) =>
          person.id === editingPerson.id
            ? { ...newPerson, id: editingPerson.id }
            : person
        )
      );
      setIsEditOpen(false);
      setEditingPerson(null);
      setNewPerson({
        name: '',
        field: '',
        image: '',
        bio: '',
        achievements: [],
        socialLinks: [],
      });
    }
  };

  const handleAchievementChange = (index: number, value: string) => {
    const updatedAchievements = [...newPerson.achievements];
    updatedAchievements[index] = value;
    setNewPerson({ ...newPerson, achievements: updatedAchievements });
  };

  const addAchievement = () => {
    setNewPerson({
      ...newPerson,
      achievements: [...newPerson.achievements, ''],
    });
  };

  const removeAchievement = (index: number) => {
    setNewPerson({
      ...newPerson,
      achievements: newPerson.achievements.filter((_, i) => i !== index),
    });
  };

  const handleSocialLinkChange = (
    index: number,
    field: 'platform' | 'url',
    value: string
  ) => {
    const updatedLinks = [...newPerson.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setNewPerson({ ...newPerson, socialLinks: updatedLinks });
  };

  const addSocialLink = () => {
    setNewPerson({
      ...newPerson,
      socialLinks: [...newPerson.socialLinks, { platform: '', url: '' }],
    });
  };

  const removeSocialLink = (index: number) => {
    setNewPerson({
      ...newPerson,
      socialLinks: newPerson.socialLinks.filter((_, i) => i !== index),
    });
  };

  const handleChangeEditPopup = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) {
      setEditingPerson(null);
      setNewPerson({
        name: '',
        field: '',
        image: '',
        bio: '',
        achievements: [],
        socialLinks: [],
      });
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Famous People Directory
          </h1>
          <p className="text-lg text-gray-600">
            Discover inspiring professionals in IT, Education, and Digital
            Marketing
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name, field, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by field" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueFields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field === 'all' ? 'All Fields' : field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <hr />
        <div className="my-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredPeople.length} of {people.length} professionals
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedField !== 'all' && ` in ${selectedField}`}
          </p>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPeople.map((person) => (
            <Card
              key={person.id}
              className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      person.image ||
                      `/placeholder.svg?height=60&width=60&query=${person.name}`
                    }
                    alt={person.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-y-2">
                    <CardTitle className="text-lg">{person.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {person.field}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {person.bio}
                </p>
                <div className="flex flex-wrap gap-2">
                  {person.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(person)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(person)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(person.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredPeople.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No professionals found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find what you're
              looking for.
            </p>
          </div>
        )}

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedPerson && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {selectedPerson.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex items-start gap-6">
                    <img
                      src={
                        selectedPerson.image ||
                        `/placeholder.svg?height=150&width=150&query=${selectedPerson.name || '/placeholder.svg'} portrait`
                      }
                      alt={selectedPerson.name}
                      className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="text-indigo-600 font-medium mb-3">
                        {selectedPerson.field}
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedPerson.bio}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-2">
                    <h3 className="text-lg font-semibold mb-3">Achievements</h3>
                    <ul className="space-y-2">
                      {selectedPerson.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="text-gray-700">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedPerson.socialLinks.length > 0 && (
                    <div className="flex flex-col gap-y-2">
                      <h3 className="text-lg font-semibold mb-3">
                        Social Links
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPerson.socialLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                          >
                            {link.platform}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isEditOpen} onOpenChange={handleChangeEditPopup}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Person</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={newPerson.name}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, name: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="edit-field">Field</Label>
                <Input
                  id="edit-field"
                  value={newPerson.field}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, field: e.target.value })
                  }
                  placeholder="e.g., Software Engineering, English Teaching, SEO"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={newPerson.image}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, image: e.target.value })
                  }
                  placeholder="Enter image URL or use placeholder"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="edit-bio">Bio</Label>
                <Textarea
                  id="edit-bio"
                  value={newPerson.bio}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, bio: e.target.value })
                  }
                  placeholder="Brief professional biography"
                  rows={3}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>Achievements</Label>
                {newPerson.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={achievement}
                      onChange={(e) =>
                        handleAchievementChange(index, e.target.value)
                      }
                      placeholder="Enter achievement"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAchievement(index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAchievement}
                  className="mt-2 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Achievement
                </Button>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>Social Links</Label>
                {newPerson.socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={link.platform}
                      onChange={(e) =>
                        handleSocialLinkChange(
                          index,
                          'platform',
                          e.target.value
                        )
                      }
                      placeholder="Platform (e.g., LinkedIn)"
                      className="w-1/4"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) =>
                        handleSocialLinkChange(index, 'url', e.target.value)
                      }
                      placeholder="URL"
                      className=""
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSocialLink(index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSocialLink}
                  className="mt-2 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social Link
                </Button>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
