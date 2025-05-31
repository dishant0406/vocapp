import Cover from "@/components/Reusables/Cover";
import IconButton from "@/components/Reusables/IconButton";
import Loader from "@/components/Reusables/Loader";
import NoData from "@/components/Reusables/NoData"; // Added import
import handleApiCall from "@/utils/api/apiHandler";
import {
  getMostViewedPodcastsPaginated,
  getRecentPodcastsPaginated,
  searchPodcasts,
} from "@/utils/api/calls";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { Podcast } from "@/utils/types/podcast"; // Ensure Podcast type is imported
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

enum SortType {
  RECENT = "recent",
  MOST_VIEWED = "most-viewed",
  SEARCH = "search",
}

const getTitle = (sortType: SortType, searchQuery?: string) => {
  switch (sortType) {
    case SortType.RECENT:
      return "Recent Podcasts";
    case SortType.MOST_VIEWED:
      return "Most Viewed Podcasts";
    case SortType.SEARCH:
      return searchQuery
        ? `Results for "${
            searchQuery?.length > 10
              ? `${searchQuery.slice(0, 10)}...`
              : searchQuery
          }"`
        : "Search Results";
    default:
      return "Podcasts";
  }
};

const getPodcastFunction = (sortType: SortType): any => {
  // Added explicit any for now, can be refined
  switch (sortType) {
    case SortType.RECENT:
      return getRecentPodcastsPaginated;
    case SortType.MOST_VIEWED:
      return getMostViewedPodcastsPaginated;
    case SortType.SEARCH:
      return searchPodcasts;
    default:
      return getRecentPodcastsPaginated;
  }
};

const Podcasts = () => {
  const params = useLocalSearchParams();
  const sortType = (
    Object.values(SortType).includes(params?.sort as SortType)
      ? params.sort
      : SortType.RECENT
  ) as SortType;
  const query = (params?.query || "") as string;
  const { theme } = useTheme();
  const router = useRouter();
  const styles = madeStyles(theme);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const getData = (page: number) => {
    const apiFunc = getPodcastFunction(sortType);
    const apiArgs =
      sortType === SortType.SEARCH ? [query, page, 10] : [page, 10];

    handleApiCall(apiFunc, apiArgs, {
      onSuccess: (data) => {
        const newPodcastsData: Podcast[] = data?.data?.data || data?.rows || [];
        const updatedPodcasts =
          page === 1 ? newPodcastsData : [...podcasts, ...newPodcastsData];

        const uniquePodcasts = updatedPodcasts.filter(
          (podcast: Podcast, index: number, self: Podcast[]) =>
            index === self.findIndex((p: Podcast) => p.id === podcast.id)
        );
        setPodcasts(uniquePodcasts);
        setPageNumber(page);
        setIsRefreshing(false);
      },
      onError: () => {
        setIsRefreshing(false);
      },
      setLoading,
    });
  };

  useEffect(() => {
    setPodcasts([]);
    setPageNumber(1);
    getData(1);
  }, [sortType, query]);

  if (loading && podcasts?.length < 1) {
    return <Loader />;
  }

  if (!loading && podcasts?.length < 1) {
    // Added condition for NoData
    return <NoData />;
  }

  const onRefresh = () => {
    setIsRefreshing(true);
    setPodcasts([]);
    setPageNumber(1);
    getData(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <IconButton
        icon={ArrowLeft01Icon}
        position="leftButton"
        onPress={() => router.back()}
      />
      <View style={styles.header}>
        <Text style={styles.title}>{getTitle(sortType, query)}</Text>
      </View>
      {podcasts.length === 0 ? ( // Check if podcasts array is empty
        <NoData /> // Render NoData component
      ) : (
        <FlatList
          refreshControl={
            // Add RefreshControl
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          data={podcasts}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <Cover
              id={item.id}
              title={item.title}
              imageUrl={item.coverImage}
              duration={item.averageDuration}
            />
          )}
          numColumns={2}
          onEndReachedThreshold={0.5}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: theme.vw(6),
          }}
          onEndReached={() => {
            if (podcasts.length > 0) {
              getData(pageNumber + 1);
            }
          }}
        />
      )}
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
    marginLeft: theme.vw(22),
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
}));

export default Podcasts;
