import { ENV } from "@/constants/variables";
import { toast } from "@backpackapp-io/react-native-toast";
import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import { Router } from "expo-router";
import SuperTokens from "supertokens-react-native";
import { apiClient } from "../api/client";

export const performGoogleSignIn = async (
  router: Router,
  fetchUserProfile: () => Promise<void>,
  setLoading: (loading: boolean) => void
): Promise<boolean> => {
  GoogleSignin.configure({
    webClientId: ENV.GOOGLE_WEB_CLIENT_ID,
    iosClientId: ENV.GOOGLE_IOS_CLIENT_ID,
    offlineAccess: true,
  });

  setLoading(true);

  try {
    // Check if user is currently signed in and sign them out first
    // This forces the account selection dialog to appear
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await GoogleSignin.signOut();
    }

    // Attempt to sign in the user with Google
    await GoogleSignin.hasPlayServices();

    const user = await GoogleSignin.signIn();

    const response = await fetch(ENV.AUTH_APP_DOMAIN + "/auth/signinup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        thirdPartyId: "google",
        redirectURIInfo: {
          redirectURIOnProviderDashboard:
            "http://localhost:3000/auth/callback/google", // this value doesn't matter cause it's mobile login, and Google doesn't check it, but our APIs need some value for it.
          redirectURIQueryParams: {
            code: user.serverAuthCode,
          },
        },
      }),
    });

    if (response.status !== 200) {
      const errorResponse = await response.json();
      throw new Error(
        `Error in response: ${response.status} - ${errorResponse.message}`
      );
    }

    SuperTokens.addAxiosInterceptors(apiClient);
    await fetchUserProfile();
    router.replace("/(tabs)");
    return true;
  } catch (e) {
    const error = await e;
    console.log(
      "Google sign in failed with error",
      JSON.stringify(error, null, 2)
    );
    toast.error("Failed to sign in with Google. Please try again later.", {
      duration: 5000,
    });
    return false;
  } finally {
    setLoading(false);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userInfo = await GoogleSignin.getCurrentUser();
    return userInfo;
  } catch (error) {
    console.error("Failed to get Google user info:", error);
    return null;
  }
};
