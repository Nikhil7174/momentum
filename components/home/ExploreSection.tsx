import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface Theme {
  text: string;
  primary: string;
  secondary: string;
  isDarkMode: boolean;
}

const ExploreSection: React.FC<{ theme: Theme }> = ({ theme }) => {

  const router = useRouter();

  return (
    <View style={{ margin: 16, marginTop: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>
        Explore Learning
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/learning')}
        style={{
          backgroundColor: theme.primary,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.isDarkMode ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, marginBottom: 4 }}>
          Practice Techniques
        </Text>
        <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          Master the fundamentals with guided exercises
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/learning')}
        style={{
          backgroundColor: theme.secondary,
          borderRadius: 16,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.isDarkMode ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, marginBottom: 4 }}>
          Learning Resources
        </Text>
        <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          Curated content specific to your level
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExploreSection;