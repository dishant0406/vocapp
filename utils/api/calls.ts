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
