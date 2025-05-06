import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, TouchableOpacity, StatusBar, ImageBackground, BackHandler } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { createTheme } from '@/utils/themeUtils';
import { ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import CardComponent from '@/components/home/CardComponent';
import ContinueLearning from '@/components/home/ContinueLearning';
import WelcomeCard from '@/components/home/WelcomeCard';
import Header from '@/components/home/Header';
import { useUserStats } from '@/context/UserStatsContext';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');

const LEARNING_CARDS = [
  {
    id: 'practice',
    title: 'Practice Techniques',
    description: 'Start learning',
    icon: 'layers-outline',
    baseColor: '#183685',
    position: { x: 0, y: 0 },
    floatOffset: 8,
    image: require('../assets/images/practice.png')
  },
  {
    id: 'learn',
    title: 'Learning Resources',
    description: 'Start learning',
    icon: 'book-outline',
    baseColor: '#372073',
    position: { x: 0, y: 0 },
    floatOffset: 10,
    image: require('../assets/images/learning.png')
  },
  {
    id: 'progress',
    title: 'Track Progress',
    description: 'View analytics',
    icon: 'trending-up-outline',
    baseColor: '#573718',
    position: { x: 0, y: 0 },
    floatOffset: 6,
    image: require('../assets/images/progress.png')
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Join discussion',
    icon: 'people-outline',
    baseColor: '#82631a',
    position: { x: 0, y: 0 },
    floatOffset: 7,
    image: require('../assets/images/community.png')
  }
];

export default function AnimatedHomeScreen() {
  const [activeCardId, setActiveCardId] = useState(null);
  const [cardMeasurements, setCardMeasurements] = useState({});
  const { userData, lastViewedResource } = useUserStats();

  const zoomProgress = useSharedValue(0);
  const backgroundOpacity = useSharedValue(0);
  const screenScale = useSharedValue(1);
  const measureCard = (cardId, layout) => {
    setCardMeasurements(prev => ({
      ...prev,
      [cardId]: {
        x: layout.x,
        y: layout.y,
        width: layout.width,
        height: layout.height
      }
    }));
  };

  const handleCardPress = (cardId) => {
    if (activeCardId !== null) return;

    setActiveCardId(cardId);
    zoomProgress.value = withTiming(1, { duration: 400 });
    backgroundOpacity.value = withTiming(1, { duration: 300 });
    screenScale.value = withTiming(0.9, { duration: 300 });
  };

  const handleBackgroundPress = () => {
    zoomProgress.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(resetActiveCard)();
    });
    backgroundOpacity.value = withTiming(0, { duration: 300 });
    screenScale.value = withTiming(1, { duration: 300 });
  };

  const resetActiveCard = () => {
    setActiveCardId(null);
  };

  const contentContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: screenScale.value }
      ]
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
      zIndex: backgroundOpacity.value > 0 ? 10 : -1,
    };
  });

  const rootTheme = useTheme();
  const isDarkMode = rootTheme.dark;
  const theme = createTheme(isDarkMode);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        BackHandler.exitApp();
        return true;
      });
      return () => backHandler.remove();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, flex: 1 }]}>
      <StatusBar translucent backgroundColor="transparent" />
      <Header theme={theme} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={!activeCardId}
        pointerEvents={activeCardId ? 'none' : 'auto'}
      >

        <Animated.View style={[styles.contentContainer, contentContainerStyle]}>

          <View style={{ marginHorizontal: 8 }}>
            {lastViewedResource ? (
              <ContinueLearning theme={theme} lastViewedResource={lastViewedResource} />
            ) : <WelcomeCard theme={theme} hobbyName={userData.hobbyName} />}
          </View>

          {/* Grid Container */}
          <View style={styles.gridContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore Learning</Text>

            <View style={styles.gridRow}>
              <CardComponent
                card={LEARNING_CARDS[0]}
                onPress={handleCardPress}
                isActive={activeCardId === LEARNING_CARDS[0].id}
                onLayout={measureCard}
                position="topLeft"
              />

              <CardComponent
                card={LEARNING_CARDS[1]}
                onPress={handleCardPress}
                isActive={activeCardId === LEARNING_CARDS[1].id}
                onLayout={measureCard}
                position="topRight"
              />
            </View>

            <View style={styles.gridRow}>
              <CardComponent
                card={LEARNING_CARDS[2]}
                onPress={handleCardPress}
                isActive={activeCardId === LEARNING_CARDS[2].id}
                onLayout={measureCard}
                position="bottomLeft"
              />

              <CardComponent
                card={LEARNING_CARDS[3]}
                onPress={handleCardPress}
                isActive={activeCardId === LEARNING_CARDS[3].id}
                onLayout={measureCard}
                position="bottomRight"
              />
            </View>
          </View>
        </Animated.View>

        {activeCardId && (
          <Animated.View style={[styles.backgroundOverlay, overlayStyle]}>
            <Pressable
              style={[StyleSheet.absoluteFill, { justifyContent: 'center' }]}
              onPress={handleBackgroundPress}
            >
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.75)' }]} />
            </Pressable>

            <ZoomedCard
              card={LEARNING_CARDS.find(card => card.id === activeCardId)}
              measurements={cardMeasurements[activeCardId]}
              zoomProgress={zoomProgress}
              onActionPress={handleBackgroundPress}
            />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const ZoomedCard = ({ card, measurements, zoomProgress, onActionPress }) => {

  const statusBarHeight = StatusBar.currentHeight || 0;
  const headerHeight = 20;
  const targetHeight = height * 0.6;
  const targetY = (height - targetHeight - statusBarHeight - headerHeight) / 2;

  const targetWidth = width * 0.9;
  const targetX = (width - targetWidth) / 2;
  const router = useRouter()

  // Determine the destination route based on card ID
  const getDestinationRoute = (cardId) => {
    switch (cardId) {
      case 'practice':
        return '/learning';
      case 'learn':
        return '/learning';
      case 'progress':
        return '/progress';
      case 'community':
        return '/community';
      default:
        return '/(tabs)';
    }
  };

  // Handler for the call-to-action button
  const handleActionPress = () => {
    if (card && card.id) {
      const route = getDestinationRoute(card.id);
      router.push(route);
    }
  };

  const zoomedCardStyle = useAnimatedStyle(() => {
    if (!measurements) return {};

    const cardX = interpolate(
      zoomProgress.value,
      [0, 1],
      [measurements.x, targetX],
      Extrapolate.CLAMP
    );

    const cardY = interpolate(
      zoomProgress.value,
      [0, 1],
      [measurements.y, targetY],
      Extrapolate.CLAMP
    );

    const cardWidth = interpolate(
      zoomProgress.value,
      [0, 1],
      [measurements.width, targetWidth],
      Extrapolate.CLAMP
    );

    const cardHeight = interpolate(
      zoomProgress.value,
      [0, 1],
      [measurements.height, targetHeight],
      Extrapolate.CLAMP
    );

    return {
      position: 'absolute',
      left: cardX,
      top: cardY,
      width: cardWidth,
      height: cardHeight,
      borderRadius: interpolate(zoomProgress.value, [0, 1], [16, 24], Extrapolate.CLAMP),
      overflow: 'hidden',
      zIndex: 20,
    };
  });

  return (
    <Animated.View style={zoomedCardStyle}>
      {card && (
        <ImageBackground
          source={card.image}
          style={styles.zoomedCardBackgroundImage}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onActionPress}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <View style={[styles.zoomedCardOverlay, { backgroundColor: card.baseColor + 'DD' }]}>
            <View style={styles.zoomedCardHeader}>
              <Text style={styles.zoomedCardName}>{card.id.charAt(0).toUpperCase() + card.id.slice(1)}</Text>
              <Text style={styles.zoomedCardTitle}>{card.title}</Text>
              <Text style={styles.zoomedCardDescription}>{card.description}</Text>
            </View>

            <View style={styles.zoomedCardContent}>
              <Text style={styles.zoomedCardText}>
                Expand your knowledge and skills with our comprehensive resources.
                Track your progress and connect with other learners.
              </Text>

              <TouchableOpacity
                style={styles.zoomedCardButton}
                onPress={handleActionPress}
              >
                <Text style={styles.zoomedCardButtonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={18} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.zoomedCardIcons}>
              <View style={styles.zoomedIconCircle}>
                <Ionicons name={card.icon} size={24} color="white" />
              </View>
              {card.id === 'learn' && (
                <>
                  <View style={[styles.zoomedIconCircle, { marginLeft: 12 }]}>
                    <Ionicons name="book-outline" size={24} color="white" />
                  </View>
                  <View style={[styles.zoomedIconCircle, { marginLeft: 12 }]}>
                    <Ionicons name="school-outline" size={24} color="white" />
                  </View>
                </>
              )}
            </View>
          </View>
        </ImageBackground>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 15,
  },
  gridContainer: {
    padding: 10,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  zoomedCardBackgroundImage: {
    width: '100%',
    height: '100%',
  },
  zoomedCardOverlay: {
    flex: 1,
    padding: 24,
  },
  zoomedCardHeader: {
    marginBottom: 20,
  },
  zoomedCardName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  zoomedCardTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  zoomedCardDescription: {
    color: 'white',
    fontSize: 16,
    opacity: 0.8,
  },
  zoomedCardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  zoomedCardText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  zoomedCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  zoomedCardButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  zoomedCardIcons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  zoomedIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 30,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});