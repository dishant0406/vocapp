import { apiClient } from "./client";

export const getAllPodcasts = async () => {
  return apiClient.get("/podcasts");
};

export const getDashboardData = async () => {
  return apiClient.get("/dashboard");
};

export const getPodcastById = async (id: string) => {
  return apiClient.get(`/podcasts/${id}`);
};

export const createPodcast = async (searchQuery: string, duration: string) => {
  return apiClient.post("/podcasts", {
    searchQuery,
    duration,
  });
};
export const getRecentPodcastsPaginated = async (
  page: number = 1,
  limit: number = 10
) => {
  return apiClient.get("/dashboard/recent-podcasts", {
    params: { page, limit },
  });
};

export const getMostViewedPodcastsPaginated = async (
  page: number = 1,
  limit: number = 10
) => {
  return apiClient.get("/dashboard/most-viewed-podcasts", {
    params: { page, limit },
  });
};

export const searchPodcasts = async (
  searchTerm: string,
  page: number = 1,
  limit: number = 10
) => {
  return apiClient.get("/podcasts/search", {
    params: { searchTerm, page, limit },
  });
};

export const getPodcastsByTopics = async (
  topicIds: string[],
  page: number = 1,
  limit: number = 10
) => {
  return apiClient.get("/podcasts/topics", {
    params: { topicIds, page, limit },
    paramsSerializer: {
      indexes: null, // This will serialize as topicIds=value1&topicIds=value2
    },
  });
};

export const getUserProfile = async () => {
  return apiClient.get("/users/profile");
};

export const recordEpisodePlay = async (episodeId: string) => {
  return apiClient.post(`/episodes/episodes/${episodeId}/play`);
};

export const addEpisodeToPodcast = async (
  podcastId: string,
  query: string,
  duration: string
) => {
  return apiClient.post(`/episodes/podcasts/${podcastId}/episodes`, {
    query,
    duration,
  });
};

// Bookmark API calls
export const createBookmark = async (itemId: string) => {
  return apiClient.post("/bookmarks", { itemId });
};

export const getMyBookmarks = async () => {
  return apiClient.get("/bookmarks");
};

export const deleteBookmark = async (bookmarkId: string) => {
  return apiClient.delete(`/bookmarks/${bookmarkId}`);
};

export const checkIfBookmarked = async (itemId: string) => {
  return apiClient.get(`/bookmarks/check/${itemId}`);
};

export const removeBookmarkByItemId = async (itemId: string) => {
  return apiClient.delete(`/bookmarks/item/${itemId}`);
};
