import handleApiCall from "@/utils/api/apiHandler";
import {
  checkIfBookmarked,
  createBookmark,
  getMyBookmarks,
  removeBookmarkByItemId,
} from "@/utils/api/calls";
import { Bookmark } from "@/utils/types/bookmark";
import { create } from "zustand";

interface BookmarkState {
  bookmarks: Bookmark[];
  bookmarkedItems: Set<string>; // Set of item IDs that are bookmarked for quick lookup
  isLoading: boolean;
  error: Error | null;

  // Actions
  fetchBookmarks: () => Promise<void>;
  addBookmark: (itemId: string) => Promise<boolean>;
  removeBookmark: (itemId: string) => Promise<boolean>;
  checkBookmarkStatus: (itemId: string) => Promise<boolean>;
  isItemBookmarked: (itemId: string) => boolean;
}

const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  bookmarkedItems: new Set(),
  isLoading: false,
  error: null,

  fetchBookmarks: async () => {
    set({ isLoading: true, error: null });

    handleApiCall(getMyBookmarks, [], {
      onSuccess: (responseData) => {
        const bookmarks = responseData.data || [];
        const bookmarkedItems = new Set<string>(
          bookmarks.map((b: Bookmark) => b.itemId)
        );

        set({
          bookmarks,
          bookmarkedItems,
          isLoading: false,
        });
      },
      onError: (error) => {
        set({
          error: new Error(error as string | undefined),
          isLoading: false,
        });
      },
    });
  },

  addBookmark: async (itemId: string) => {
    return new Promise((resolve) => {
      handleApiCall(createBookmark, [itemId], {
        onSuccess: (responseData) => {
          const newBookmark = responseData.data?.bookmark;
          if (newBookmark) {
            set((state) => ({
              bookmarks: [...state.bookmarks, newBookmark],
              bookmarkedItems: new Set([...state.bookmarkedItems, itemId]),
            }));
          }
          resolve(true);
        },
        onError: (error) => {
          console.error("Error adding bookmark:", error);
          set({
            error: new Error(error as string | undefined),
          });
          resolve(false);
        },
      });
    });
  },

  removeBookmark: async (itemId: string) => {
    return new Promise((resolve) => {
      handleApiCall(removeBookmarkByItemId, [itemId], {
        onSuccess: () => {
          set((state) => ({
            bookmarks: state.bookmarks.filter((b) => b.itemId !== itemId),
            bookmarkedItems: new Set(
              [...state.bookmarkedItems].filter((id) => id !== itemId)
            ),
          }));
          resolve(true);
        },
        onError: (error) => {
          console.error("Error removing bookmark:", error);
          set({
            error: new Error(error as string | undefined),
          });
          resolve(false);
        },
      });
    });
  },

  checkBookmarkStatus: async (itemId: string) => {
    return new Promise((resolve) => {
      handleApiCall(checkIfBookmarked, [itemId], {
        onSuccess: (responseData) => {
          const isBookmarked = responseData.data?.isBookmarked || false;
          set((state) => {
            const newBookmarkedItems = new Set(state.bookmarkedItems);
            if (isBookmarked) {
              newBookmarkedItems.add(itemId);
            } else {
              newBookmarkedItems.delete(itemId);
            }
            return { bookmarkedItems: newBookmarkedItems };
          });
          resolve(isBookmarked);
        },
        onError: (error) => {
          console.error("Error checking bookmark status:", error);
          resolve(false);
        },
      });
    });
  },

  isItemBookmarked: (itemId: string) => {
    return get().bookmarkedItems.has(itemId);
  },
}));

export default useBookmarkStore;
