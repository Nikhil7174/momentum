import React, { useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient'; // Use Expo's LinearGradient
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';
import { useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useFocusEffect } from '@react-navigation/native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const SKILL_ICONS = [
  {
    id: 'coding',
    iconName: 'code-slash', size: 28,
    startX: Math.random() * width,
    startY: Math.random() * height
  },
  {
    id: 'cooking',
    iconName: 'restaurant', size: 30,
    startX: Math.random() * width,
    startY: Math.random() * height
  },
  {
    id: 'videography',
    iconName: 'videocam-outline', size: 32,
    startX: Math.random() * width,
    startY: Math.random() * height
  },
  {
    id: 'music',
    iconName: 'musical-notes', size: 32,
    startX: Math.random() * width,
    startY: Math.random() * height
  },
  {
    id: 'selfHelp',
    iconName: 'book-outline',
    size: 28,
    startX: Math.random() * width,
    startY: Math.random() * height
  },
  {
    id: 'gym',
    iconName: 'barbell-outline', size: 28,
    startX: Math.random() * width,
    startY: Math.random() * height
  }
];

interface FloatingIconProps {
  iconName: any;
  size: number;
  startX: number;
  startY: number;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ iconName, size, startX, startY }) => {
  const translateX = useSharedValue(startX);
  const translateY = useSharedValue(startY);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(Math.random() * width, { duration: 8000 + Math.random() * 7000, easing: Easing.inOut(Easing.sin) }),
        withTiming(Math.random() * width, { duration: 8000 + Math.random() * 7000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    translateY.value = withRepeat(
      withSequence(
        withTiming(Math.random() * height * 0.8, { duration: 9000 + Math.random() * 8000, easing: Easing.inOut(Easing.sin) }),
        withTiming(Math.random() * height * 0.8, { duration: 9000 + Math.random() * 8000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    rotation.value = withRepeat(
      withTiming(Math.random() > 0.5 ? 360 : -360, { duration: 20000 + Math.random() * 10000 }),
      -1,
      false
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.8, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
        { scale: scale.value }
      ],
      opacity: 0.6
    };
  });

  return (
    <Animated.View style={[{ position: 'absolute' }, animatedStyle]}>
      <Ionicons name={iconName} size={size} color="#FFF" />
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'Roboto-VariableFont': require('../assets/fonts/Roboto-VariableFont.ttf'),
  });

  const rocketShakeX = useSharedValue(0);
  const rocketShakeY = useSharedValue(0);
  const rocketScale = useSharedValue(1);
  const rocketY = useSharedValue(0);
  const rocketX = useSharedValue(0);

  // Animation values for gradient
  const gradientProgress = useSharedValue(0);

  useEffect(() => {
    rocketShakeX.value = withRepeat(
      withSequence(
        withTiming(-2.5, { duration: 100, easing: Easing.inOut(Easing.quad) }),
        withTiming(2.5, { duration: 100, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    rocketShakeY.value = withRepeat(
      withSequence(
        withTiming(-1.5, { duration: 200, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.5, { duration: 500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    rocketScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    gradientProgress.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    async function hideSplashScreen() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }

    hideSplashScreen();
  }, [fontsLoaded]);

  const gradientColors = useDerivedValue<readonly [string, string, ...string[]]>(() => {
    if (isDark) {
      return [
        interpolateColor(
          gradientProgress.value,
          [0, 0.5, 1],
          ['#14227d', '#141f61', '#1e306e']
        ),
        interpolateColor(
          gradientProgress.value,
          [0, 0.5, 1],
          ['#181d36', '#252d57', '#374291']
        ),
      ];
    } else {
      return [
        interpolateColor(
          gradientProgress.value,
          [0, 0.5, 1],
          ['#3388e8', '#49b9f5', '#3388e8']
        ),
        interpolateColor(
          gradientProgress.value,
          [0, 0.5, 1],
          ['#49b9f5', '#3388e8', '#49b9f5']
        ),
      ];
    }
  });

  const handleGetStarted = () => {
    rocketScale.value = withTiming(1.2, { duration: 200 });
    const flightDelay = 300;
    const flightDuration = 500;
    rocketX.value = withDelay(
      flightDelay,
      withTiming(width, {
        duration: flightDuration,
        easing: Easing.out(Easing.quad),
      })
    );
    rocketY.value = withDelay(
      flightDelay,
      withTiming(-height, {
        duration: flightDuration,
        easing: Easing.out(Easing.quad),
      })
    );

    setTimeout(() => {
      router.push('/onboarding/1');
    }, 100);
  };

  const rocketStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: rocketX.value + rocketShakeX.value },
        { translateY: rocketY.value + rocketShakeY.value },
        { scale: rocketScale.value }
      ]
    };
  });

  useFocusEffect(
    useCallback(() => {
      rocketX.value = 0;
      rocketY.value = 0;
      rocketScale.value = 1;
      rocketShakeX.value = withRepeat(
        withSequence(
          withTiming(-2.5, { duration: 100, easing: Easing.inOut(Easing.quad) }),
          withTiming(2.5, { duration: 100, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );

      rocketShakeY.value = withRepeat(
        withSequence(
          withTiming(-1.5, { duration: 200, easing: Easing.inOut(Easing.quad) }),
          withTiming(1.5, { duration: 500, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
    }, [])
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={StyleSheet.absoluteFill}>
        <Animated.Image
          source={
            isDark
              ? require('../assets/images/welcomeDark.png')
              : require('../assets/images/welcomeLight.png')
          }
          style={styles.backgroundImage}
          resizeMode="cover"
          blurRadius={40}
        />
      </View>

      {SKILL_ICONS.map((skill) => (
        <FloatingIcon
          key={skill.id}
          iconName={skill.iconName}
          size={skill.size}
          startX={skill.startX}
          startY={skill.startY}
        />
      ))}

      <BlurView
        intensity={isDark ? 100 : 50}
        tint={isDark ? 'dark' : 'light'}
        style={styles.blurContainer}
      >
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Animated.View style={rocketStyle}>
              <View style={[styles.logoCircle, isDark ? styles.logoCircleDark : styles.logoCircleLight]}>
                <Ionicons
                  name="rocket"
                  size={60}
                  color={isDark ? '#5980FF' : '#49b9f5'}
                />
              </View>
            </Animated.View>
          </View>

          <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>
            Welcome to Momentum
          </Text>
          <Text style={[styles.subtitle, isDark ? styles.textLight : styles.textDark]}>
            Your personal guide to mastering any hobby or skill
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleGetStarted}
            style={styles.buttonContainer}
          >
            <AnimatedLinearGradient
              colors={gradientColors.value}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={[styles.button, styles.gradientButton]}
            >
              <Text style={[styles.buttonText]}>Get Started</Text>
            </AnimatedLinearGradient>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logoCircleLight: {
    backgroundColor: 'rgba(220, 250, 255, 0.9)',
  },
  logoCircleDark: {
    backgroundColor: 'rgba(30, 35, 60, 0.9)',
  },
  rocketIcon: {
    width: 60,
    height: 60,
    tintColor: '#4169E1',
  },
  title: {
    fontSize: 28,
    // fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Roboto-VariableFont'
  },

  subtitle: {
    width: '80%',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
    opacity: 0.8,
  },
  textLight: {
    color: '#FFFFFF',
    fontWeight: '300'
  },
  textDark: {
    color: '#333333',
    fontWeight: '100'
  },
  infoBox: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  infoBoxLight: {
    backgroundColor: 'rgba(240, 245, 255, 0.7)',
  },
  infoBoxDark: {
    backgroundColor: 'rgba(40, 50, 100, 0.7)',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '90%',
    marginTop: 40,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  gradientButton: {
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Roboto-VariableFont'
  },
});