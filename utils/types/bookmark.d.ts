export type Bookmark = {
  id: string;
  userId: string;
  itemId: string;
  type: "podcast" | "episode"; // Changed from itemType to type
  createdAt: string;
  updatedAt: string;
  coverImage?: string; // Added coverImage at top level
  // Optional related data that might be populated
  podcast?: {
    id: string;
    title: string;
    coverImage: string;
    description?: string;
    isMultiEpisode?: boolean; // Added new field
    userId?: string; // Added new field
  };
  episode?: {
    id: string;
    title: string;
    podcastId: string;
    episodeNumber: number;
    duration: number;
    audioUrl?: string; // Added new field
    description?: string; // Added new field
    playCount?: number; // Added new field
    podcast?: any; // Added nested podcast object
  };
};

export interface BookmarkResponse {
  success: boolean;
  data: {
    bookmark?: Bookmark;
    bookmarks?: Bookmark[];
    isBookmarked?: boolean;
    message?: string;
  };
}

// Direct bookmark list response (matches the API response you provided)
export type BookmarkListResponse = Bookmark[];

export interface CreateBookmarkRequest {
  itemId: string;
}

export interface BookmarkCheckResponse {
  success: boolean;
  data: {
    isBookmarked: boolean;
  };
}
