import { iThemeUtils } from '@/types/ColorThemetypes';
import React from 'react';
import { View, Text } from 'react-native';

interface WelcomeCardProps {
  theme: iThemeUtils;
  hobbyName: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ theme, hobbyName }) => {
  return (
    <View style={{ 
      margin: 10, 
      backgroundColor: theme.card, 
      borderRadius: 16, 
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ 
          width: 48, 
          height: 48, 
          borderRadius: 12, 
          backgroundColor: theme.accent, 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginRight: 12 
        }}>
          <Text style={{ fontSize: 22 }}>😊</Text>
        </View>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>
            Hey, Explorer!
          </Text>
          <Text style={{ color: theme.subtext }}>
            Welcome to your {hobbyName} journey.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default WelcomeCard;