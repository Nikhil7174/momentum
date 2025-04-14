import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const community = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className='items-center flex-1 justify-center'>
        <Text className='font-bold text-xl'>Coming soon</Text>
      </View>
    </SafeAreaView>
  )
}

export default community