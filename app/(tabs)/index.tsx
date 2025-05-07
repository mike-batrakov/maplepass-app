import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function HomeScreen() {
  const secondaryColor = useThemeColor({ light: '#A1CEDC', dark: '#1D3D47' }, 'background');

  // Define type-safe routes
  const navigateToScreen = (screen: 'study' | 'practice' | 'flashcards' | 'progress') => {
    // Cast the route to the appropriate type that router.push expects
    router.push(screen as any);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.pageTitle}>MaplePass</ThemedText>
        <ThemedText style={styles.subtitle}>Prepare for your Canadian Citizenship Exam</ThemedText>

        <ThemedView style={styles.navButtonsContainer}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: secondaryColor }]}
            onPress={() => navigateToScreen('study')}
            accessibilityLabel="Study Book"
            accessibilityRole="button"
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Study Book</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: secondaryColor }]}
            onPress={() => navigateToScreen('practice')}
            accessibilityLabel="Practice Tests"
            accessibilityRole="button"
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Practice Tests</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: secondaryColor }]}
            onPress={() => navigateToScreen('flashcards')}
            accessibilityLabel="Flashcards"
            accessibilityRole="button"
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Flashcards</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: secondaryColor }]}
            onPress={() => navigateToScreen('progress')}
            accessibilityLabel="Progress Tracker"
            accessibilityRole="button"
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Progress Tracker</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    opacity: 0.8,
  },
  navButtonsContainer: {
    gap: 16,
    width: '100%',
  },
  navButton: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
