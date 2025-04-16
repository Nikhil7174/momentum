import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createTheme } from '@/utils/themeUtils';

const Community: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = createTheme(colorScheme === 'dark');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.text }}>
          Coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Community;