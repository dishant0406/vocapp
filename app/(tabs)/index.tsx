import PodcastSection from "@/components/Reusables/PodcastSection";
import Search from "@/components/Reusables/Search";
import Tags from "@/components/Reusables/Tags";
import { signOut } from "@/utils/api/auth";
import { PODCASTS, SELF_HELP_PODCASTS } from "@/utils/constants";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
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
import { ScrollView } from "react-native-gesture-handler";

const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  const router = useRouter();

  const handleSignout = async () => {
    const data = await signOut();
    if (data.status === "OK") {
      router.replace("/auth");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Search />
        <Tags />
        <PodcastSection podcasts={PODCASTS} title="Trending Podcasts" />
        <PodcastSection podcasts={SELF_HELP_PODCASTS} title="Recently Added" />
      </ScrollView>
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
}));

export default HomeScreen;
