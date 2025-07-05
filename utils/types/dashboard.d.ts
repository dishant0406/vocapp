export type PodcastApiResponse = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  userId: string;
  isMultiEpisode: boolean;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  averageDuration?: number; // in seconds
};

export type PodcastWithPlayCountApiResponse = PodcastApiResponse & {
  totalPlayCount?: number;
};

export type TopicApiResponse = {
  id: string;
  name: string;
  description: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
};

export type RecentlyPlayedEpisodeApiResponse = {
  id: string;
  title: string;
  podcastTitle: string;
  coverImage?: string;
  audioUrl: string;
  duration: number;
  podcastId: string;
};

export type DashboardDataApiResponse = {
  recentPodcasts: PodcastApiResponse[];
  mostViewedPodcasts: PodcastWithPlayCountApiResponse[];
  allTopics: TopicApiResponse[];
  recentlyPlayedEpisodes?: RecentlyPlayedEpisodeApiResponse[];
  hasGeneratingEpisodes: boolean;
};

export type DashboardApiResponse = {
  success: boolean;
  message: string;
  data: DashboardDataApiResponse;
};
