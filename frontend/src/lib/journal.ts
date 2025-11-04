export const getMoodColor = (mood?: string) => {
  switch (mood?.toLowerCase()) {
    case 'happy':
      return 'bg-green-100 text-green-800';
    case 'stressed':
      return 'bg-red-100 text-red-800';
    case 'grateful':
      return 'bg-blue-100 text-blue-800';
    case 'curious':
      return 'bg-purple-100 text-purple-800';
    case 'peaceful':
      return 'bg-teal-100 text-teal-800';
    case 'reflective':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
