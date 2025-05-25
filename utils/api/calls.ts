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
