import { Button } from "@/components/Micro/Button";
import Input from "@/components/Micro/Input";
import handleApiCall from "@/utils/api/apiHandler";
import { addEpisodeToPodcast } from "@/utils/api/calls";
import useDashboardStore from "@/utils/store/dashboardStore";
import { makeStyles, useTheme } from "@/utils/theme/useTheme";
import { toast } from "@backpackapp-io/react-native-toast";
import React, { ForwardedRef, forwardRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import Tags from "../Tags";

type CreateSheetProps = {
  podcastId: string;
};

const DURATION_OPTIONS = [
  { value: "30 minute", id: "30" },
  { value: "1 hour", id: "60" },
  { value: "2 hours", id: "120" },
];

const CreateEpisodeSheet = forwardRef(
  ({ podcastId }: CreateSheetProps, ref: ForwardedRef<ActionSheetRef>) => {
    const { theme } = useTheme();
    const [topic, setTopic] = useState<string>("");
    const [selectedDuration, setSelectedDuration] = useState<string | null>(
      DURATION_OPTIONS[0].id
    );
    const { fetchDashboard } = useDashboardStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const styles = madeStyles(theme);

    const handleClose = () => {
      setTopic("");
      setSelectedDuration(DURATION_OPTIONS[0].id);
      if (ref && typeof ref === "object" && "current" in ref) {
        ref.current?.setModalVisible(false);
      }
    };

    const handleCreate = async () => {
      if (!selectedDuration) return;
      Keyboard.dismiss();

      const searchQuery = topic || ""; // Allow empty string for topic/query

      await handleApiCall(
        addEpisodeToPodcast,
        [podcastId, searchQuery, selectedDuration],
        {
          showErrorToast: true,
          onSuccess: () => {
            fetchDashboard();
            toast.success(
              "Episode creation started! We'll notify you when it's ready.",
              {
                duration: 1000,
              }
            );
            setTimeout(() => {
              handleClose();
            }, 500);
          },
          setLoading: setLoading,
          onError: (error, message, rawError) => {
            setError(error || "Failed to create episode");
          },
        }
      );
    };

    return (
      <ActionSheet
        onClose={handleClose}
        ref={ref}
        isModal={false}
        backgroundInteractionEnabled
        snapPoints={[100]}
        gestureEnabled
        closable={!loading}
        disableDragBeyondMinimumSnapPoint
        containerStyle={styles.sheetContainer}
        keyboardHandlerEnabled={false}
      >
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Add New Episode</Text>
          </View>
          <Input
            readOnly={loading}
            placeholder="Add a topic or leave empty"
            label="Something in mind? (Optional)"
            value={topic}
            onChange={(e) => setTopic(e.nativeEvent.text)}
          />
          <Text style={styles.label}>Duration</Text>
          <Tags
            items={DURATION_OPTIONS}
            tagStyle={styles.tag}
            selected={selectedDuration}
            setSelected={(value) => setSelectedDuration(value as string)}
            includeAllOption={false}
            isMultiSelect={false}
          />
          <Button
            style={styles.button}
            disabled={!selectedDuration || loading}
            textStyle={styles.label}
            onPress={handleCreate}
            variant="secondary"
            loading={loading}
          >
            Add Episode
          </Button>
        </View>
      </ActionSheet>
    );
  }
);

export default CreateEpisodeSheet;

const madeStyles = makeStyles((theme) => {
  return StyleSheet.create({
    sheetContainer: {
      paddingTop: theme.vh(2),
      paddingBottom: theme.vh(2),
      paddingHorizontal: theme.vw(6),
      borderTopLeftRadius: theme.vw(10),
      borderTopRightRadius: theme.vw(10),
      backgroundColor: theme.colors.tint,
    } as ViewStyle,
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.vh(3),
      marginTop: theme.vh(1),
    } as ViewStyle,
    title: {
      fontSize: theme.fontSizes.mediumSmall,
      color: theme.colors.text,
      fontWeight: theme.fontWeights.bold,
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
    tag: {
      borderColor: theme.colors.tag,
      borderWidth: 1,
    } as ViewStyle,
    label: {
      fontSize: theme.vw(4),
      fontWeight: "500",
      color: theme.colors.foreground,
      marginBottom: theme.vh(1),
      marginTop: theme.vh(1),
    },
    button: {
      width: "100%",
      height: theme.vh(7),
      marginTop: theme.vh(4),
      borderRadius: theme.vw(10),
      backgroundColor: theme.colors.background,
    },
  });
});
