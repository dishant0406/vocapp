// Base types
export type UUID = string;
export type Email = string;
export type Timestamp = string;
export type Nullable<T> = T | null;

// Account types
export type AccountType = "free" | "premium" | "pro";

// Basic user properties
export type UserBase = {
  id: UUID;
  email: Email;
  name: string;
  supertokensUserId: UUID;
  accountType: AccountType;
  podcastLimit: number;
  podcastsGenerated: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastPlayedEpisodeId: Nullable<UUID>;
};

// Podcast related types
export type PodcastBase = {
  id: UUID;
  title: string;
  description: string;
  coverImage: string;
  userId: UUID;
  isMultiEpisode: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// User preferences
export type UserPreferences = {
  id: UUID;
  userId: UUID;
  voiceId: string;
  playbackSpeed: number;
  autoPlay: boolean;
  notificationsEnabled: boolean;
  darkMode: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// Schedule, Interest, and PodcastHistory types
// These are empty arrays in the example but we'll define them for completeness
export type Schedule = {
  // Define schedule properties here when available
};

export type Interest = {
  // Define interest properties here when available
};

export type PodcastHistoryItem = {
  // Define podcast history item properties here when available
};

// The complete User type
export type User = UserBase & {
  podcasts: PodcastBase[];
  schedules: Schedule[];
  interests: Interest[];
  podcastHistory: PodcastHistoryItem[];
  preferences: UserPreferences;
};
