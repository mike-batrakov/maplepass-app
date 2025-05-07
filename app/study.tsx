import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import StudyScreen from '../screens/StudyScreen';

export default function StudyPage() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Study Book',
          headerShown: true,
        }}
      />
      <StatusBar style="auto" />
      <StudyScreen />
    </>
  );
}