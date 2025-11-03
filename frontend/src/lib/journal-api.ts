// Mock data for journal entries
const mockEntries = [
  {
    id: '1',
    date: '2023-03-15',
    mood: 'happy',
    content:
      'Today was a productive day. I completed all my tasks and had time for a nice walk in the evening.',
    tags: ['work', 'personal'],
  },
  {
    id: '2',
    date: '2023-03-14',
    mood: 'neutral',
    content:
      'Average day. Nothing special happened, but I did make progress on my project.',
    tags: ['work'],
  },
  {
    id: '3',
    date: '2023-03-13',
    mood: 'anxious',
    content:
      'Feeling a bit overwhelmed with all the deadlines coming up. Need to organize my schedule better.',
    tags: ['work', 'health'],
  },
];

// Function to get all journal entries
export const getAllEntries = async () => {
  // In a real app, you would fetch from an API or database
  // For now, we'll just return mock data
  return mockEntries;
};

// Function to create a new journal entry
export const createEntry = async (entry: any) => {
  // In a real app, you would send to an API or database
  // For now, we'll just return the entry with a success status
  return {
    success: true,
    entry,
  };
};

// Function to update an existing journal entry
export const updateEntry = async (entry: any) => {
  // In a real app, you would send to an API or database
  // For now, we'll just return the entry with a success status
  return {
    success: true,
    entry,
  };
};

// Function to delete a journal entry
export const deleteEntry = async () => {
  // In a real app, you would send to an API or database
  // For now, we'll just return a success status
  return {
    success: true,
  };
};
