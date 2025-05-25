import Loader from "@/components/Reusables/Loader";
import MiniAudioPlayer from "@/components/Reusables/MiniPlayer";
import PodcastSection from "@/components/Reusables/PodcastSection";
import Search from "@/components/Reusables/Search";
import Tags from "@/components/Reusables/Tags";
import handleApiCall from "@/utils/api/apiHandler";
import { signOut } from "@/utils/api/auth";
import { getDashboardData } from "@/utils/api/calls";
import { useAudioPlayerState } from "@/utils/hooks/audioEvents";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import {
  DashboardDataApiResponse,
  PodcastApiResponse,
  PodcastWithPlayCountApiResponse,
  TopicApiResponse, // Added TopicApiResponse
} from "@/utils/types/dashboard";
import {
  Episode as EpisodeModel,
  Podcast as PodcastModel,
  Topic as TopicModel,
  User as UserModel,
} from "@/utils/types/podcast";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageStyle,
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

  const styles = madeStyles(theme, {
    isPlaying: currentTrack?.url ? true : false,
  });
  const router = useRouter();
  const [data, setData] = useState<DashboardDataApiResponse | null>(null);

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
      averageDuration: 0, // Default value, Cover component handles 0 or undefined
      schedule: null,
      episodes: [] as EpisodeModel[],
      topics: [] as TopicModel[],
      user: defaultUser,
    };
  };

  const transformToTopicModel = (topic: TopicApiResponse): TopicModel => {
    return {
      ...topic,
      podcast_topic: {}, // Add default empty object for podcast_topic
    };
  };

  const handleSignout = async () => {
    const data = await signOut();
    if (data.status === "OK") {
      router.replace("/auth");
    }
  };

  useEffect(() => {
    (async () => {
      handleApiCall(getDashboardData, [], {
        onSuccess: (responseData) => {
          setData(responseData.data);
        },
      });
    })();
  }, []);

  if (!data) {
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
      >
        <Tags topics={data.allTopics.map(transformToTopicModel)} />
        {data.recentPodcasts && data.recentPodcasts.length > 0 && (
          <PodcastSection
            title="Recent Podcasts"
            podcasts={data.recentPodcasts.map(transformToPodcastModel)}
          />
        )}
        {data.mostViewedPodcasts && data.mostViewedPodcasts.length > 0 && (
          <PodcastSection
            title="Most Viewed Podcasts"
            podcasts={data.mostViewedPodcasts.map(transformToPodcastModel)}
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
      marginBottom: theme.vh(isPlaying ? 14 : 7),
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
  })
);
