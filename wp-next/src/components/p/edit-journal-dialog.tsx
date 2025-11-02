import React from 'react';

import { Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { emojiMoodOptions } from '@/constants/p/journal';
import { JournalEntry } from '@/types/portal';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journal: JournalEntry | null;
  onEditJournal: (entry: JournalEntry | null) => void;
  onSaveEntry: (entry: JournalEntry) => void;
};

const EditJournalDialog = ({
  open,
  onOpenChange,
  journal,
  onEditJournal,
  onSaveEntry,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-background">
          <DialogHeader className="border-b pb-4 space-y-2">
            <DialogTitle>Edit Journal</DialogTitle>
            <DialogDescription>Edit your journal entries</DialogDescription>
          </DialogHeader>
          <div className="container mx-auto px-0 pt-8 space-y-4">
            {journal && (
              <>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Title
                  </label>
                  <Input
                    placeholder="Give your entry a title..."
                    value={journal?.title || ''}
                    onChange={(e) =>
                      onEditJournal({ ...journal, title: e.target.value })
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
                          onEditJournal({
                            ...journal,
                            emoji: item.emoji,
                            mood: item.mood,
                          })
                        }
                        className={`text-2xl p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                          journal?.emoji === item.emoji
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
                    value={journal?.happy_grateful || ''}
                    onChange={(e) =>
                      onEditJournal({
                        ...journal,
                        happy_grateful: e.target.value,
                      })
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
                    value={journal?.upset_stressed || ''}
                    onChange={(e) =>
                      onEditJournal({
                        ...journal,
                        upset_stressed: e.target.value,
                      })
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
                    value={journal?.learned_today || ''}
                    onChange={(e) =>
                      onEditJournal({
                        ...journal,
                        learned_today: e.target.value,
                      })
                    }
                    className="min-h-[120px] resize-none"
                  />
                </div>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="w-full sm:w-auto ml-2"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    onClick={() => onSaveEntry(journal)}
                    disabled={!journal?.title.trim()}
                    className="w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditJournalDialog;
