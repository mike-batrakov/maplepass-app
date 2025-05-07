import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function FlashcardsPage() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Flashcards',
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
          <ThemedText type="title" style={styles.title}>Flashcards</ThemedText>
          <ThemedText style={styles.description}>
            Use flashcards to memorize key facts about Canadian history, geography, government, and more.
          </ThemedText>

          <ThemedView style={styles.categoriesContainer}>
            <ThemedView style={styles.categoryCard}>
              <ThemedText type="defaultSemiBold" style={styles.categoryTitle}>History</ThemedText>
              <ThemedText>Learn about Canadian historical events and figures</ThemedText>
            </ThemedView>

            <ThemedView style={styles.categoryCard}>
              <ThemedText type="defaultSemiBold" style={styles.categoryTitle}>Government</ThemedText>
              <ThemedText>Understand Canada&apos;s system of government</ThemedText>
            </ThemedView>

            <ThemedView style={styles.categoryCard}>
              <ThemedText type="defaultSemiBold" style={styles.categoryTitle}>Geography</ThemedText>
              <ThemedText>Explore Canada&apos;s provinces, territories, and landmarks</ThemedText>
            </ThemedView>

            <ThemedView style={styles.categoryCard}>
              <ThemedText type="defaultSemiBold" style={styles.categoryTitle}>Rights & Responsibilities</ThemedText>
              <ThemedText>Learn about the rights and responsibilities of citizenship</ThemedText>
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
  categoriesContainer: {
    gap: 16,
  },
  categoryCard: {
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
  categoryTitle: {
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