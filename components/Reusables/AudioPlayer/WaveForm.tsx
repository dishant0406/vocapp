import React, { useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Child component for each bar
const WaveformBar = ({
  isPlayedAt,
  dragProgress,
  style,
  barStyle,
  playedBarStyle,
  unplayedBarStyle,
}: BarProps) => {
  const animatedBarStyle = useAnimatedStyle(() => ({
    backgroundColor:
      dragProgress.value >= isPlayedAt
        ? playedBarStyle?.backgroundColor || "#3498db"
        : unplayedBarStyle?.backgroundColor || "#95a5a6",
  }));
  return <Animated.View style={[style, barStyle, animatedBarStyle]} />;
};

type BarProps = {
  isPlayedAt: number;
  dragProgress: Animated.SharedValue<number>;
  style: ViewStyle;
  barStyle?: ViewStyle;
  playedBarStyle?: ViewStyle;
  unplayedBarStyle?: ViewStyle;
};

interface WaveformProps {
  data: number[];
  maxDuration?: number;
  currentProgress?: number;
  containerStyle?: ViewStyle;
  barStyle?: ViewStyle;
  playedBarStyle?: ViewStyle;
  unplayedBarStyle?: ViewStyle;
  barWidth?: number;
  barGap?: number;
  maxBarHeight?: number;
  minBarHeight?: number;
  barCount?: number;
  width?: number;
  setPosition?: (position: number) => void;
}

const Waveform: React.FC<WaveformProps> = ({
  data,
  maxDuration = 100,
  currentProgress = 0,
  containerStyle,
  barStyle,
  playedBarStyle,
  unplayedBarStyle,
  barWidth,
  barGap = 2,
  maxBarHeight = 50,
  minBarHeight = 5,
  barCount: explicitBarCount,
  width: explicitWidth,
  setPosition,
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(
    explicitWidth || 0
  );

  // Shared value for animated progress (in seconds)
  const dragProgress = useSharedValue(currentProgress);

  // Keep dragProgress in sync with currentProgress unless dragging
  useEffect(() => {
    if (
      typeof currentProgress === "number" &&
      typeof maxDuration === "number" &&
      maxDuration > 0
    ) {
      dragProgress.value = withTiming(currentProgress, { duration: 200 });
    }
  }, [currentProgress, maxDuration]);

  const handleLayout = (event: LayoutChangeEvent) => {
    if (!explicitWidth) {
      setContainerWidth(event.nativeEvent.layout.width);
    }
  };

  // Calculate number of bars that can fit in the container
  const calculatedBarCount = useMemo(() => {
    if (explicitBarCount) return explicitBarCount;
    if (!containerWidth) return Math.min(100, data.length);
    const effectiveBarWidth = barWidth || 3;
    const totalBarSpace = effectiveBarWidth + barGap;
    return Math.max(1, Math.floor(containerWidth / totalBarSpace));
  }, [containerWidth, explicitBarCount, barWidth, barGap, data.length]);

  // Effective bar width if not provided
  const effectiveBarWidth = useMemo(() => {
    if (barWidth) return barWidth;
    if (!containerWidth) return 3;
    return Math.max(
      1,
      (containerWidth - (calculatedBarCount - 1) * barGap) / calculatedBarCount
    );
  }, [barWidth, containerWidth, calculatedBarCount, barGap]);

  // Sample data to match bar count
  const sampledData = useMemo(() => {
    if (calculatedBarCount >= data.length) return data;
    const result: number[] = [];
    const step = data.length / calculatedBarCount;
    for (let i = 0; i < calculatedBarCount; i++) {
      const index = Math.min(Math.floor(i * step), data.length - 1);
      result.push(data[index]);
    }
    return result;
  }, [data, calculatedBarCount]);

  // Max amplitude for normalization
  const maxAmplitude = useMemo(() => {
    return Math.max(...sampledData, 0.01);
  }, [sampledData]);

  // Gesture handler for dragging on waveform
  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {},
    onActive: (event) => {
      if (!containerWidth || !maxDuration) return;
      let x = event.x;
      x = Math.max(0, Math.min(x, containerWidth));
      const progress = (x / containerWidth) * maxDuration;
      dragProgress.value = progress;
    },
    onEnd: () => {
      if (setPosition && typeof dragProgress.value === "number") {
        runOnJS(setPosition)(dragProgress.value);
      }
    },
  });

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        explicitWidth ? { width: explicitWidth } : undefined,
      ]}
      onLayout={handleLayout}
    >
      {/* Gesture handler overlay */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={StyleSheet.absoluteFill}
          pointerEvents="box-only"
        />
      </PanGestureHandler>
      {/* Bars: each one is an animated child component */}
      {containerWidth > 0 &&
        sampledData.map((amplitude, index) => {
          const normalizedHeight =
            minBarHeight +
            (amplitude / maxAmplitude) * (maxBarHeight - minBarHeight);

          // Each bar needs to know at what progress (seconds) it becomes "played"
          const barProgress = ((index + 1) / sampledData.length) * maxDuration;

          return (
            <WaveformBar
              key={`bar-${index}`}
              isPlayedAt={barProgress}
              dragProgress={dragProgress}
              style={{
                width: effectiveBarWidth,
                height: normalizedHeight,
                marginHorizontal: barGap / 2,
              }}
              barStyle={barStyle}
              playedBarStyle={playedBarStyle}
              unplayedBarStyle={unplayedBarStyle}
            />
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    paddingVertical: 5,
  },
  bar: {
    borderRadius: 1,
    backgroundColor: "#95a5a6",
  },
});

export default Waveform;
