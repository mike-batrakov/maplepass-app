import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ChapterList } from '../../components/ChapterList';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

type Chapter = {
  id: number;
  title: string;
  description: string;
};

export default function StudyScreen() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadChapters = async () => {
      try {
        // Load chapters from our JSON file
        const chaptersData = require('../../data/chapters.json');
        setChapters(chaptersData.chapters);
      } catch (error) {
        console.error('Failed to load chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChapters();
  }, []);

  const handleOpenPDF = () => {
    // Use the string path directly with a type assertion to avoid TypeScript errors
    router.push('/pdf-reader' as any);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ThemedText style={styles.title}>Study</ThemedText>
        <ThemedText style={styles.subtitle}>
          Learn everything you need to pass your citizenship exam
        </ThemedText>

        <TouchableOpacity
          style={styles.pdfButton}
          onPress={handleOpenPDF}
        >
          <ThemedText style={styles.pdfButtonText}>
            Open Full PDF Guide
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.sectionTitle}>Study Modules</ThemedText>

        {loading ? (
          <ThemedText>Loading chapters...</ThemedText>
        ) : (
          <ChapterList chapters={chapters} />
        )}
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
  pdfButton: {
    backgroundColor: '#4F6D7A',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginVertical: 16,
  },
  pdfButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});