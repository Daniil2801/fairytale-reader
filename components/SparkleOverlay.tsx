import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  dense?: boolean;
};

const SPARKLE_COUNT_DEFAULT = 12;
const SPARKLE_COUNT_DENSE = 20;

function Sparkle({ index }: { index: number }) {
  const opacity = useSharedValue(0.2);
  const scale = useSharedValue(0.6);
  const left = `${8 + (index * 7) % 84}%`;
  const top = `${10 + (index * 11) % 55}%`;

  useEffect(() => {
    const delay = index * 180;
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) }),
          withTiming(0.15, { duration: 900, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 700 }),
          withTiming(0.5, { duration: 900 }),
        ),
        -1,
        false,
      ),
    );
  }, [index, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Text
      style={[
        styles.sparkle,
        style,
        { left, top } as { left: string; top: string },
      ]}>
      ✦
    </Animated.Text>
  );
}

export function SparkleOverlay({ dense = false }: Props) {
  const count = dense ? SPARKLE_COUNT_DENSE : SPARKLE_COUNT_DEFAULT;
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: count }, (_, i) => (
        <Sparkle key={i} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 14,
    color: '#fff',
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowRadius: 6,
  },
});
