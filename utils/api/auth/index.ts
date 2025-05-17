import { apiClient } from "../client";

//signout
export const signOut = async () => {
  const { data } = await apiClient.post("/auth/signout");
  return data;
};
