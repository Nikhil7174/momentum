import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useUserStats } from '@/context/UserStatsContext';
import { createTheme } from '@/utils/themeUtils';
import { useRouter } from 'expo-router';
import { SKILL_LEVELS, GOAL_LEVELS, TIME_OPTIONS } from '../constants/Onboarding';
import Dropdown, { Option } from '@/components/profile/Dropdown';
import ThemeSelector from '@/components/profile/ThemeSelector';
import { useTheme } from '@/context/ThemeContext';

const DROPDOWN_IDS = {
  SKILL: 'skill',
  GOAL: 'goal',
  TIME: 'time'
};

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const appTheme = createTheme(isDarkMode);
  const { userData, updateUserData, fetchLearningPlan } = useUserStats();

  const [hobbyName, setHobbyName] = useState(userData.hobbyName);
  const [currentSkillLevel, setCurrentSkillLevel] = useState(userData.currentSkillLevel);
  const [desiredSkillLevel, setDesiredSkillLevel] = useState(userData.desiredSkillLevel);
  const [timeCommitment, setTimeCommitment] = useState(userData.timeCommitment);
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleDropdown = (dropdownId: string) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  // Sync local values when context changes
  useEffect(() => {
    setHobbyName(userData.hobbyName);
    setCurrentSkillLevel(userData.currentSkillLevel);
    setDesiredSkillLevel(userData.desiredSkillLevel);
    setTimeCommitment(userData.timeCommitment);
  }, [userData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserData({
        hobbyName,
        currentSkillLevel,
        desiredSkillLevel,
        timeCommitment,
      });
      
      fetchLearningPlan();
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
    setIsSaving(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appTheme.background }}>
      <ScrollView style={{ padding: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
          <AntDesign name="arrowleft" size={24} color={appTheme.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: appTheme.text, marginBottom: 20 }}>
          Profile
        </Text>
        <View style={{ marginBottom: 16 }}>

        <ThemeSelector />

          <Text style={{ color: appTheme.subtext, marginBottom: 4, fontSize: 16 }}>Hobby Name</Text>
          <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDarkMode ? appTheme.card : '#f2f2f2',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 2,
              height: 48
          }}>
            <Ionicons name="happy-outline" size={20} color={appTheme.primary} style={{ marginRight: 8 }} />
            <TextInput
              value={hobbyName}
              onChangeText={setHobbyName}
              placeholder="Enter your hobby"
              style={{ flex: 1, color: appTheme.text }}
              placeholderTextColor={appTheme.subtext}
            />
          </View>
        </View>
                
        <Dropdown
          options={SKILL_LEVELS as Option[]}
          selectedValue={currentSkillLevel}
          onSelect={setCurrentSkillLevel}
          placeholder="Select your level"
          isOpen={openDropdown === DROPDOWN_IDS.SKILL}
          onToggle={() => handleToggleDropdown(DROPDOWN_IDS.SKILL)}
        />
        <Dropdown
          options={GOAL_LEVELS as Option[]}
          selectedValue={desiredSkillLevel}
          onSelect={setDesiredSkillLevel}
          placeholder="Select your goal"
          isOpen={openDropdown === DROPDOWN_IDS.GOAL}
          onToggle={() => handleToggleDropdown(DROPDOWN_IDS.GOAL)}
        />
        <Dropdown
          options={TIME_OPTIONS as Option[]}
          selectedValue={timeCommitment}
          onSelect={setTimeCommitment}
          placeholder="Select time commitment"
          isOpen={openDropdown === DROPDOWN_IDS.TIME}
          onToggle={() => handleToggleDropdown(DROPDOWN_IDS.TIME)}
        />
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          style={{
              backgroundColor: appTheme.primary,
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 40,
          }}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              Save Profile
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;