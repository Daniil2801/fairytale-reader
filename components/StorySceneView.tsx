import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedEmoji } from '@/components/AnimatedEmoji';
import { SceneAmbientLayer } from '@/components/SceneAmbientLayer';
import { SparkleOverlay } from '@/components/SparkleOverlay';
import type { StoryScene } from '@/types/story';

type Props = {
  scene: StoryScene;
  /** Changes when the reader advances pages — retriggers entrance motion */
  pageKey: number;
};

export function StorySceneView({ scene, pageKey }: Props) {
  const shimmer = useSharedValue(0);
  const imageScale = useSharedValue(1);
  const gradientShift = useSharedValue(0);

  useEffect(() => {
    shimmer.value = 0;
    imageScale.value = 1;
    gradientShift.value = 0;

    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    imageScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    gradientShift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, [pageKey, gradientShift, imageScale, shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.12 + shimmer.value * 0.28,
  }));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.08 + gradientShift.value * 0.18,
  }));

  const showSparkles =
    scene.animation === 'twinkle' ||
    scene.animation === 'float' ||
    scene.animation === 'pulse';

  return (
    <Animated.View
      key={pageKey}
      entering={FadeIn.duration(420)}
      style={styles.container}>
      <LinearGradient
        colors={scene.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        {scene.imageUrl ? (
          <Animated.View style={[styles.imageWrap, imageStyle]}>
            <Image
              source={{ uri: scene.imageUrl }}
              style={styles.image}
              contentFit="cover"
              transition={500}
            />
          </Animated.View>
        ) : null}
        <Animated.View style={[styles.colorGlow, glowStyle]} />
        <Animated.View style={[styles.shimmer, shimmerStyle]} />
        <View style={styles.overlay} />

        <SceneAmbientLayer animation={scene.animation} />
        {showSparkles && <SparkleOverlay dense={scene.animation === 'twinkle'} />}

        <Animated.View entering={FadeInDown.delay(120).duration(500)} style={styles.emojiRow}>
          {scene.emojis.map((emoji, i) => (
            <AnimatedEmoji
              key={`${emoji}-${i}-${pageKey}`}
              emoji={emoji}
              animation={scene.animation}
              index={i}
              size={i === 0 ? 56 : 42}
            />
          ))}
        </Animated.View>
        {scene.momentLabel ? (
          <Animated.View
            entering={FadeInDown.delay(220).duration(450)}
            style={styles.captionWrap}>
            <Text style={styles.caption} numberOfLines={2}>
              {scene.momentLabel}
            </Text>
          </Animated.View>
        ) : null}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    minHeight: 220,
    shadowColor: '#6B4CE6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 8,
  },
  gradient: {
    minHeight: 220,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  imageWrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.58,
  },
  colorGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fbbf24',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(45, 38, 64, 0.22)',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: 24,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  captionWrap: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    zIndex: 2,
  },
  caption: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
