import Cover from "@/components/Reusables/Cover";
import Loader from "@/components/Reusables/Loader";
import NoData from "@/components/Reusables/NoData";
import useBookmarkStore from "@/utils/store/bookmarkStore";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { Podcast } from "@/utils/types/podcast";
import { toast } from "@backpackapp-io/react-native-toast";
import { Bookmark01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Create a BookmarksScreen component that uses the bookmark store
const BookmarksScreen = () => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Get bookmark data and functions from the store
  const { bookmarks, isLoading, fetchBookmarks, removeBookmark } =
    useBookmarkStore();

  // Transform bookmarks to podcasts for display
  const bookmarkedPodcasts = bookmarks
    .filter(
      (bookmark) =>
        (bookmark.type === "podcast" && bookmark.podcast) ||
        (bookmark.type === "episode" && bookmark.episode)
    )
    .map((bookmark) => {
      if (bookmark.type === "podcast") {
        return {
          id: bookmark.itemId,
          title: bookmark.podcast?.title || "",
          coverImage: bookmark.podcast?.coverImage || "",
          description: bookmark.podcast?.description || "",
          bookmarkId: bookmark.id,
          podcastId: bookmark.itemId,
          type: "podcast",
        } as unknown as Podcast & {
          bookmarkId: string;
          podcastId: string;
          type: string;
        };
      } else {
        return {
          id: bookmark.itemId,
          title: bookmark.episode?.title || "",
          coverImage: bookmark.episode?.podcast?.coverImage || "",
          description: bookmark.episode?.description || "",
          podcastId: bookmark.episode?.podcastId || "",
          bookmarkId: bookmark.id,
          type: "episode",
        } as unknown as Podcast & {
          bookmarkId: string;
          podcastId: string;
          type: string;
        };
      }
    })
    // Remove duplicates by keeping only the first item with each unique podcastId
    .filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.podcastId === item.podcastId)
    );

  useEffect(() => {
    fetchBookmarks();
  }, []);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const handleRemoveBookmark = async (itemId: string) => {
    try {
      const success = await removeBookmark(itemId);
      if (success) {
        toast.success("Removed from bookmarks!");
      } else {
        toast.error("Failed to remove bookmark");
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Something went wrong");
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchBookmarks().finally(() => {
      setIsRefreshing(false);
    });
  };

  if (loading && bookmarkedPodcasts.length < 1) {
    return <Loader />;
  }

  if (!loading && bookmarkedPodcasts.length < 1) {
    return <NoData text="No bookmarks found" />;
  }

  const renderItem = ({
    item,
  }: {
    item: Podcast & {
      bookmarkId: string;
      type: string;
      podcastId: string;
    };
  }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveBookmark(item.id)}
        >
          <HugeiconsIcon
            icon={Bookmark01Icon}
            size={theme.vw(6)}
            color={theme.colors.background}
            strokeWidth={2.2}
            r
          />
        </TouchableOpacity>
        <Cover
          link={
            item.type === "podcast"
              ? `/podcast/${item.id}`
              : `/podcast/${item.podcastId}/${item.id}`
          }
          id={item.id}
          title={item.title}
          imageUrl={item.coverImage}
          duration={0}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Podcast</Text>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        data={bookmarkedPodcasts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: theme.vw(6),
        }}
      />
    </SafeAreaView>
  );
};

const madeStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
  } as ViewStyle,
  header: {
    padding: theme.vw(4),
    flexDirection: "row",
    marginTop: theme.vh(1.5),
    marginLeft: theme.vw(4),
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.vh(2),
  } as ViewStyle,
  title: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    fontWeight: "bold",
    fontFamily: theme.fontFamily.bold,
  } as TextStyle,
  itemContainer: {
    position: "relative",
    width: theme.vw(43),
    marginBottom: theme.vh(2),
  } as ViewStyle,
  removeButton: {
    position: "absolute",
    top: theme.vh(1),
    right: theme.vw(5),
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 5,
    zIndex: 10,
  } as ViewStyle,
}));

export default BookmarksScreen;
