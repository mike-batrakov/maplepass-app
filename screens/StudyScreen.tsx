import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

export default function StudyScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ThemedText style={styles.title}>Study</ThemedText>
        <ThemedText style={styles.subtitle}>
          Learn everything you need to pass your citizenship exam
        </ThemedText>

        <ThemedText style={styles.sectionTitle}>Study Modules</ThemedText>
        <ThemedText style={styles.paragraph}>
          • Chapter 1: Rights and Responsibilities{'\n'}
          • Chapter 2: Who We Are{'\n'}
          • Chapter 3: Canada's History{'\n'}
          • Chapter 4: Modern Canada{'\n'}
          • Chapter 5: How Canadians Govern Themselves
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