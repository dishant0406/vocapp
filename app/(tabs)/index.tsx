import Loader from "@/components/Reusables/Loader";
import MiniAudioPlayer from "@/components/Reusables/MiniPlayer";
import PodcastSection from "@/components/Reusables/PodcastSection";
import Search from "@/components/Reusables/Search";
import Tags from "@/components/Reusables/Tags";
import { signOut } from "@/utils/api/auth";
import { useAudioPlayerState } from "@/utils/hooks/audioEvents";
import useDashboardStore from "@/utils/store/dashboardStore"; // Import the new store
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import {
  PodcastApiResponse,
  PodcastWithPlayCountApiResponse,
  TopicApiResponse,
} from "@/utils/types/dashboard";
import {
  Episode as EpisodeModel,
  Podcast as PodcastModel,
  Topic as TopicModel,
  User as UserModel,
} from "@/utils/types/podcast";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react"; // Import useCallback
import {
  Image,
  ImageStyle,
  RefreshControl,
  SafeAreaView,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const HomeScreen = () => {
  const { theme } = useTheme();
  const { currentTrack } = useAudioPlayerState();
  const { dashboardData, fetchDashboard } = useDashboardStore(); // Use the store

  const styles = madeStyles(theme, {
    isPlaying: currentTrack?.url ? true : false,
  });
  const router = useRouter();
  // const [data, setData] = useState<DashboardDataApiResponse | null>(null); // Remove this line
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // State for RefreshControl

  const transformToPodcastModel = (
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
      averageDuration: podcast.averageDuration || 0, // Default value, Cover component handles 0 or undefined
      schedule: null,
      episodes: [] as EpisodeModel[],
      topics: [] as TopicModel[],
      user: defaultUser,
    };
  };

  const transformToTopicModel = (topic: TopicApiResponse) => {
    return {
      id: topic.id,
      value: topic.name,
    };
  };

  const handleSignout = async () => {
    const data = await signOut();
    if (data.status === "OK") {
      router.replace("/auth");
    }
  };

  useEffect(() => {
    fetchDashboard(); // Call fetchDashboard from the store
  }, [fetchDashboard]);

  const onRefresh = useCallback(async () => {
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
          <Text style={styles.title}>Hey Dishant! 👋</Text>
          <Text style={styles.subtitle}>Listen to your favorite podcasts.</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={handleSignout}>
          <Image
            source={{
              uri: "https://api.dicebear.com/9.x/dylan/png?seed=Dishant",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
      <Search />
      <ScrollView
        style={styles.scrollAreaView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          // Add RefreshControl
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.tagsContainer}>
          <Tags
            includeAllOption={true}
            setSelected={(tag) => setSelectedTag(tag as string)}
            selected={selectedTag}
            items={dashboardData.allTopics.map(transformToTopicModel)} // Use dashboardData from the store
          />
        </View>
        {dashboardData.recentPodcasts &&
          dashboardData.recentPodcasts.length > 0 && ( // Use dashboardData from the store
            <PodcastSection
              title="Recent Podcasts"
              podcasts={dashboardData.recentPodcasts.map(
                transformToPodcastModel
              )} // Use dashboardData from the store
            />
          )}
        {dashboardData.mostViewedPodcasts &&
          dashboardData.mostViewedPodcasts.length > 0 && ( // Use dashboardData from the store
            <PodcastSection
              title="Most Viewed Podcasts"
              podcasts={dashboardData.mostViewedPodcasts.map(
                transformToPodcastModel
              )} // Use dashboardData from the store
            />
          )}
      </ScrollView>
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
      marginBottom: theme.vh(isPlaying ? 7 : 0),
    } as ViewStyle,
    header: {
      padding: theme.vw(4),
      flexDirection: "row",
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
    tagsContainer: {
      paddingHorizontal: theme.vw(4),
      marginTop: theme.vh(2),
    } as ViewStyle,
  })
);
