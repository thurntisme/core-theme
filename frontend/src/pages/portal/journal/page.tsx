'use client';

import { useState } from 'react';

import { CalendarDays, Edit2, Plus, X } from 'lucide-react';

import EditJournalDialog from '@/components/p/edit-journal-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmDeleteBtn from '@/components/ui/confirm-delete-btn';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { emojiMoodOptions } from '@/constants/journal';
import { getMoodColor } from '@/lib/journal';
import { formatDate } from '@/lib/utils';
import type { JournalEntry } from '@/types/portal';

export default function JournalApp() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      created_at: '2024-01-15 10:30:00',
      title: 'A Day of Reflection',
      happy_grateful:
        "I finally finished reading that book I've been working on for weeks. Also enjoyed a long walk in the park.",
      upset_stressed:
        'Not really upset today, just a bit tired after the long walk.',
      learned_today:
        'The ending of the book taught me a lot about patience and unexpected outcomes.',
      emoji: '😊',
      mood: 'Happy',
    },
    {
      id: '2',
      created_at: '2024-01-14 18:45:00',
      title: 'Challenging Workday',
      happy_grateful:
        'Grateful for my supportive team at work. Everyone is pushing hard for the project deadline.',
      upset_stressed:
        "Feeling stressed because there's still so much left to finish before the deadline.",
      learned_today: 'Teamwork makes challenges feel lighter.',
      emoji: '😰',
      mood: 'Stressed',
    },
  ]);
  const [newEntry, setNewEntry] = useState<JournalEntry | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [journalToEdit, setJournalToEdit] = useState<JournalEntry | null>(null);

  const handleCancelNewEntry = () => {
    setNewEntry(null);
  };

  const handleAddEntry = () => {
    if (newEntry?.title.trim()) {
      setEntries([newEntry, ...entries]);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setJournalToEdit({ ...entry });
    setOpenEditDialog(true);
  };

  const handleSaveEntry = (journal: JournalEntry) => {
    if (journal.id && journal.title.trim()) {
      setEntries(
        entries.map((entry) => (entry.id === journal.id ? journal : entry))
      );
    }
    setOpenEditDialog(false);
    setJournalToEdit(null);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Journal</h1>
        <p className="text-gray-600">Capture your thoughts and memories</p>
      </div>

      {/* Input Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Journal Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Title
            </label>
            <Input
              placeholder="Give your entry a title..."
              value={newEntry?.title || ''}
              onChange={(e) =>
                setNewEntry({
                  ...newEntry,
                  title: e.target.value,
                } as JournalEntry)
              }
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Mood Emoji
            </label>
            <div className="flex flex-wrap gap-2">
              {emojiMoodOptions.map((item) => (
                <button
                  key={item.mood}
                  onClick={() =>
                    setNewEntry({
                      ...newEntry,
                      emoji: item.emoji,
                      mood: item.mood,
                    } as JournalEntry)
                  }
                  className={`text-2xl p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                    newEntry?.emoji === item.emoji
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              What made you happy/grateful today?
            </label>
            <Textarea
              placeholder="What's on your mind today? Share your thoughts, experiences, or reflections..."
              value={newEntry?.happy_grateful || ''}
              onChange={(e) =>
                setNewEntry({
                  ...newEntry,
                  happy_grateful: e.target.value,
                } as JournalEntry)
              }
              className="min-h-[120px] resize-none"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              What made you upset/stressed?
            </label>
            <Textarea
              placeholder="What's on your mind today? Share your thoughts, experiences, or reflections..."
              value={newEntry?.upset_stressed || ''}
              onChange={(e) =>
                setNewEntry({
                  ...newEntry,
                  upset_stressed: e.target.value,
                } as JournalEntry)
              }
              className="min-h-[120px] resize-none"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              What you learned today?
            </label>
            <Textarea
              placeholder="What's on your mind today? Share your thoughts, experiences, or reflections..."
              value={newEntry?.learned_today || ''}
              onChange={(e) =>
                setNewEntry({
                  ...newEntry,
                  learned_today: e.target.value,
                } as JournalEntry)
              }
              className="min-h-[120px] resize-none"
            />
          </div>
          <div className="flex gap-x-2">
            <Button
              onClick={handleCancelNewEntry}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleAddEntry}
              disabled={!newEntry?.title?.trim()}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Journal Entries List */}
      <div className="space-y-6 mb-8">
        {entries.map((entry) => (
          <Card
            key={entry.id}
            className="shadow-md hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays className="w-4 h-4" />
                  {formatDate(entry.created_at)}
                </div>
                <div className="flex items-center gap-2">
                  {entry.mood && (
                    <Badge
                      variant="secondary"
                      className={getMoodColor(entry.mood)}
                    >
                      {entry.mood}
                    </Badge>
                  )}
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(entry)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <ConfirmDeleteBtn action={() => handleDelete(entry.id)} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{entry.emoji}</span>
                <h3 className="text-lg font-semibold text-gray-900">
                  {entry.title}
                </h3>
              </div>
              <p className="text-gray-800 leading-relaxed">
                {entry.happy_grateful}
              </p>
              <p className="text-gray-800 leading-relaxed">
                {entry.upset_stressed}
              </p>
              <p className="text-gray-800 leading-relaxed">
                {entry.learned_today}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Button */}
      <div className="text-center">
        <Button variant="outline" size="lg" className="px-8 bg-transparent">
          Load More Entries
        </Button>
      </div>

      <EditJournalDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        journal={journalToEdit}
        onEditJournal={setJournalToEdit}
        onSaveEntry={handleSaveEntry}
      />
    </main>
  );
}
