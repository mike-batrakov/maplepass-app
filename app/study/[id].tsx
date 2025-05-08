import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import ChapterReaderScreen from '../../screens/ChapterReaderScreen';

export default function ChapterPage() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Chapter',
          headerShown: true,
        }}
      />
      <StatusBar style="auto" />
      <ChapterReaderScreen />
    </>
  );
}