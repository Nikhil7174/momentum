import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface Theme {
  text: string;
  card: string;
  isDarkMode: boolean;
  primary: string;
  accent: string;
  subtext: string;
}

interface UserData {
  progress: number;
}

const ProgressChart: React.FC<{ theme: Theme; userData: UserData }> = ({ theme, userData }) => {
  const currentProgress = userData.progress; 
  // If currentProgress is 0, we set weekly progress to zero
  const weeklySplit = currentProgress > 0 ? [
    Math.round(currentProgress * 0.25), 
    Math.round(currentProgress * 0.5), 
    Math.round(currentProgress * 0.75), 
    currentProgress
  ] : [0, 0, 0, 0];

  const targetData = [
    Math.round((7 / 28) * 100),
    Math.round((14 / 28) * 100),
    Math.round((21 / 28) * 100),
    100
  ];
  
  // Data for the progress chart
  const progressData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        data: weeklySplit,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Primary blue
        strokeWidth: 2
      },
      // Target line dataset using the 7-day gap calculation based on 25 days
      {
        data: targetData,
        color: (opacity = 1) => `rgba(234, 179, 8, ${opacity})`, // Gold target line
        strokeWidth: 2,
        withDots: false,
      }
    ],
    legend: ["Progress", "Target"]
  };

  return (
    <View style={{ margin: 10, marginTop: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>
        Your Progress
      </Text>
      
      <View style={{ 
        backgroundColor: theme.card, 
        borderRadius: 16, 
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.isDarkMode ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
      }}>
        <LineChart
          data={progressData}
          width={300}
          height={220}
          chartConfig={{
            backgroundColor: theme.isDarkMode ? theme.card : '#ffffff',
            backgroundGradientFrom: theme.isDarkMode ? theme.card : '#ffffff',
            backgroundGradientTo: theme.isDarkMode ? theme.card : '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: (opacity = 1) => theme.isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(15, 23, 42, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#3b82f6"
            },
            propsForBackgroundLines: {
              strokeDasharray: '',
              stroke: theme.isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
            },
            formatYLabel: (value) => `${value}%`,
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          withInnerLines={true}
          withOuterLines={false}
          withShadow={false}
          withDots={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={true}
          yAxisInterval={10}
          segments={5}
        />
        
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          marginTop: 8,
          gap: 16
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: theme.primary, marginRight: 4 }} />
            <Text style={{ color: theme.subtext, fontSize: 12 }}>Progress</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: theme.accent, marginRight: 4 }} />
            <Text style={{ color: theme.subtext, fontSize: 12 }}>Target</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProgressChart;