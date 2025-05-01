import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createTheme } from '@/utils/themeUtils';
import { useTheme } from '@react-navigation/native';

const Community: React.FC = () => {
  const rootTheme = useTheme();
  const theme = createTheme(rootTheme.dark);

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