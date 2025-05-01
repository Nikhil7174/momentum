import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { iThemeUtils } from '@/types/ColorThemetypes';

interface HeaderProps {
  theme: iThemeUtils
}

const Header: React.FC<HeaderProps> = ({ theme }) => {
  console.log("theme.isDarkMode", theme.isDarkMode)
  return (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: 16,
      backgroundColor: theme.isDarkMode ? '#1a2234' : '#fff',
      paddingTop: 13,
      alignContent: 'center',
      paddingBottom: 13
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* <a href="https://www.flaticon.com/free-icons/rocket" title="rocket icons">Rocket icons created by Freepik - Flaticon</a> */}
        <Image 
          source={require('../../assets/images/icon.png')} 
          style={{ width: 32, height: 32, borderRadius: 4 }}
        />
        <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: 'bold', color: theme.text }}>
          Momentum
        </Text>
      </View>
      <TouchableOpacity onPress={() => router.push('/ProfileScreen')} style={{ 
        borderRadius: 20 
      }}>
        <Ionicons name="person-circle" size={35.5} color={theme.isDarkMode ? "#fff" : "#000"} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;