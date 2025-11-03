export type MediaType = 'movie' | 'tv' | 'podcast' | 'music' | 'book';
export type MediaStatus = 'planned' | 'in-progress' | 'completed' | 'dropped';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  status: MediaStatus;
  coverImage?: string;
  releaseDate?: string;
  creator?: string;
  description?: string;
  genres: string[];
  rating: number;
  ratingDate?: string;
  review?: string;
  notes?: string;
  duration?: string;
  episodes?: {
    total: number;
    watched: number;
  };
  seasons?: number;
  currentSeason?: number;
  dateAdded: string;
  lastUpdated: string;
}

export const mediaItems: MediaItem[] = [
  {
    id: 'm1',
    title: 'Inception',
    type: 'movie',
    status: 'completed',
    coverImage: '/placeholder.svg?height=400&width=300',
    releaseDate: '2010-07-16',
    creator: 'Christopher Nolan',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    rating: 5,
    ratingDate: '2023-01-15',
    review:
      'A mind-bending masterpiece with incredible visuals and a complex plot that rewards multiple viewings.',
    duration: '148 min',
    dateAdded: '2023-01-10',
    lastUpdated: '2023-01-15',
  },
  {
    id: 'm2',
    title: 'The Shawshank Redemption',
    type: 'movie',
    status: 'completed',
    coverImage: '/placeholder.svg?height=400&width=300',
    releaseDate: '1994-09-23',
    creator: 'Frank Darabont',
    description:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    genres: ['Drama'],
    rating: 5,
    ratingDate: '2023-02-20',
    review:
      'One of the greatest films ever made. A powerful story of hope and redemption.',
    duration: '142 min',
    dateAdded: '2023-02-15',
    lastUpdated: '2023-02-20',
  },
  {
    id: 't1',
    title: 'Breaking Bad',
    type: 'tv',
    status: 'completed',
    coverImage: '/placeholder.svg?height=400&width=300',
    releaseDate: '2008-01-20',
    creator: 'Vince Gilligan',
    description:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    genres: ['Crime', 'Drama', 'Thriller'],
    rating: 5,
    ratingDate: '2023-03-10',
    review:
      "A masterclass in character development and storytelling. Bryan Cranston's performance is legendary.",
    episodes: {
      total: 62,
      watched: 62,
    },
    seasons: 5,
    dateAdded: '2023-03-01',
    lastUpdated: '2023-03-10',
  },
  {
    id: 't2',
    title: 'Stranger Things',
    type: 'tv',
    status: 'in-progress',
    coverImage: '/placeholder.svg?height=400&width=300',
    releaseDate: '2016-07-15',
    creator: 'The Duffer Brothers',
    description:
      'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.',
    genres: ['Drama', 'Fantasy', 'Horror'],
    rating: 4,
    episodes: {
      total: 34,
      watched: 25,
    },
    seasons: 4,
    currentSeason: 4,
    dateAdded: '2023-04-05',
    lastUpdated: '2023-04-20',
  },
  {
    id: 'p1',
    title: 'The Joe Rogan Experience',
    type: 'podcast',
    status: 'in-progress',
    coverImage: '/placeholder.svg?height=400&width=300',
    releaseDate: '2009-12-24',
    creator: 'Joe Rogan',
    description:
      'The Joe Rogan Experience podcast is a long form conversation hosted by comedian Joe Rogan with friends and guests that have included comedians, actors, musicians, MMA fighters, authors, artists, and beyond.',
    genres: ['Comedy', 'Interview', 'Society'],
    rating: 4,
    dateAdded: '2023-05-10',
    lastUpdated: '2023-05-15',
  },
  {
    id: 'b1',
    title: 'Atomic Habits',
    type: 'book',
    status: 'completed',
    coverImage: '/placeholder.svg?height=400&width=300',
    releaseDate: '2018-10-16',
    creator: 'James Clear',
    description:
      'An easy and proven way to build good habits and break bad ones.',
    genres: ['Self-Help', 'Psychology', 'Productivity'],
    rating: 5,
    ratingDate: '2023-06-15',
    review:
      'Life-changing book on habit formation. The concept of 1% improvements really resonated with me.',
    duration: '320 pages',
    dateAdded: '2023-06-01',
    lastUpdated: '2023-06-15',
  },
  {
    id: 'b2',
    title: 'The Hobbit',
    type: 'book',
    status: 'planned',
    coverImage: '/placeholder.svg?height=400&width=300',
    releaseDate: '1937-09-21',
    creator: 'J.R.R. Tolkien',
    description:
      'A reluctant hobbit, Bilbo Baggins, sets out to the Lonely Mountain with a spirited group of dwarves to reclaim their mountain home, and the gold within it from the dragon Smaug.',
    genres: ['Fantasy', 'Adventure', 'Fiction'],
    rating: 0,
    duration: '310 pages',
    dateAdded: '2023-07-01',
    lastUpdated: '2023-07-01',
  },
  {
    id: 'm3',
    title: 'Dune',
    type: 'movie',
    status: 'planned',
    coverImage: '/placeholder.svg?height=400&width=300',
    releaseDate: '2021-10-22',
    creator: 'Denis Villeneuve',
    description:
      "Feature adaptation of Frank Herbert's science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.",
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: 0,
    duration: '155 min',
    dateAdded: '2023-08-05',
    lastUpdated: '2023-08-05',
  },
  {
    id: 'mu1',
    title: 'Rumours',
    type: 'music',
    status: 'completed',
    coverImage: '/placeholder.svg?height=400&width=300',
    releaseDate: '1977-02-04',
    creator: 'Fleetwood Mac',
    description:
      'Rumours is the eleventh studio album by British-American rock band Fleetwood Mac, released on 4 February 1977.',
    genres: ['Rock', 'Pop Rock', 'Soft Rock'],
    rating: 5,
    ratingDate: '2023-09-10',
    review:
      'One of the greatest albums of all time. Every song is a masterpiece.',
    duration: '39:43',
    dateAdded: '2023-09-01',
    lastUpdated: '2023-09-10',
  },
];
