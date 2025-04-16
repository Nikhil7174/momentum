import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useUserStats } from '@/context/UserStatsContext';
import { createTheme } from '@/utils/themeUtils';
import { useRouter } from 'expo-router';
import { SKILL_LEVELS, GOAL_LEVELS, TIME_OPTIONS } from '../constants/Onboarding';
import Dropdown, { Option } from '@/components/profile/Dropdown';

const DROPDOWN_IDS = {
  SKILL: 'skill',
  GOAL: 'goal',
  TIME: 'time'
};

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = createTheme(isDarkMode);
  const { userData, fetchLearningPlan, updateUserData } = useUserStats();

  const [hobbyName, setHobbyName] = useState(userData.hobbyName);
  const [currentSkillLevel, setCurrentSkillLevel] = useState(userData.currentSkillLevel);
  const [desiredSkillLevel, setDesiredSkillLevel] = useState(userData.desiredSkillLevel);
  const [timeCommitment, setTimeCommitment] = useState(userData.timeCommitment);
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
    try {
      await updateUserData({
        hobbyName,
        currentSkillLevel,
        desiredSkillLevel,
        timeCommitment,
      });
      await fetchLearningPlan();
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={{ padding: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
          <AntDesign name="arrowleft" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text, marginBottom: 20 }}>
          Profile
        </Text>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: theme.subtext, marginBottom: 4, fontSize: 16 }}>Hobby Name</Text>
          <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.card,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 2
          }}>
            <Ionicons name="happy-outline" size={20} color={theme.primary} style={{ marginRight: 8 }} />
            <TextInput
              value={hobbyName}
              onChangeText={setHobbyName}
              placeholder="Enter your hobby"
              style={{ flex: 1, color: theme.text }}
              placeholderTextColor={theme.subtext}
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
          style={{
              backgroundColor: theme.primary,
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 40,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;