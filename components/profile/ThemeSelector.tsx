import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemePreference } from '@/context/ThemeContext';
import { createTheme } from '@/utils/themeUtils';

const ThemeSelector = () => {
  const { themePreference, theme, setThemePreference } = useTheme();
  const isDarkMode = theme === 'dark';
  const appTheme = createTheme(isDarkMode);

  const themeOptions: { value: ThemePreference; label: string; icon: string }[] = [
    { value: 'system', label: 'System Default', icon: 'phone-portrait-outline' },
    { value: 'light', label: 'Light Mode', icon: 'sunny-outline' },
    { value: 'dark', label: 'Dark Mode', icon: 'moon-outline' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: appTheme.subtext }]}>Theme</Text>
      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              { 
                backgroundColor: isDarkMode ? appTheme.card : '#f2f2f2',
                borderColor: themePreference === option.value ? appTheme.primary : 'transparent',
              }
            ]}
            onPress={() => setThemePreference(option.value)}
          >
            <Ionicons
              name={option.icon as any}
              size={24}
              color={themePreference === option.value ? appTheme.primary : appTheme.text}
            />
            <Text 
              style={[
                styles.optionText, 
                { 
                  color: themePreference === option.value ? appTheme.primary : appTheme.text 
                }
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 2,
  },
  optionText: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ThemeSelector;