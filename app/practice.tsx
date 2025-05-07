import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function PracticeTestsPage() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Practice Tests',
          headerShown: true,
        }}
      />
      <StatusBar style="auto" />
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.headerImage}
          />
        }>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>Practice Tests</ThemedText>
          <ThemedText style={styles.description}>
            Test your knowledge with practice tests covering all topics from the Canadian Citizenship Exam.
          </ThemedText>

          <ThemedView style={styles.testsContainer}>
            <ThemedView style={styles.testCard}>
              <ThemedText type="defaultSemiBold" style={styles.testTitle}>Quick Test</ThemedText>
              <ThemedText>10 random questions to test your knowledge</ThemedText>
            </ThemedView>

            <ThemedView style={styles.testCard}>
              <ThemedText type="defaultSemiBold" style={styles.testTitle}>Full Practice Exam</ThemedText>
              <ThemedText>Complete simulation of the citizenship test</ThemedText>
            </ThemedView>

            <ThemedView style={styles.testCard}>
              <ThemedText type="defaultSemiBold" style={styles.testTitle}>Topic-specific Tests</ThemedText>
              <ThemedText>Focus on specific areas of the citizenship material</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    opacity: 0.8,
  },
  testsContainer: {
    gap: 16,
  },
  testCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  testTitle: {
    fontSize: 18,
  },
  headerImage: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});