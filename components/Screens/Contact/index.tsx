import MiniAudioPlayer from "@/components/Reusables/MiniPlayer";
import { CONTACT_US } from "@/utils/constants";
import { useAudioPlayerState } from "@/utils/hooks/audioEvents";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { ArrowLeft, Mail01 } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const ContactUs = () => {
  const { theme } = useTheme();
  const { currentTrack, isPlaying } = useAudioPlayerState();
  const styles = madeStyles(theme, { isPlaying: !!currentTrack?.url });
  const router = useRouter();

  // Default values in case imports fail
  const contactData = CONTACT_US || {
    title: "Contact Us",
    sections: [
      {
        title: "General Inquiries",
        content: ["Email: info@vocapp.live", "Website: https://vocapp.live"],
      },
    ],
    contactEmail: "info@vocapp.live",
    website: "https://vocapp.live",
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    // In a real app, you would send this data to your server
    Alert.alert(
      "Message Sent",
      "Thank you for contacting us. We'll get back to you soon.",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <MiniAudioPlayer />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <HugeiconsIcon
            icon={ArrowLeft}
            color={theme.colors.text}
            size={theme.vw(6)}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{contactData.title}</Text>
        <View style={styles.placeholderView} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {contactData.sections ? (
            contactData.sections.map((section, index) => (
              <View key={index} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.content?.map((paragraph, pIndex) => (
                  <Text key={pIndex} style={styles.paragraph}>
                    {paragraph}
                  </Text>
                ))}
              </View>
            ))
          ) : (
            <View style={styles.section}>
              <Text style={styles.paragraph}>
                Contact information is currently unavailable. Please check back
                later.
              </Text>
            </View>
          )}

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Send us a message</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={theme.colors.mutedForeground}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.messageInput]}
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message here"
                placeholderTextColor={theme.colors.mutedForeground}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <HugeiconsIcon
                icon={Mail01}
                color={theme.colors.primaryForeground}
                size={theme.vw(5)}
              />
              <Text style={styles.submitButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contactInfoContainer}>
            <Text style={styles.contactInfoText}>
              Email:{" "}
              <Text style={styles.highlightText}>
                {CONTACT_US?.contactEmail || "info@vocapp.live"}
              </Text>
            </Text>
            <Text style={styles.contactInfoText}>
              Website:{" "}
              <Text style={styles.highlightText}>
                {CONTACT_US?.website || "https://vocapp.live"}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ContactUs;

const madeStyles = makeStyles(
  (theme, { isPlaying }: { isPlaying: boolean } = { isPlaying: false }) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,
    keyboardView: {
      flex: 1,
    } as ViewStyle,
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.vw(4),
      paddingVertical: theme.vh(2),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
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
    formContainer: {
      marginTop: theme.vh(2),
      marginBottom: theme.vh(4),
      padding: theme.vw(4),
      backgroundColor: theme.colors.card,
      borderRadius: theme.vw(3),
      borderWidth: 1,
      borderColor: theme.colors.border,
    } as ViewStyle,
    formTitle: {
      fontSize: theme.fontSizes.mediumSmall,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.vh(3),
    } as TextStyle,
    inputContainer: {
      marginBottom: theme.vh(3),
    } as ViewStyle,
    label: {
      fontSize: theme.fontSizes.small,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.vh(1),
    } as TextStyle,
    input: {
      backgroundColor: theme.colors.input,
      borderRadius: theme.vw(2),
      padding: theme.vw(3),
      fontSize: theme.fontSizes.small,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text,
    } as ViewStyle,
    messageInput: {
      height: theme.vh(15),
    } as ViewStyle,
    submitButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.vw(2),
      padding: theme.vw(3),
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      marginTop: theme.vh(2),
    } as ViewStyle,
    submitButtonText: {
      color: theme.colors.primaryForeground,
      fontSize: theme.fontSizes.small,
      fontFamily: theme.fontFamily.medium,
      marginLeft: theme.vw(2),
    } as TextStyle,
    contactInfoContainer: {
      marginTop: theme.vh(2),
      padding: theme.vw(4),
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.vw(3),
    } as ViewStyle,
    contactInfoText: {
      fontSize: theme.fontSizes.small,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text,
      marginBottom: theme.vh(1),
    } as TextStyle,
    highlightText: {
      color: theme.colors.tsprimary,
      fontFamily: theme.fontFamily.medium,
    } as TextStyle,
  })
);
