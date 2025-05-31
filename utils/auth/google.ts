import { ENV } from "@/constants/variables";
import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import { Router } from "expo-router";
import SuperTokens from "supertokens-react-native";
import { apiClient } from "../api/client";

export const performGoogleSignIn = async (
  router: Router,
  fetchUserProfile: () => Promise<void>
): Promise<boolean> => {
  GoogleSignin.configure({
    webClientId: ENV.GOOGLE_WEB_CLIENT_ID,
    iosClientId: ENV.GOOGLE_IOS_CLIENT_ID,
  });

  try {
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
    console.error(
      "Google sign in failed with error",
      JSON.stringify(error, null, 2)
    );
  }

  return false;
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
