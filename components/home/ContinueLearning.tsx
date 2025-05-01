import React from 'react';
import { TouchableOpacity, Text, ViewStyle, StyleProp } from 'react-native';
import { useRouter } from 'expo-router';
import { iThemeUtils } from '@/types/ColorThemetypes';

interface LastViewedResource {
  title: string;
  weekIndex: number;
  type: 'video' | 'article' | string;
}

interface ContinueLearningProps {
  theme: iThemeUtils
  lastViewedResource: LastViewedResource;
  containerStyle?: StyleProp<ViewStyle>;
}

const ContinueLearning: React.FC<ContinueLearningProps> = ({
    theme,
    lastViewedResource,
    containerStyle,
  }) => {
    const router = useRouter();
  
    const backgroundColor = theme.isDarkMode ? theme.blue900 : theme.blue100;
    const labelColor = theme.isDarkMode ? theme.blue300 : theme.blue500;
    const titleColor = theme.isDarkMode ? theme.white : theme.slate800;
    const subtextColor = theme.isDarkMode ? theme.slate300 : theme.slate600;
  
    return (
      <TouchableOpacity
        style={[
          {
            marginHorizontal: 10,
            marginVertical: 8,
            padding: 14,
            backgroundColor,
            borderRadius: 12,
          },
          containerStyle,
        ]}
        onPress={() => {
          router.push({
            pathname: '/learning',
            params: { openResource: JSON.stringify(lastViewedResource) },
          });
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: labelColor,
            fontWeight: '500',
          }}
        >
          Continue Learning
        </Text>
  
        <Text
          style={{
            fontSize: 15,
            fontWeight: '700',
            color: titleColor,
            marginTop: 4,
          }}
        >
          {lastViewedResource.title}
        </Text>
  
        <Text
          style={{
            fontSize: 10,
            fontWeight: '400',
            color: subtextColor,
            marginTop: 4,
          }}
        >
          Week {lastViewedResource.weekIndex + 1} •{' '}
          {lastViewedResource.type === 'video' ? 'Video' : 'Article'}
        </Text>
      </TouchableOpacity>
    );
  };
  
  export default ContinueLearning;
  
