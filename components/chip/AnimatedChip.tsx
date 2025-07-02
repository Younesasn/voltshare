import { SymbolView } from "expo-symbols";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  withSpring,
} from "react-native-reanimated";
import type { AnimatedChipProps } from "./Chip.types";
import { ThemedText } from "@/themes/ThemedText";

export const AnimatedChip = ({
  label,
  icon,
  isActive,
  onPress,
  activeIcon,
  activeColor,
}: AnimatedChipProps) => {
  const progress = useSharedValue<number>(isActive ? 1 : 0);
  const iconOpacity = useSharedValue<number>(isActive ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming<number>(isActive ? 1 : 0, { duration: 500 });
    iconOpacity.value = withTiming<number>(isActive ? 1 : 0.5, {
      duration: 500,
    });
  }, [isActive]);

  const animatedContainerStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      width: withSpring(isActive ? 140 : 50, {
        damping: 90,
        velocity: 2,
        stiffness: 180,
      }),

      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ["#333333", activeColor!]
      ),
    };
  });

  const animatedIconOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: iconOpacity.value,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        {
          translateX: withTiming(isActive ? 0 : -8, { duration: 200 }),
        },
      ],
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.chip, animatedContainerStyle]}>
        <Animated.View style={[animatedIconOpacityStyle]}>
          <SymbolView
            size={18}
            name={isActive && activeIcon ? activeIcon : icon}
            tintColor={"#FFFFFF"}
          />
        </Animated.View>
        {isActive && (
          <Animated.View>
            <Animated.View style={animatedTextStyle}>
              <Animated.Text>
                <ThemedText color="white">{label}</ThemedText>
              </Animated.Text>
            </Animated.View>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    paddingVertical: 15,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    gap: 10
  },
});
