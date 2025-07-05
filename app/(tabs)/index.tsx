import PodcastTopicsView from "@/components/Features/PodcastTopicsView";
import EpisodeCard from "@/components/Reusables/EpisodesSheet/EpisodeCard";
import Loader from "@/components/Reusables/Loader";
import MiniAudioPlayer from "@/components/Reusables/MiniPlayer";
import PodcastSection from "@/components/Reusables/PodcastSection";
import Search from "@/components/Reusables/Search";
import { USER_AVATAR_IMAGE } from "@/utils/constants";
import { useAudioPlayerState } from "@/utils/hooks/audioEvents";
import useDashboardStore from "@/utils/store/dashboardStore";
import useUserStore from "@/utils/store/userStore";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import {
  PodcastApiResponse,
  PodcastWithPlayCountApiResponse,
  TopicApiResponse,
} from "@/utils/types/dashboard";
import {
  Episode,
  Episode as EpisodeModel,
  Podcast as PodcastModel,
  User as UserModel,
} from "@/utils/types/podcast";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  ImageStyle,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const HomeScreen = () => {
  const { theme } = useTheme();
  const { currentTrack } = useAudioPlayerState();
  const { dashboardData, fetchDashboard } = useDashboardStore();
  const { userProfile } = useUserStore();

  const styles = madeStyles(theme, {
    isPlaying: currentTrack?.url ? true : false,
  });
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTopicPodcasts, setShowTopicPodcasts] = useState(false);
  // Remove isPolling state and just use the ref for tracking
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isScreenFocused = useRef(true); // Track whether screen is focused

  const transformToPodcastModel = useCallback(
    (
      podcast: PodcastApiResponse | PodcastWithPlayCountApiResponse
    ): PodcastModel => {
      const defaultUser: UserModel = {
        id: "",
        name: "",
        email: "",
        supertokensUserId: "",
        accountType: "free",
        podcastLimit: 0,
        podcastsGenerated: 0,
        createdAt: "",
        updatedAt: "",
      };
      return {
        ...podcast,
        averageDuration: podcast.averageDuration || 0,
        schedule: null,
        episodes: [] as EpisodeModel[],
        topics: (podcast as any).topics || [], // Ensure topics are passed if available
        user: defaultUser,
        title:
          (podcast as any).title || (podcast as any).name || "Untitled Podcast",
        coverImage:
          (podcast as any).coverImage || (podcast as any).imageUrl || "",
        description: (podcast as any).description || "",
        isMultiEpisode: (podcast as any).isMultiEpisode || false,
        userId: (podcast as any).userId || "",
        createdAt: (podcast as any).createdAt || new Date().toISOString(),
        updatedAt: (podcast as any).updatedAt || new Date().toISOString(),
      };
    },
    []
  );

  const transformToTopicModel = useCallback((topic: TopicApiResponse) => {
    return {
      id: topic.id,
      value:
        topic.name.charAt(0).toUpperCase() + topic.name.slice(1).toLowerCase(),
    };
  }, []);

  const handleProfileClick = async () => {
    router.push("/profile");
  };

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Add focus/blur effect to handle tab navigation
  useFocusEffect(
    useCallback(() => {
      console.log("Screen focused");
      isScreenFocused.current = true;

      // Start polling if needed and not already polling
      if (dashboardData?.hasGeneratingEpisodes && !pollingIntervalRef.current) {
        console.log(
          "Screen focused and episodes generating - starting polling"
        );
        pollingIntervalRef.current = setInterval(() => {
          console.log("Polling dashboard data (focus-based)...");
          fetchDashboard();
        }, 5000);
      }

      // Cleanup when screen loses focus - always stop polling when leaving the screen
      return () => {
        console.log("Screen blurred - stopping polling");
        isScreenFocused.current = false;
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      };
    }, [dashboardData?.hasGeneratingEpisodes, fetchDashboard])
  );

  // Single useEffect to handle polling based on hasGeneratingEpisodes
  useEffect(() => {
    // Only manage polling when screen is focused
    if (!isScreenFocused.current) return;

    // Clear existing interval
    if (pollingIntervalRef.current) {
      console.log("Clearing existing polling interval");
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Start new interval if episodes are generating
    if (dashboardData?.hasGeneratingEpisodes) {
      console.log("Episodes generating - starting polling");
      pollingIntervalRef.current = setInterval(() => {
        console.log("Polling dashboard data...");
        fetchDashboard();
      }, 5000);
    } else {
      console.log("Episodes not generating, no polling needed");
    }

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        console.log("Cleanup: Clearing polling interval");
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [dashboardData?.hasGeneratingEpisodes, fetchDashboard]);

  const onRefreshDashboard = useCallback(async () => {
    setIsRefreshing(true);
    await fetchDashboard();
    setIsRefreshing(false);
  }, [fetchDashboard]);

  if (!dashboardData) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <MiniAudioPlayer />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Hey {userProfile?.name?.split(" ")?.[0]}! 👋
          </Text>
          <Text style={styles.subtitle}>Listen to your favorite podcasts.</Text>
          {dashboardData?.hasGeneratingEpisodes && (
            <Text style={styles.generatingText}>
              Episodes are being generated... ⏳
            </Text>
          )}
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={handleProfileClick}>
          <Image
            source={{
              uri: USER_AVATAR_IMAGE + userProfile?.name,
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
      <Search />

      <PodcastTopicsView
        theme={theme}
        isPlaying={currentTrack?.url ? true : false}
        allTopicsData={dashboardData.allTopics || []}
        transformToTopicModel={transformToTopicModel}
        transformToPodcastModel={transformToPodcastModel}
        onSelectionChange={setShowTopicPodcasts} // Update state based on selection
      />

      {!showTopicPodcasts && (
        <ScrollView
          style={styles.scrollAreaView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefreshDashboard}
            />
          }
        >
          {!currentTrack?.url &&
            dashboardData?.recentlyPlayedEpisodes?.[0]?.id && (
              <View style={styles.recentContainer}>
                <Text style={styles.sectionTitle}>Recently Played</Text>
                <EpisodeCard
                  playIcon
                  link={`/podcast/${dashboardData.recentlyPlayedEpisodes[0].podcastId}/${dashboardData.recentlyPlayedEpisodes[0].id}`}
                  imageType="square"
                  noBackground
                  episode={
                    {
                      ...dashboardData.recentlyPlayedEpisodes[0],
                      description:
                        dashboardData.recentlyPlayedEpisodes[0].podcastTitle ||
                        "",
                    } as unknown as Episode
                  }
                  imageUrl={
                    dashboardData.recentlyPlayedEpisodes[0].coverImage || ""
                  }
                />
              </View>
            )}
          {dashboardData?.recentPodcasts &&
            dashboardData.recentPodcasts.length > 0 && (
              <PodcastSection
                link="/podcasts?sort=recent"
                title="Recent Podcasts"
                podcasts={dashboardData.recentPodcasts.map(
                  transformToPodcastModel
                )}
              />
            )}
          {dashboardData?.mostViewedPodcasts &&
            dashboardData.mostViewedPodcasts.length > 0 && (
              <PodcastSection
                link="/podcasts?sort=most-viewed"
                title="Most Viewed Podcasts"
                podcasts={dashboardData.mostViewedPodcasts.map(
                  transformToPodcastModel
                )}
              />
            )}
        </ScrollView>
      )}
      {/* Conditional rendering for FlatList or Loader/NoData moved to PodcastTopicsView */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const madeStyles = makeStyles(
  (
    theme,
    {
      isPlaying,
    }: {
      isPlaying: boolean;
    }
  ) => ({
    container: {
      flex: 1,
    } as ViewStyle,
    scrollAreaView: {
      // This style is now only for the dashboard ScrollView
      flex: 1, // Ensure it takes space when PodcastTopicsView doesn't show FlatList
      marginBottom: theme.vh(isPlaying ? 7 : 0),
    } as ViewStyle,
    header: {
      padding: theme.vw(4),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.vh(2),
    } as ViewStyle,
    recentContainer: {
      paddingHorizontal: theme.vw(4),
    } as ViewStyle,
    title: {
      fontSize: theme.fontSizes.medium,
      color: theme.colors.text,
      fontWeight: "bold",
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
    sectionTitle: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.text,
      fontWeight: theme.fontWeights.bold,
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
    subtitle: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.mutedForeground,
      marginTop: theme.vh(1),
      fontFamily: theme.fontFamily.regular,
    } as TextStyle,
    avatar: {
      width: theme.vw(13),
      height: theme.vw(13),
      borderRadius: theme.vw(13),
    } as ImageStyle,
    generatingText: {
      fontSize: theme.fontSizes.extraSmall || theme.fontSizes.small,
      color: theme.colors.primary,
      marginTop: theme.vh(0.5),
      fontFamily: theme.fontFamily.regular,
    } as TextStyle,
  })
);
