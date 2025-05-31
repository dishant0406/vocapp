import handleApiCall from "@/utils/api/apiHandler";
import { create } from "zustand";
import { getUserProfile } from "../api/calls";
import { User } from "../types/user";

const useUserStore = create<{
  userProfile: User | null; // Replace 'any' with your actual user profile type
  isLoading: boolean;
  error: Error | null;
  fetchUserProfile: () => Promise<void>;
}>((set) => ({
  userProfile: null,
  isLoading: false,
  error: null,
  fetchUserProfile: async () => {
    handleApiCall(getUserProfile, [], {
      onSuccess: (responseData) => {
        set({ userProfile: responseData, isLoading: false });
      },
      setLoading: (loading) => set({ isLoading: loading }),
    });
  },
}));

export default useUserStore;
