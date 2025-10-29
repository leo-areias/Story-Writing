// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  statusCode: number;
  timestamp: string;
}

// Story Types
export interface Story {
  _id: string;
  title: string;
  premise: string;
  genre: string;
  setting: StorySetting;
  tone: string;
  targetAudience: string;
  status: 'draft' | 'in-progress' | 'completed' | 'published';
  currentChapter: number;
  totalChapters: number;
  wordCount: number;
  tags: string[];
  userId: string;
  characters: string[]; // Character IDs
  chapters: string[]; // Chapter IDs
  agentProgress: AgentProgress;
  isPublic: boolean;
  isActive: boolean;
  plotPoints: PlotPoint[];
  branchingPaths: BranchingPath[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface StorySetting {
  time: string;
  place: string;
  atmosphere: string;
  worldRules: string[];
}

export interface AgentProgress {
  agent1: AgentStatus;
  agent2: AgentStatus;
  agent3: AgentStatus;
}

export interface AgentStatus {
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  notes?: string;
  completedAt?: string;
  error?: string;
}

export interface PlotPoint {
  id: string;
  title: string;
  description: string;
  chapterNumber: number;
  importance: 'low' | 'medium' | 'high';
  resolved: boolean;
}

export interface BranchingPath {
  id: string;
  fromChapter: number;
  toChapter: number;
  choiceText: string;
  condition?: string;
}

// Character Types
export interface Character {
  _id: string;
  name: string;
  description: string;
  personality: string;
  background: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  appearance: CharacterAppearance;
  motivations: string[];
  relationships: CharacterRelationship[];
  storyId: string;
  createdBy: 'user' | 'agent1';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CharacterAppearance {
  age: number;
  gender: string;
  physicalDescription: string;
  clothing: string;
}

export interface CharacterRelationship {
  characterId: string | null;
  relationshipType: 'friend' | 'enemy' | 'family' | 'romantic' | 'mentor' | 'rival' | 'neutral' | 'adversary' | 'adversarial' | 'colleague' | 'acquaintance';
  description: string;
}

// Chapter Types
export interface Chapter {
  _id: string;
  title: string;
  content: string;
  summary: string;
  chapterNumber: number;
  wordCount: number;
  choices: ChapterChoice[];
  mood: string;
  pacing: 'slow' | 'medium' | 'fast';
  storyId: string;
  createdBy: 'user' | 'agent2';
  status: 'draft' | 'review' | 'approved' | 'published';
  review?: ChapterReview;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ChapterChoice {
  choiceText: string;
  consequence: string;
  isEnding: boolean;
  nextChapterId?: string;
}

export interface ChapterReview {
  score: number;
  feedback: string;
  suggestions: string[];
  issues: string[];
  reviewedBy: 'user' | 'agent3';
  reviewedAt: string;
}

// Form Types
export interface CreateStoryForm {
  title: string;
  premise: string;
  genre: string;
  userId: string;
}

export interface UpdateStoryForm {
  title?: string;
  premise?: string;
  genre?: string;
  tags?: string[];
  isPublic?: boolean;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface StoryListState extends LoadingState {
  stories: Story[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface StoryDetailState extends LoadingState {
  story: Story | null;
  characters: Character[];
  chapters: Chapter[];
}

// Genre Options
export const GENRE_OPTIONS = [
  { value: 'mystery', label: 'Mystery', description: 'Crime, detective stories, suspense' },
  { value: 'fantasy', label: 'Fantasy', description: 'Magic, mythical creatures, otherworldly' },
  { value: 'sci-fi', label: 'Science Fiction', description: 'Future technology, space, scientific concepts' },
  { value: 'horror', label: 'Horror', description: 'Fear, supernatural, psychological thriller' },
  { value: 'romance', label: 'Romance', description: 'Love stories, relationships, emotional connections' },
  { value: 'adventure', label: 'Adventure', description: 'Journey, exploration, action-packed' },
  { value: 'drama', label: 'Drama', description: 'Character development, emotional depth' },
  { value: 'thriller', label: 'Thriller', description: 'Suspense, tension, fast-paced action' },
  { value: 'historical', label: 'Historical', description: 'Past events, historical settings' },
  { value: 'literary', label: 'Literary Fiction', description: 'Character-driven, artistic merit' },
] as const;

export type Genre = typeof GENRE_OPTIONS[number]['value'];

// API Endpoints
export const API_ENDPOINTS = {
  STORIES: '/api/stories',
  CHARACTERS: '/api/characters',
  CHAPTERS: '/api/chapters',
  AGENTS: '/api/agents',
  HEALTH: '/health',
} as const;
