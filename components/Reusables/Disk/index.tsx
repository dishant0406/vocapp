import { CD_IMAGE_URL } from "@/constants/variables"; // Assuming this path is correct
import { makeStyles } from "@/utils/theme/makeStyles"; // Assuming this path is correct
import { useTheme } from "@/utils/theme/useTheme"; // Assuming this path is correct
import React, { useEffect } from "react";
import { Image, ImageStyle, View, ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type DiskProps = {
  image: string;
  isPlaying?: boolean;
  speed?: number;
};

const Disk: React.FC<DiskProps> = ({ image, isPlaying = false, speed = 1 }) => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);

  // Determine disk size based on theme's viewport height unit
  const DISK_SIZE = theme.vh(35); // Example: 35% of viewport height

  // Shared value for animation progress (represents full rotations)
  const progress = useSharedValue(0);

  // Derived value to convert progress (rotations) into degrees
  const rotation = useDerivedValue(() => {
    // Use modulo to keep the visual rotation within 0-360 degrees
    // while progress can increase indefinitely for seamless looping
    return (progress.value * 360) % 360;
  });

  // Set up the animated style for rotation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  // Effect to control the animation based on isPlaying state
  useEffect(() => {
    // Define the animation configuration
    const animationConfig = {
      duration: 4000 / speed, // Adjust duration based on speed
      easing: Easing.linear, // Constant speed
    };

    if (isPlaying) {
      // --- Animation Start/Resume ---
      // Start a repeating animation.
      // Instead of animating *to* 1, we animate *to* the *next* full rotation
      // (current progress + 1) over the specified duration.
      // `withRepeat` handles the infinite looping seamlessly.
      // This ensures that when resuming, it continues smoothly from where it stopped.
      progress.value = withRepeat(
        withTiming(progress.value + 1, animationConfig),
        -1, // Repeat indefinitely
        false // Don't reverse direction
      );
    } else {
      // --- Animation Stop ---
      // Cancel any ongoing animation on the progress value.
      // The disk will stop at its current rotation.
      cancelAnimation(progress);
    }

    // --- Cleanup ---
    // Optional: Return a cleanup function to cancel animation
    // if the component unmounts or dependencies change while playing.
    return () => {
      cancelAnimation(progress);
    };
    // Note: Adding the cleanup function might be necessary depending on your app's
    // lifecycle, but it can sometimes cause issues if `isPlaying` toggles rapidly.
    // Test with and without it based on your needs.
  }, [isPlaying, speed, progress]); // Dependencies for the effect

  return (
    <Animated.View
      style={[
        styles.diskContainer,
        {
          width: DISK_SIZE,
          height: DISK_SIZE,
          borderRadius: DISK_SIZE / 2, // Make it a circle
        },
        animatedStyle, // Apply the rotation animation
      ]}
    >
      {/* Background Image (e.g., Album Art) */}
      <Image
        source={{ uri: image }}
        style={[
          styles.episodeImage,
          {
            width: DISK_SIZE,
            height: DISK_SIZE,
            borderRadius: DISK_SIZE / 2,
          },
        ]}
        // Optional: Add error handling for the image
        // onError={(e) => console.error("Error loading episode image:", e.nativeEvent.error)}
      />
      {/* Overlay Image (CD/Vinyl Look) */}
      <View
        style={[
          styles.diskImageContainer,
          {
            width: DISK_SIZE,
            height: DISK_SIZE,
            borderRadius: DISK_SIZE / 2,
          },
        ]}
      >
        {/* Center Hole/Label Image */}
        <Image
          // Ensure CD_IMAGE_URL is a valid URL or require path
          source={
            typeof CD_IMAGE_URL === "string"
              ? { uri: CD_IMAGE_URL }
              : CD_IMAGE_URL
          }
          style={styles.diskImage}
          // Optional: Add error handling
          // onError={(e) => console.error("Error loading CD image:", e.nativeEvent.error)}
        />
      </View>
    </Animated.View>
  );
};

export default Disk;

// Define styles using the makeStyles utility
const madeStyles = makeStyles((theme) => ({
  diskContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Needed for absolute positioning of children
    backgroundColor: "transparent", // Ensure container is transparent
    overflow: "hidden", // Hide parts of images extending beyond the circle
  } as ViewStyle,
  episodeImage: {
    position: "absolute", // Position underneath the disk overlay
    top: 0,
    left: 0,
  } as ImageStyle,
  diskImageContainer: {
    position: "absolute", // Position on top of the episode image
    top: 0,
    left: 0,
    justifyContent: "center", // Center the inner disk image
    alignItems: "center",
    backgroundColor: "transparent", // Ensure transparency
  } as ViewStyle, // Corrected type to ViewStyle as it's styling a View
  diskImage: {
    // Style for the small center image (CD hole/label)
    width: theme.vh(15), // Example: 15% of viewport height
    height: theme.vh(15),
    borderRadius: theme.vh(15) / 2, // Make it a circle
  } as ImageStyle,
}));
