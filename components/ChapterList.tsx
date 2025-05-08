import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

type Chapter = {
  id: number;
  title: string;
  description: string;
};

type ChapterListProps = {
  chapters: Chapter[];
};

export function ChapterList({ chapters }: ChapterListProps) {
  const router = useRouter();

  const handleChapterPress = (chapterId: number) => {
    router.push({
      pathname: "/study",
      params: { id: chapterId.toString() }
    });
  };

  return (
    <ThemedView style={styles.container}>
      {chapters.map((chapter) => (
        <TouchableOpacity
          key={chapter.id}
          style={styles.chapterItem}
          onPress={() => handleChapterPress(chapter.id)}
        >
          <View style={styles.chapterContent}>
            <ThemedText style={styles.chapterTitle}>
              Chapter {chapter.id}: {chapter.title}
            </ThemedText>
            <ThemedText style={styles.chapterDescription}>
              {chapter.description}
            </ThemedText>
          </View>
        </TouchableOpacity>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chapterItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chapterContent: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  chapterDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
});