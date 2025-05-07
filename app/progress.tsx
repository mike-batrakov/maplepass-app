import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ProgressPage() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Progress Tracker',
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
          <ThemedText type="title" style={styles.title}>Progress Tracker</ThemedText>
          <ThemedText style={styles.description}>
            Monitor your study progress and track your journey toward Canadian citizenship.
          </ThemedText>

          <ThemedView style={styles.statsContainer}>
            <ThemedView style={styles.statCard}>
              <ThemedText type="defaultSemiBold" style={styles.statTitle}>Study Progress</ThemedText>
              <ThemedText style={styles.statValue}>35%</ThemedText>
              <ThemedText>Chapters completed: 3/9</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statCard}>
              <ThemedText type="defaultSemiBold" style={styles.statTitle}>Test Scores</ThemedText>
              <ThemedText style={styles.statValue}>72%</ThemedText>
              <ThemedText>Average score on practice tests</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statCard}>
              <ThemedText type="defaultSemiBold" style={styles.statTitle}>Flashcards Mastered</ThemedText>
              <ThemedText style={styles.statValue}>48/120</ThemedText>
              <ThemedText>Keep practicing to master more!</ThemedText>
            </ThemedView>

            <ThemedView style={styles.passportContainer}>
              <ThemedText type="defaultSemiBold" style={styles.passportTitle}>Passport Progress</ThemedText>
              <ThemedText>Collect stamps by completing chapters and tests!</ThemedText>
              <ThemedView style={styles.stampGrid}>
                {/* Stamps would be rendered here */}
                <ThemedText>4 stamps collected</ThemedText>
              </ThemedView>
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
  statsContainer: {
    gap: 16,
  },
  statCard: {
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
  statTitle: {
    fontSize: 18,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  passportContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  passportTitle: {
    fontSize: 18,
  },
  stampGrid: {
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    alignItems: 'center',
    padding: 20,
  },
  headerImage: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});