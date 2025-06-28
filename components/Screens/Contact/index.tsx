import Header from "@/components/Reusables/Header";
import MiniAudioPlayer from "@/components/Reusables/MiniPlayer";
import { CONTACT_US } from "@/utils/constants";
import { useAudioPlayerState } from "@/utils/hooks/audioEvents";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
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
  const termsData = CONTACT_US || {
    title: "Contact Us",
    sections: [
      {
        title: "Get in Touch",
        content: [
          "We'd love to hear from you! If you have any questions, feedback, or support needs, please don't hesitate to reach out to us.",
        ],
      },
      {
        title: "Support Hours",
        content: [
          "Our support team is available Monday through Friday, 9:00 AM to 6:00 PM EST.",
        ],
      },
      {
        title: "Connect With Us",
        content: [
          "Follow us on social media for updates, tips, and more information about our services.",
        ],
      },
    ],
    contactEmail: "support@vocapp.live",
    companyName: "Vocapp",
  };

  return (
    <SafeAreaView style={styles.container}>
      <MiniAudioPlayer />
      <Header title={termsData.title} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
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
      paddingTop: theme.statusBarHeight,
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
