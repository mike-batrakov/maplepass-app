import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

// Type for a chapter from our JSON data
type Chapter = {
  id: number;
  title: string;
  description: string;
  content: string;
};

export default function ChapterReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChapter = async () => {
      try {
        // Load chapter data from our JSON file
        const chaptersData = require('../data/chapters.json');
        const foundChapter = chaptersData.chapters.find(
          (ch: Chapter) => ch.id === Number(id)
        );

        setChapter(foundChapter || null);
      } catch (error) {
        console.error('Failed to load chapter:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChapter();
  }, [id]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading chapter...</ThemedText>
      </ThemedView>
    );
  }

  if (!chapter) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Chapter not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ThemedText style={styles.title}>
          Chapter {chapter.id}: {chapter.title}
        </ThemedText>

        <ThemedText style={styles.description}>
          {chapter.description}
        </ThemedText>

        <ThemedText style={styles.content}>
          {chapter.content}
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 18,
    marginBottom: 24,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});