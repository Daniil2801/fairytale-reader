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

import type { SceneAnimation } from '@/types/story';

const PARTICLE_COUNT = 10;

const SYMBOLS: Record<SceneAnimation, string[]> = {
  float: ['·', '◦', '·', '◦'],
  twinkle: ['✦', '✧', '★', '✦'],
  bounce: ['○', '◯', '○', '◯'],
  drift: ['🍃', '🍂', '💨', '🍃'],
  sway: ['~', '∿', '~', '∿'],
  pulse: ['✨', '·', '✨', '·'],
};

type Props = {
  animation: SceneAnimation;
};

function AmbientParticle({
  animation,
  index,
}: {
  animation: SceneAnimation;
  index: number;
}) {
  const symbols = SYMBOLS[animation];
  const symbol = symbols[index % symbols.length]!;
  const driftX = useSharedValue(0);
  const driftY = useSharedValue(0);
  const opacity = useSharedValue(0.25);

  const left = `${6 + (index * 9) % 88}%`;
  const top = `${8 + (index * 13) % 72}%`;
  const duration = 3200 + index * 280;

  useEffect(() => {
    const delay = index * 140;
    const horizontal = animation === 'drift' || animation === 'sway' ? 18 : 8;
    const vertical =
      animation === 'bounce' ? 22 : animation === 'pulse' ? 6 : 14;

    driftX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(horizontal, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(-horizontal, { duration, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
    driftY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-vertical, { duration: duration * 0.9, easing: Easing.inOut(Easing.quad) }),
          withTiming(vertical * 0.6, { duration: duration * 0.9, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.85, { duration: duration * 0.45 }),
          withTiming(0.2, { duration: duration * 0.55 }),
        ),
        -1,
        true,
      ),
    );
  }, [animation, driftX, driftY, duration, index, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: driftX.value },
      { translateY: driftY.value },
    ],
  }));

  return (
    <Animated.Text
      style={[
        styles.particle,
        style,
        { left, top } as { left: string; top: string },
        animation === 'drift' && styles.particleEmoji,
      ]}>
      {symbol}
    </Animated.Text>
  );
}

export function SceneAmbientLayer({ animation }: Props) {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <AmbientParticle key={i} animation={animation} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowRadius: 8,
  },
  particleEmoji: {
    fontSize: 18,
  },
});
