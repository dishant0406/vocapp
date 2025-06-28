import AudioPlayer from "@/components/Reusables/AudioPlayer";
import Disk from "@/components/Reusables/Disk";
import IconButton from "@/components/Reusables/IconButton";
import Loader from "@/components/Reusables/Loader";
import handleApiCall from "@/utils/api/apiHandler";
import { getPodcastById } from "@/utils/api/calls";
import { useAudioPlayerState } from "@/utils/hooks/audioEvents";
import useBookmarkStore from "@/utils/store/bookmarkStore";
import { makeStyles, useTheme } from "@/utils/theme/useTheme";
import { Podcast } from "@/utils/types/podcast";
import { toast } from "@backpackapp-io/react-native-toast";
import {
  ArrowLeft01Icon,
  Bookmark01Icon,
  BookmarkAdd01Icon,
  CloudDownloadIcon,
} from "@hugeicons/core-free-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView, Text, TextStyle, View, ViewStyle } from "react-native";

const EpisodePlay = () => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  const params = useLocalSearchParams<{
    id: string;
    episode: string;
  }>();

  // Convert to string and memoize to prevent unnecessary re-renders
  const podcastId = useMemo(
    () => (Array.isArray(params.id) ? params.id[0] : params.id),
    [params.id]
  );
  const episodeId = useMemo(
    () => (Array.isArray(params.episode) ? params.episode[0] : params.episode),
    [params.episode]
  );

  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Bookmark functionality
  const { addBookmark, removeBookmark, checkBookmarkStatus } =
    useBookmarkStore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const { isPlaying } = useAudioPlayerState();

  // Memoize the API call function to prevent recreating it on every render
  const fetchPodcast = useCallback(async (id: string) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      await handleApiCall(getPodcastById, [id], {
        onSuccess: (data) => {
          setPodcast(data);
          setLoading(false);
        },
        onError: (error) => {
          console.error("Error fetching podcast:", error);
          setError("Failed to load podcast");
          setLoading(false);
        },
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  }, []);

  // Use podcastId as dependency instead of the entire params object
  useEffect(() => {
    if (podcastId) {
      fetchPodcast(podcastId);
    }
  }, [podcastId, fetchPodcast]);

  // Check bookmark status when episode data is available
  useEffect(() => {
    if (episodeId) {
      const checkStatus = async () => {
        const bookmarkStatus = await checkBookmarkStatus(episodeId);
        setIsBookmarked(bookmarkStatus);
      };
      checkStatus();
    }
  }, [episodeId, checkBookmarkStatus]);

  const handleBookmarkToggle = async () => {
    if (!episodeId || bookmarkLoading) return;

    setBookmarkLoading(true);

    try {
      if (isBookmarked) {
        const success = await removeBookmark(episodeId);
        if (success) {
          setIsBookmarked(false);
          toast.success("Episode removed from bookmarks!");
        } else {
          toast.error("Failed to remove bookmark");
        }
      } else {
        const success = await addBookmark(episodeId);
        if (success) {
          setIsBookmarked(true);
          toast.success("Episode added to bookmarks!");
        } else {
          toast.error("Failed to add bookmark");
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Something went wrong");
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Memoize episode data to prevent unnecessary recalculations
  const episodeData = useMemo(() => {
    if (!podcast || !episodeId) return null;
    return podcast.episodes.find((ep) => ep.id === episodeId);
  }, [podcast, episodeId]);

  // Handle loading and error states
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Loader />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <IconButton
          icon={ArrowLeft01Icon}
          position="leftButton"
          onPress={() => router.back()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!podcast || !episodeData) {
    return (
      <SafeAreaView style={styles.container}>
        <IconButton
          icon={ArrowLeft01Icon}
          position="leftButton"
          onPress={() => router.back()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Episode not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const IMAGE = podcast?.coverImage;

  return (
    <SafeAreaView style={styles.container}>
      <IconButton
        icon={ArrowLeft01Icon}
        position="leftButton"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/(tabs)")
        }
      />
      <IconButton
        icon={CloudDownloadIcon}
        position="rightButton"
        onPress={() => {
          // Add download functionality here
        }}
      />
      <IconButton
        icon={isBookmarked ? Bookmark01Icon : BookmarkAdd01Icon}
        position="rightButton"
        right={theme.vw(25)}
        onPress={handleBookmarkToggle}
      />
      <View style={styles.diskContainer}>
        <Disk isPlaying={isPlaying} image={IMAGE} />
      </View>
      <Text style={styles.title}>{episodeData.title}</Text>
      <AudioPlayer
        id={`${episodeId}`}
        coverImage={IMAGE}
        title={episodeData.title}
        url={episodeData.hlsUrl}
        podcastId={podcastId}
      />
    </SafeAreaView>
  );
};

const madeStyles = makeStyles((theme) => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,
    diskContainer: {
      width: theme.vw(100),
      marginTop: theme.vh(8),
      flexDirection: "row",
      justifyContent: "center",
    } as ViewStyle,
    title: {
      fontSize: theme.fontSizes.medium,
      color: theme.colors.text,
      fontWeight: theme.fontWeights.bold,
      textAlign: "center",
      marginTop: theme.vh(3),
      paddingHorizontal: theme.vw(10),
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.vw(10),
    } as ViewStyle,
    errorText: {
      fontSize: theme.fontSizes.medium,
      color: theme.colors.text,
      textAlign: "center",
      fontFamily: theme.fontFamily.regular,
    } as TextStyle,
  };
});

export default EpisodePlay;
