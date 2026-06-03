import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { SceneAnimation } from '@/types/story';

type Props = {
  emoji: string;
  animation: SceneAnimation;
  index: number;
  size?: number;
};

export function AnimatedEmoji({ emoji, animation, index, size = 44 }: Props) {
  const offsetY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const delay = index * 100;
    const duration = 2000 + index * 180;

    switch (animation) {
      case 'bounce':
        offsetY.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withSpring(-18, { damping: 6, stiffness: 120 }),
              withTiming(0, { duration: duration * 0.4, easing: Easing.out(Easing.quad) }),
            ),
            -1,
            false,
          ),
        );
        scale.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(1.12, { duration: 200 }),
              withTiming(1, { duration: duration * 0.5 }),
            ),
            -1,
            false,
          ),
        );
        break;
      case 'twinkle':
        scale.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(1.25, { duration: 700, easing: Easing.out(Easing.quad) }),
              withTiming(0.82, { duration: 900, easing: Easing.in(Easing.quad) }),
            ),
            -1,
            true,
          ),
        );
        opacity.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(1, { duration: 600 }),
              withTiming(0.55, { duration: 800 }),
            ),
            -1,
            true,
          ),
        );
        break;
      case 'drift':
        offsetY.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(14, { duration, easing: Easing.inOut(Easing.sin) }),
              withTiming(-8, { duration, easing: Easing.inOut(Easing.sin) }),
            ),
            -1,
            true,
          ),
        );
        offsetX.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(16, { duration: duration * 1.2, easing: Easing.inOut(Easing.sin) }),
              withTiming(-16, { duration: duration * 1.2, easing: Easing.inOut(Easing.sin) }),
            ),
            -1,
            true,
          ),
        );
        rotate.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(12, { duration: duration * 1.4 }),
              withTiming(-10, { duration: duration * 1.4 }),
            ),
            -1,
            true,
          ),
        );
        break;
      case 'sway':
        offsetX.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(14, { duration, easing: Easing.inOut(Easing.sin) }),
              withTiming(-14, { duration, easing: Easing.inOut(Easing.sin) }),
            ),
            -1,
            true,
          ),
        );
        rotate.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(10, { duration: duration * 1.1 }),
              withTiming(-10, { duration: duration * 1.1 }),
            ),
            -1,
            true,
          ),
        );
        offsetY.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(-6, { duration: duration * 0.8 }),
              withTiming(4, { duration: duration * 0.8 }),
            ),
            -1,
            true,
          ),
        );
        break;
      case 'pulse':
        scale.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(1.18, { duration: 1100, easing: Easing.out(Easing.cubic) }),
              withTiming(0.92, { duration: 1100, easing: Easing.in(Easing.cubic) }),
            ),
            -1,
            true,
          ),
        );
        opacity.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(1, { duration: 900 }),
              withTiming(0.7, { duration: 900 }),
            ),
            -1,
            true,
          ),
        );
        break;
      case 'float':
      default:
        offsetY.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(-16, { duration, easing: Easing.inOut(Easing.sin) }),
              withTiming(6, { duration, easing: Easing.inOut(Easing.sin) }),
            ),
            -1,
            true,
          ),
        );
        offsetX.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(4, { duration: duration * 1.3 }),
              withTiming(-4, { duration: duration * 1.3 }),
            ),
            -1,
            true,
          ),
        );
        break;
    }
  }, [animation, index, offsetX, offsetY, opacity, rotate, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.wrap, style, { marginLeft: index * 10 }]}>
      <Text style={{ fontSize: size }}>{emoji}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 4,
  },
});
