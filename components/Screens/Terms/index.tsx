import IconButton from "@/components/Reusables/IconButton";
import MiniAudioPlayer from "@/components/Reusables/MiniPlayer";
import { TERMS_AND_CONDITIONS } from "@/utils/constants";
import { useAudioPlayerState } from "@/utils/hooks/audioEvents";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

const TermsAndConditions = () => {
  const { theme } = useTheme();
  const { currentTrack } = useAudioPlayerState();
  const styles = madeStyles(theme, { isPlaying: !!currentTrack?.url });
  const router = useRouter();

  // Default values in case imports fail
  const termsData = TERMS_AND_CONDITIONS || {
    title: "Terms & Conditions",
    lastUpdated: "June 15, 2025",
    sections: [
      {
        title: "Terms",
        content: ["Please check back later for our terms and conditions."],
      },
    ],
    contactEmail: "info@vocapp.live",
    companyName: "Vocapp Technologies Pvt. Ltd.",
  };

  return (
    <SafeAreaView style={styles.container}>
      <MiniAudioPlayer />
      <View style={styles.header}>
        <IconButton
          icon={ArrowLeft01Icon}
          position="leftButton"
          top={theme.vh(1)}
          left={theme.vw(3)}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>{termsData.title}</Text>
        <View style={styles.placeholderView} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={styles.lastUpdated}>
          Last Updated: {termsData.lastUpdated}
        </Text>

        {termsData.sections &&
          termsData.sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.content &&
                section.content.map((paragraph, pIndex) => (
                  <Text key={pIndex} style={styles.paragraph}>
                    {paragraph}
                  </Text>
                ))}
            </View>
          ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactText}>
            For questions about these terms, contact us at{" "}
            <Text style={styles.emailText}>{termsData.contactEmail}</Text>
          </Text>
          <Text style={styles.companyText}>{termsData.companyName}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const madeStyles = makeStyles(
  (theme, { isPlaying }: { isPlaying: boolean } = { isPlaying: false }) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.vh(2),
      paddingBottom: theme.vh(3),
    } as ViewStyle,
    backButton: {
      padding: theme.vw(2),
    } as ViewStyle,
    headerTitle: {
      fontSize: theme.fontSizes.medium,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.text,
    } as TextStyle,
    placeholderView: {
      width: theme.vw(10),
    } as ViewStyle,
    scrollContainer: {
      padding: theme.vw(4),
      paddingBottom: theme.vh(isPlaying ? 10 : 6),
    } as ViewStyle,
    lastUpdated: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.mutedForeground,
      marginBottom: theme.vh(3),
      fontFamily: theme.fontFamily.regular,
    } as TextStyle,
    section: {
      marginBottom: theme.vh(4),
    } as ViewStyle,
    sectionTitle: {
      fontSize: theme.fontSizes.mediumSmall,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.vh(1.5),
    } as TextStyle,
    paragraph: {
      fontSize: theme.fontSizes.small,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text,
      lineHeight: theme.vh(3),
      marginBottom: theme.vh(1.5),
    } as TextStyle,
    contactSection: {
      marginTop: theme.vh(4),
      paddingTop: theme.vh(4),
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    } as ViewStyle,
    contactText: {
      fontSize: theme.fontSizes.small,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text,
      lineHeight: theme.vh(3),
    } as TextStyle,
    emailText: {
      color: theme.colors.tsprimary,
      fontFamily: theme.fontFamily.medium,
    } as TextStyle,
    companyText: {
      fontSize: theme.fontSizes.small,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
      marginTop: theme.vh(2),
    } as TextStyle,
  })
);

export default TermsAndConditions;
