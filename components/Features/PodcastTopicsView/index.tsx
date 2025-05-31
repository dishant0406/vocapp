import Cover from "@/components/Reusables/Cover";
import Loader from "@/components/Reusables/Loader";
import { NoDataLottie } from "@/components/Reusables/NoData";
import Tags from "@/components/Reusables/Tags";
import handleApiCall from "@/utils/api/apiHandler";
import { getPodcastsByTopics } from "@/utils/api/calls";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { TopicApiResponse } from "@/utils/types/dashboard";
import { Podcast as PodcastModel } from "@/utils/types/podcast";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
  ViewStyle,
} from "react-native";

// Props for the new component
interface PodcastTopicsViewProps {
  theme: any;
  isPlaying: boolean;
  allTopicsData: TopicApiResponse[];
  transformToTopicModel: (topic: TopicApiResponse) => {
    id: string;
    value: string;
  };
  transformToPodcastModel: (podcast: any) => PodcastModel;
  onSelectionChange: (hasSelection: boolean) => void;
}

const PodcastTopicsView: React.FC<PodcastTopicsViewProps> = ({
  isPlaying,
  allTopicsData,
  transformToTopicModel,
  transformToPodcastModel,
  onSelectionChange,
}) => {
  const { theme } = useTheme();
  const styles = madeComponentStyles(theme, { isPlaying });

  const [selectedTag, setSelectedTag] = useState<string | string[] | null>(
    null
  );
  const [podcasts, setPodcasts] = useState<PodcastModel[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchPodcastsHandler = useCallback(
    async (tags: string[], currentPage: number, isRefresh = false) => {
      if (currentPage === 1 && !isRefresh) {
        setIsLoading(true);
        setPodcasts([]);
      } else if (currentPage > 1) {
        setIsFetchingMore(true);
      }
      if (isRefresh) {
        setIsRefreshing(true);
        setPodcasts([]);
      }

      await handleApiCall(getPodcastsByTopics, [tags, currentPage, 10], {
        onSuccess: (data) => {
          const newPodcastsData: PodcastModel[] = (data?.rows || []).map(
            transformToPodcastModel
          );
          setPodcasts((prevPodcasts) =>
            currentPage === 1 || isRefresh
              ? newPodcastsData
              : [...prevPodcasts, ...newPodcastsData]
          );
          setTotalCount(data?.count || 0);
          setPage(currentPage);
        },
        onError: (errorCode, message) => {
          console.error(
            `Error fetching podcasts by topics: ${errorCode} - ${message}`
          );
          if (currentPage === 1 || isRefresh) setPodcasts([]);
        },
        final: () => {
          if (currentPage === 1 && !isRefresh) setIsLoading(false);
          if (currentPage > 1) setIsFetchingMore(false);
          if (isRefresh) setIsRefreshing(false);
        },
      });
    },
    [transformToPodcastModel]
  );

  useEffect(() => {
    const hasSelection =
      selectedTag && Array.isArray(selectedTag) && selectedTag.length > 0;
    onSelectionChange(Boolean(hasSelection));

    if (hasSelection) {
      setPage(1); // Reset page number
      fetchPodcastsHandler(selectedTag as string[], 1);
    } else {
      setPodcasts([]);
      setTotalCount(0);
      setPage(1);
    }
  }, [JSON.stringify(selectedTag), fetchPodcastsHandler, onSelectionChange]); // Modified dependency

  const onRefreshHandler = useCallback(() => {
    if (selectedTag && Array.isArray(selectedTag) && selectedTag.length > 0) {
      fetchPodcastsHandler(selectedTag as string[], 1, true);
    }
  }, [selectedTag, fetchPodcastsHandler]);

  const renderPodcastItem = ({ item }: { item: PodcastModel }) => {
    return (
      <Cover
        id={item.id}
        title={item.title}
        imageUrl={item.coverImage}
        duration={item.averageDuration}
      />
    );
  };

  const renderListFooter = () => {
    if (!isFetchingMore) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  const tagItems = allTopicsData.map(transformToTopicModel);
  const showPodcastList =
    selectedTag && Array.isArray(selectedTag) && selectedTag.length > 0;

  return (
    <View style={styles.componentContainer}>
      <View style={styles.tagsViewContainer}>
        <Tags
          includeAllOption={true}
          setSelected={(tagValue) =>
            setSelectedTag(tagValue as string | string[] | null)
          }
          selected={selectedTag}
          items={tagItems}
          isMultiSelect={true}
        />
      </View>

      {showPodcastList && (
        <>
          {isLoading && podcasts.length === 0 && (
            <View style={styles.miscContainer}>
              <Loader />
            </View>
          )}
          {!isLoading && podcasts.length === 0 && !isRefreshing && (
            <View style={styles.miscContainer}>
              <NoDataLottie />
            </View>
          )}
          {podcasts.length > 0 && (
            <FlatList
              data={podcasts}
              renderItem={renderPodcastItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              style={styles.flatListContainer}
              columnWrapperStyle={styles.columnWrapperStyle}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefreshHandler}
                />
              }
              onEndReached={() => {
                if (
                  !isFetchingMore &&
                  podcasts.length < totalCount &&
                  selectedTag &&
                  Array.isArray(selectedTag) &&
                  selectedTag.length > 0
                ) {
                  fetchPodcastsHandler(selectedTag as string[], page + 1);
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderListFooter}
            />
          )}
        </>
      )}
    </View>
  );
};

const madeComponentStyles = makeStyles(
  (theme, { isPlaying }: { isPlaying: boolean }) => ({
    componentContainer: {
      //   flex: 1, // Allows FlatList to scroll if it's the only content
    } as ViewStyle,
    miscContainer: {
      justifyContent: "center",
      alignItems: "center",
      height: theme.vh(40),
    },
    tagsViewContainer: {
      paddingHorizontal: theme.vw(4),
      marginTop: theme.vh(1),
      marginBottom: theme.vh(2),
    } as ViewStyle,
    flatListContainer: {
      paddingHorizontal: theme.vw(4),
      marginBottom: theme.vh(isPlaying ? 7 : 0),
    } as ViewStyle,
    columnWrapperStyle: {
      justifyContent: "space-between",
      paddingHorizontal: theme.vw(2),
    } as ViewStyle,
  })
);

export default PodcastTopicsView;
