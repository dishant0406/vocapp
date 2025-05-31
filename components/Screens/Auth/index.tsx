import { Button } from "@/components/Micro/Button";
import { AUTH_IMAGE_URL } from "@/constants/variables";
import { performGoogleSignIn } from "@/utils/auth/google";
import useUserStore from "@/utils/store/userStore";
import { makeStyles, useTheme } from "@/utils/theme/useTheme";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import {
  Image,
  ImageStyle,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

const statusBarHeight = Constants.statusBarHeight;

const Auth = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = madeStyles(theme);
  const { fetchUserProfile } = useUserStore();
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: AUTH_IMAGE_URL,
          }}
        />
      </View>
      <Text style={styles.title}>
        Let&apos;s get started with your first podcast!
      </Text>
      <View style={styles.loginContainer}>
        <View style={styles.login}>
          <View>
            <Text style={styles.loginText}>Sign in to your account</Text>
            <Text style={styles.loginSubText}>
              Start listening to your favorite podcasts and discover new ones,
              or create your own podcast, just the way you like it.
            </Text>
          </View>
          <Button
            onPress={() => performGoogleSignIn(router, fetchUserProfile)}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Sign In with Google</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Auth;

const madeStyles = makeStyles((theme) => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,
    imageContainer: {
      paddingTop: theme.vh(5) + statusBarHeight,
      justifyContent: "center",
      alignItems: "center",
      width: theme.vw(100),
    } as ViewStyle,
    image: {
      width: theme.vw(70),
      height: theme.vw(70),
      resizeMode: "contain",
      transform: [
        {
          scale: theme.vw(0.4),
        },
      ],
    } as ImageStyle,
    title: {
      fontSize: theme.fontSizes.large,
      color: theme.colors.text,
      fontWeight: theme.fontWeights.bold,
      textAlign: "center",
      marginTop: theme.vh(6),
      paddingHorizontal: theme.vw(10),
      marginBottom: theme.vh(4),
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
    loginContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    } as ViewStyle,
    login: {
      width: theme.vw(100),
      height: "100%",
      backgroundColor: theme.colors.text,
      borderTopEndRadius: theme.vw(10),
      borderTopStartRadius: theme.vw(10),
      paddingTop: theme.vh(5),
      paddingBottom: theme.vh(5),
      paddingHorizontal: theme.vw(5),
      justifyContent: "space-between",
    } as ViewStyle,
    loginText: {
      fontSize: theme.fontSizes.largeSmall,
      color: theme.colors.background,
      fontWeight: theme.fontWeights.bold,
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
    loginSubText: {
      fontSize: theme.fontSizes.mediumSmall,
      color: theme.colors.background,
      opacity: 0.5,
      fontWeight: theme.fontWeights.medium,
      marginTop: theme.vh(1),
      marginBottom: theme.vh(2),
      fontFamily: theme.fontFamily.medium,
    } as TextStyle,
    loginButton: {
      width: "100%",
      height: theme.vh(8),
      borderRadius: theme.vw(10),
    } as ViewStyle,
    loginButtonText: {
      fontSize: theme.fontSizes.medium,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
  };
});
