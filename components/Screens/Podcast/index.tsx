import CreateEpisodeSheet from "@/components/Reusables/CreateEpisodeSheet";
import Duration from "@/components/Reusables/Duration";
import EpisodesSheet from "@/components/Reusables/EpisodesSheet";
import IconButton from "@/components/Reusables/IconButton";
import Loader from "@/components/Reusables/Loader";
import handleApiCall from "@/utils/api/apiHandler";
import { getPodcastById } from "@/utils/api/calls";
import useBookmarkStore from "@/utils/store/bookmarkStore";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { Podcast } from "@/utils/types/podcast";
import { toast } from "@backpackapp-io/react-native-toast";
import {
  AiMicIcon,
  ArrowLeft01Icon,
  Bookmark01Icon,
  BookmarkAdd01Icon,
} from "@hugeicons/core-free-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageStyle,
  ScrollView,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { ActionSheetRef } from "react-native-actions-sheet";

const SinglePodcast: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const sheetRef = useRef<ActionSheetRef>(null);

  // Bookmark functionality
  const { addBookmark, removeBookmark, isItemBookmarked, checkBookmarkStatus } =
    useBookmarkStore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    (async () => {
      handleApiCall(getPodcastById, [id], {
        onSuccess: (data) => {
          setPodcast(data);
        },
        onError: (error) => {
          console.error("Error fetching podcast:", error);
        },
      });
    })();
  }, [id]);

  // Check bookmark status when component mounts or podcast changes
  useEffect(() => {
    if (podcast?.id) {
      const checkStatus = async () => {
        const bookmarkStatus = await checkBookmarkStatus(podcast.id);
        setIsBookmarked(bookmarkStatus);
      };
      checkStatus();
    }
  }, [podcast?.id, checkBookmarkStatus]);

  const handleBookmarkToggle = async () => {
    if (!podcast?.id || bookmarkLoading) return;

    setBookmarkLoading(true);

    try {
      if (isBookmarked) {
        const success = await removeBookmark(podcast.id);
        if (success) {
          setIsBookmarked(false);
          toast.success("Removed from bookmarks!");
        } else {
          toast.error("Failed to remove bookmark");
        }
      } else {
        const success = await addBookmark(podcast.id);
        if (success) {
          setIsBookmarked(true);
          toast.success("Added to bookmarks!");
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

  if (!podcast) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: podcast?.coverImage }} style={styles.image} />
      <View style={styles.imageMask} />

      <IconButton
        icon={ArrowLeft01Icon}
        position="leftButton"
        onPress={() => router.back()}
      />

      <IconButton
        icon={isBookmarked ? Bookmark01Icon : BookmarkAdd01Icon}
        position="rightButton"
        right={theme.vw(25)}
        onPress={() => {
          if (!bookmarkLoading) {
            handleBookmarkToggle();
          }
        }}
      />
      <IconButton
        icon={AiMicIcon}
        position="rightButton"
        onPress={() => {
          sheetRef.current?.show();
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{podcast?.title}</Text>
        <View style={styles.durationContainer}>
          <Duration duration={podcast?.averageDuration} />
        </View>
        <Text numberOfLines={5} style={styles.desc}>
          {podcast?.description || "No description available."}
        </Text>
        <EpisodesSheet podcast={podcast} />
      </ScrollView>
      <CreateEpisodeSheet podcastId={podcast?.id} ref={sheetRef} />
    </View>
  );
};

export default SinglePodcast;

const madeStyles = makeStyles((theme) => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,
    image: {
      width: theme.vw(100),
      height: theme.vh(40),
      borderBottomLeftRadius: theme.vw(10),
      borderBottomRightRadius: theme.vw(10),
    } as ImageStyle,
    imageMask: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: theme.vh(40),
      backgroundColor: theme.colors.background,
      opacity: 0.2,
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
    desc: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.mutedForeground,
      textAlign: "center",
      marginTop: theme.vh(2),
      paddingHorizontal: theme.vw(5),
      fontFamily: theme.fontFamily.regular,
      lineHeight: theme.vh(2.5),
      letterSpacing: 0.3,
    } as TextStyle,
    durationContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: theme.vh(0.5),
    } as ViewStyle,
  };
});
