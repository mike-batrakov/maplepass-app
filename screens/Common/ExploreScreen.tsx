import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ThemedText style={styles.title}>Explore</ThemedText>
        <ThemedText style={styles.subtitle}>
          Discover Canadian citizenship materials
        </ThemedText>

        <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
        <ThemedText style={styles.paragraph}>
          • History of Canada{'\n'}
          • Geography{'\n'}
          • Government and Politics{'\n'}
          • Canadian Symbols{'\n'}
          • Rights and Responsibilities
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
  },
});