export type PodcastTopicRelation = {
  PodcastId: string;
  TopicId: string;
};

// Base types
export interface User {
  id: string;
  name: string;
  email: string;
  supertokensUserId: string;
  accountType: "free" | "premium" | "pro"; // Based on "free" in data, assuming other types exist
  podcastLimit: number;
  podcastsGenerated: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  podcast_topic: Record<string, any>; // Generic object type since structure isn't clear
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Episode {
  id: string;
  podcastId: string;
  title: string;
  description: string;
  episodeNumber: number;
  duration: number; // Duration in minutes
  audioUrl: string;
  hlsUrl: string;
  transcript: string;
  searchQuery: string;
  status: EpisodeStatus; // Assuming this is an enum or string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Podcast {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverImage: string;
  isMultiEpisode: boolean;
  schedule: string | null; // Seems to be nullable
  episodes: Episode[];
  topics: Topic[];
  user: User;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  averageDuration: number; // Average duration of episodes in minutes
}

// Optional: More specific status enums if you want stricter typing
export enum EpisodeStatus {
  READY = "ready",
  PROCESSING = "generating",
  ERROR = "error",
  PENDING = "pending",
}

export enum AccountType {
  FREE = "free",
  PREMIUM = "premium",
  PRO = "pro",
}

// Type with enums (alternative version)
export interface PodcastWithEnums extends Omit<Podcast, "episodes" | "user"> {
  episodes: Array<Omit<Episode, "status"> & { status: EpisodeStatus }>;
  user: Omit<User, "accountType"> & { accountType: AccountType };
}

export type PodcastResponse = {
  count: number;
  rows: Podcast[];
};
