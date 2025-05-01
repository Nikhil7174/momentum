import { iThemeUtils } from '@/types/ColorThemetypes';
import React from 'react';
import { View, Text } from 'react-native';

const MotivationalQuote = ({ theme }: { theme: iThemeUtils }) => {
  return (
    <View style={{ 
      margin: 10, 
      padding: 16, 
      borderWidth: 1, 
      borderColor: theme.border, 
      borderRadius: 16,
      backgroundColor: theme.isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)',
      marginBottom: 72
    }}>
      <Text style={{ color: theme.subtext, fontStyle: 'italic', textAlign: 'center' }}>
        "Success is built on small efforts, repeated daily."
      </Text>
      <Text style={{ color: theme.inactive, textAlign: 'right', marginTop: 4, fontSize: 12 }}>
        - Robert Collier
      </Text>
    </View>
  );
};

export default MotivationalQuote;