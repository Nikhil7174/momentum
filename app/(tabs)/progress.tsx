// import React from 'react';
// import { View, ScrollView } from 'react-native';
// import GoalsStatsCard from '../components/home/GoalsStatsCard';
// import ProgressChart from '../components/home/ProgressChart';
// import Header from '../components/home/Header';
// import { useColorScheme } from 'react-native';
// import { createTheme } from '../utils/themeUtils';
// import { useUserStats } from '@/context/UserStatsContext';

// export default function ProgressScreen() {
//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';
//   const theme = createTheme(isDarkMode);
//   const { lastViewedResource } = useUserStats();

//   return (
//     <View style={{ flex: 1, backgroundColor: theme.background }}>
//       <Header theme={theme} isDarkMode={isDarkMode} />
//       <ScrollView style={{ flex: 1, padding: 16 }}>
//         <GoalsStatsCard theme={theme} userData={userData} />
//         <ProgressChart theme={theme} userData={userData} />
//       </ScrollView>
//     </View>
//   );
// }

import { View, Text } from 'react-native'
import React from 'react'

const progress = () => {
  return (
    <View>
      <Text>progress</Text>
    </View>
  )
}

export default progress