import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface HeaderProps {
  theme: { text: string };
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ theme, isDarkMode }) => {
  return (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: 16,
      backgroundColor: isDarkMode ? '#1a2234' : '#e6effe'
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image 
          source={require('../../assets/images/icon.png')} 
          style={{ width: 32, height: 32, borderRadius: 4 }}
        />
        <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: 'bold', color: theme.text }}>
          HobbyMaster
        </Text>
      </View>
      <TouchableOpacity style={{ 
        backgroundColor: isDarkMode ? '#334155' : '#dbeafe', 
        padding: 8, 
        borderRadius: 20 
      }}>
        <Image 
          source={require('../../assets/images/favicon.png')} 
          style={{ width: 24, height: 24, borderRadius: 12 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;