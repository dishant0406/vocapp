import Header from "@/components/Reusables/Header";
import { signOut } from "@/utils/api/auth";
import { USER_AVATAR_IMAGE } from "@/utils/constants";
import { useAudioPlayerControls } from "@/utils/hooks/audioEvents";
import useUserStore from "@/utils/store/userStore";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import {
  AlertSquareIcon,
  ArrowRight01Icon,
  Login03Icon,
  Message01Icon,
  PodcastIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React from "react";
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

type OptionProps = {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  data?: string | number;
};

const Option = ({ icon, title, onPress, data }: OptionProps) => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.option}
    >
      <View style={styles.optionIconContainer}>
        <HugeiconsIcon
          icon={icon}
          color={theme.colors.text}
          style={styles.optionIcon}
          size={theme.vw(8)}
        />
        <Text style={styles.optionText}>{title}</Text>
      </View>
      {!data && (
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          color={theme.colors.text}
          style={styles.optionIcon}
          size={theme.vw(8)}
        />
      )}
      {data && (
        <Text style={[styles.optionText, { paddingRight: theme.vw(2) }]}>
          {typeof data === "number" ? data.toString() : data}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const Profile = () => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  const { userProfile } = useUserStore();
  const { reset } = useAudioPlayerControls();
  const router = useRouter();

  const generationLeft =
    (userProfile?.podcastLimit || 0) - (userProfile?.podcastsGenerated || 0) ||
    0;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />

      <View style={styles.screenContainer}>
        <View style={styles.header}>
          <View style={styles.textContainer}>
            <Image
              source={{
                uri: USER_AVATAR_IMAGE + userProfile?.name,
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.title}>
                {userProfile?.name || "User Name"}
              </Text>
              <Text style={styles.subTitle}>{userProfile?.email || ""}</Text>
            </View>
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <Option
            icon={PodcastIcon}
            title={"Podcast Limit"}
            onPress={() => {}}
            data={`${generationLeft || 0} / ${userProfile?.podcastLimit || 0}`}
          />
          {/* <Option
            icon={Settings04Icon}
            title="App Settings"
            onPress={() => {}}
          /> */}
          {/* <Option
            icon={Share07Icon}
            title="Invite Friends"
            onPress={() => {}}
          /> */}
          <Option
            icon={Message01Icon}
            title="Contact Us"
            onPress={() => router.push("/contact")}
          />
          <Option
            icon={AlertSquareIcon}
            title="Terms and Conditions"
            onPress={() => router.push("/terms")}
          />
          <Option
            icon={Login03Icon}
            title="Logout"
            onPress={async () => {
              const signout = await signOut();
              if (signout.status === "OK") {
                router.dismissAll();
                reset();
                router.replace("/auth");
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const madeStyles = makeStyles((theme) => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: theme.statusBarHeight,
    } as ViewStyle,

    screenContainer: {
      paddingHorizontal: theme.vw(4),
    },
    avatar: {
      width: theme.vw(13),
      height: theme.vw(13),
      borderRadius: theme.vw(13),
    } as ImageStyle,
    header: {
      padding: theme.vw(4),
      backgroundColor: theme.colors.tint,
      width: "100%",
      borderRadius: theme.vw(4),
      justifyContent: "space-between",
    } as ViewStyle,
    title: {
      color: theme.colors.text,
      fontSize: theme.fontSizes.mediumSmall,
      fontWeight: theme.fontWeights.bold,
      fontFamily: theme.fontFamily.medium,
    } as TextStyle,
    textContainer: {
      flexDirection: "row",
      gap: theme.vw(4),
      alignItems: "center",
    } as ViewStyle,
    subTitle: {
      color: theme.colors.mutedForeground,
      fontSize: theme.fontSizes.small,
      fontFamily: theme.fontFamily.regular,
      marginTop: theme.vh(0.5),
    } as TextStyle,
    optionsContainer: {
      marginTop: theme.vh(2),
      width: "100%",
    } as ViewStyle,
    option: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.vh(2),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingTop: theme.vh(3),
      paddingHorizontal: theme.vw(2),
    } as ViewStyle,
    optionIconContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.vh(2),
    } as ViewStyle,
    optionIcon: {
      color: theme.colors.mutedForeground,
    } as TextStyle,
    optionText: {
      color: theme.colors.text,
      fontSize: theme.fontSizes.mediumSmall,
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
  };
});
