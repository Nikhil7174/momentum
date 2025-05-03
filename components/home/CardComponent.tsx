import React, { useEffect } from 'react';
import { StyleSheet, Pressable, ImageBackground, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CardComponent = ({ card, onPress, isActive, onLayout, position }: any) => {
  const opacity = useSharedValue(1);
  
  useEffect(() => {
    opacity.value = withTiming(isActive ? 0 : 1, { duration: 300 });
  }, [isActive]);
  
  const cardStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    };
  });
  
  const getBorderRadiusStyle = () => {
    switch(position) {
      case 'topLeft':
        return {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 24,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        };
      case 'topRight':
        return {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        };
      case 'bottomLeft':
        return {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 24,
        };
      case 'bottomRight':
        return {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 0,
        };
      default:
        return { borderRadius: 24 };
    }
  };
  
  return (
    <Animated.View 
      style={[
        styles.cardWrapper,
        cardStyle,
        getBorderRadiusStyle(),
        { overflow: 'hidden' }
      ]}
      onLayout={(event) => onLayout(card.id, event.nativeEvent.layout)}
    >
      <Pressable 
        onPress={() => onPress(card.id)}
        style={({ pressed }) => [
          styles.learningCard,
          pressed && styles.cardPressed
        ]}
      >
        <ImageBackground 
          source={card.image} 
          style={styles.cardBackgroundImage}
        >
          <View style={[styles.cardOverlay, { backgroundColor: card.baseColor + 'CC' }]}>
            <Text style={styles.cardName}>{card.id.charAt(0).toUpperCase() + card.id.slice(1)}</Text>
            
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <TouchableOpacity 
                style={styles.cardAction}
                onPress={() => {
                  onPress(card.id);
                }}
              >
                <Text style={styles.cardActionText}>{card.description}</Text>
                <Ionicons name="arrow-forward-circle" size={20} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardIcons}>
              <View style={styles.iconCircle}>
                <Ionicons name={card.icon} size={22} color="white" />
              </View>
              {card.id === 'learn' && (
                <>
                  <View style={[styles.iconCircle, { marginLeft: 8 }]}>
                    <Ionicons name="school-outline" size={22} color="white" />
                  </View>
                </>
              )}
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: (width - 50) / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: 'transparent',
    padding: 0,
    height: 200,
    marginRight: 10,
    marginLeft: 8,
  },
  learningCard: {
    height: '100%',
    overflow: 'hidden',
  },
  cardBackgroundImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardPressed: {
    opacity: 0.9,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  cardActionText: {
    color: 'white',
    fontSize: 14,
    marginRight: 8,
  },
  cardIcons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CardComponent;