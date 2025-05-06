import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const AnimatedBlurredBackground = ({ colorScheme = 'dark' }) => {
  const isDark = colorScheme === 'dark';
  
  // Animation values for gradient positions
  const gradientPosition1 = useSharedValue({ x: 0, y: 0 });
  const gradientPosition2 = useSharedValue({ x: width, y: height });
  
  // Colors for light and dark modes
  const colors = isDark 
    ? ['#6a11cb', '#2575fc', '#b621fe'] 
    : ['#ff9a9e', '#fad0c4', '#fbc2eb'];
  
  useEffect(() => {
    // Animate the first gradient blob
    gradientPosition1.value = withRepeat(
      withTiming(
        { 
          x: Math.random() * width * 0.8, 
          y: Math.random() * height * 0.8 
        }, 
        { 
          duration: 15000, 
          easing: Easing.inOut(Easing.quad) 
        }
      ),
      -1,
      true
    );
    
    // Animate the second gradient blob
    gradientPosition2.value = withRepeat(
      withTiming(
        { 
          x: Math.random() * width * 0.8, 
          y: Math.random() * height * 0.8 
        }, 
        { 
          duration: 18000, 
          easing: Easing.inOut(Easing.quad) 
        }
      ),
      -1,
      true
    );
  }, []);
  
  // Animated styles for gradient blobs
  const animatedStyle1 = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: gradientPosition1.value.x },
        { translateY: gradientPosition1.value.y },
      ],
    };
  });
  
  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: gradientPosition2.value.x - width * 0.7 },
        { translateY: gradientPosition2.value.y - height * 0.7 },
      ],
    };
  });
  
  return (
    <View style={styles.container}>
      {/* Background color */}
      <View style={[
        styles.background, 
        { backgroundColor: isDark ? '#1a1a2e' : '#f8f9fa' }
      ]} />
      
      {/* Animated gradient blobs */}
      <Animated.View style={[styles.gradientContainer, animatedStyle1]}>
        <LinearGradient
          colors={[colors[0], colors[1]]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      
      <Animated.View style={[styles.gradientContainer, animatedStyle2]}>
        <LinearGradient
          colors={[colors[1], colors[2]]}
          style={styles.gradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
      
      {/* High intensity blur over everything */}
      <BlurView
        intensity={isDark ? 95 : 85}
        tint={isDark ? 'dark' : 'light'}
        style={styles.blurOverlay}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width,
    height: height,
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientContainer: {
    position: 'absolute',
    width: width * 0.7,
    height: height * 0.7,
    borderRadius: width,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: width,
    opacity: 0.7,
  },
  blurOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 5,
  },
});

export default AnimatedBlurredBackground;