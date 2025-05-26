import handleApiCall from "@/utils/api/apiHandler";
import { getDashboardData } from "@/utils/api/calls";
import { DashboardDataApiResponse } from "@/utils/types/dashboard";
import { create } from "zustand";

interface DashboardState {
  dashboardData: DashboardDataApiResponse | null;
  isLoading: boolean;
  error: Error | null;
  fetchDashboard: () => Promise<void>;
}

const useDashboardStore = create<DashboardState>((set) => ({
  dashboardData: null,
  isLoading: false,
  error: null,
  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    handleApiCall(getDashboardData, [], {
      onSuccess: (responseData) => {
        set({ dashboardData: responseData.data, isLoading: false });
      },
      onError: (error) => {
        set({
          error: new Error(error as string | undefined),
          isLoading: false,
        });
      },
    });
  },
}));

export default useDashboardStore;
