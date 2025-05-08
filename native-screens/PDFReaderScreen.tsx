import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

// Define a type for our bookmarks
type Bookmark = {
  id: string;
  page: number;
  title: string;
  createdAt: Date;
};

// Define a type for our annotations
type Annotation = {
  id: string;
  page: number;
  text: string;
  color: string;
  createdAt: Date;
};

// Define a simple TOC structure
type TOCItem = {
  id: number;
  title: string;
  page: number;
  level: number;
};

// Predefined table of contents for Discover Canada
const tableOfContents: TOCItem[] = [
  { id: 1, title: "Cover Page", page: 1, level: 0 },
  { id: 2, title: "Introduction", page: 3, level: 0 },
  { id: 3, title: "Rights and Responsibilities of Citizenship", page: 8, level: 0 },
  { id: 4, title: "Who We Are", page: 12, level: 0 },
  { id: 5, title: "Canada's History", page: 16, level: 0 },
  { id: 6, title: "Modern Canada", page: 25, level: 0 },
  { id: 7, title: "How Canadians Govern Themselves", page: 31, level: 0 },
  { id: 8, title: "Federal Elections", page: 35, level: 1 },
  { id: 9, title: "The Justice System", page: 38, level: 0 },
  { id: 10, title: "Canadian Symbols", page: 40, level: 0 },
  { id: 11, title: "Canada's Economy", page: 45, level: 0 },
  { id: 12, title: "Canada's Regions", page: 50, level: 0 },
  { id: 13, title: "Study Questions", page: 55, level: 0 },
];

export default function PDFReaderScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isBookmarksVisible, setIsBookmarksVisible] = useState(false);
  const [isAnnotationsVisible, setIsAnnotationsVisible] = useState(false);
  const [isTOCVisible, setIsTOCVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [annotationText, setAnnotationText] = useState('');
  const [annotationColor, setAnnotationColor] = useState('#FFFF00'); // Yellow

  const pdfRef = useRef<any>(null);

  // Source can be a remote URL or a local file
  const source = require('../assets/pdfs/discover_canada.pdf');

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Pdf = require('react-native-pdf').default;

  // Load saved data on component mount
  useEffect(() => {
    loadSavedState();
  }, []);

  // Load bookmarks, annotations, and last reading position
  const loadSavedState = async () => {
    try {
      // Load bookmarks
      const savedBookmarks = await AsyncStorage.getItem('pdf_bookmarks');
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }

      // Load annotations
      const savedAnnotations = await AsyncStorage.getItem('pdf_annotations');
      if (savedAnnotations) {
        setAnnotations(JSON.parse(savedAnnotations));
      }

      // Load last reading position
      const lastPage = await AsyncStorage.getItem('pdf_last_page');
      if (lastPage) {
        setCurrentPage(parseInt(lastPage, 10));
        // We'll jump to this page once the PDF is loaded
      }
    } catch (error) {
      console.error('Failed to load saved state:', error);
    }
  };

  // Save bookmarks to AsyncStorage
  const saveBookmarks = async (updatedBookmarks: Bookmark[]) => {
    try {
      await AsyncStorage.setItem('pdf_bookmarks', JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  };

  // Save annotations to AsyncStorage
  const saveAnnotations = async (updatedAnnotations: Annotation[]) => {
    try {
      await AsyncStorage.setItem('pdf_annotations', JSON.stringify(updatedAnnotations));
    } catch (error) {
      console.error('Failed to save annotations:', error);
    }
  };

  // Save last reading position
  const saveLastPage = async (page: number) => {
    try {
      await AsyncStorage.setItem('pdf_last_page', page.toString());
    } catch (error) {
      console.error('Failed to save last page:', error);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    saveLastPage(page);
  };

  // Add a bookmark for the current page
  const addBookmark = () => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      page: currentPage,
      title: `Page ${currentPage}`,
      createdAt: new Date(),
    };

    // Check if this page is already bookmarked
    if (bookmarks.some(bookmark => bookmark.page === currentPage)) {
      Alert.alert('Already Bookmarked', 'This page is already bookmarked.');
      return;
    }

    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    saveBookmarks(updatedBookmarks);
    Alert.alert('Bookmark Added', `Page ${currentPage} has been bookmarked.`);
  };

  // Remove a bookmark
  const removeBookmark = (id: string) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    setBookmarks(updatedBookmarks);
    saveBookmarks(updatedBookmarks);
  };

  // Jump to a specific page
  const goToPage = (page: number) => {
    if (pdfRef.current && page > 0 && page <= totalPages) {
      pdfRef.current.setPage(page);
    }
  };

  // Add an annotation to the current page
  const addAnnotation = () => {
    if (!annotationText.trim()) {
      Alert.alert('Empty Annotation', 'Please enter text for the annotation.');
      return;
    }

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      page: currentPage,
      text: annotationText,
      color: annotationColor,
      createdAt: new Date(),
    };

    const updatedAnnotations = [...annotations, newAnnotation];
    setAnnotations(updatedAnnotations);
    saveAnnotations(updatedAnnotations);
    setAnnotationText('');
    setIsAnnotating(false);
    Alert.alert('Annotation Added', `Your annotation has been added to page ${currentPage}.`);
  };

  // Remove an annotation
  const removeAnnotation = (id: string) => {
    const updatedAnnotations = annotations.filter(annotation => annotation.id !== id);
    setAnnotations(updatedAnnotations);
    saveAnnotations(updatedAnnotations);
  };

  // Perform search (mock implementation - react-native-pdf doesn't support text search directly)
  const performSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Empty Search', 'Please enter a search term.');
      return;
    }

    // This is a mock search that would need to be replaced with actual PDF text extraction
    // In a real implementation, you'd need a library that can extract text from PDFs
    Alert.alert('Search Not Fully Implemented',
      'This is a demonstration of the search UI. Full PDF text search requires additional libraries.');

    // Mock results based on TOC for demonstration purposes
    const results = tableOfContents.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(item => ({
      page: item.page,
      title: item.title,
      snippet: `...${item.title} (found on page ${item.page})...`
    }));

    setSearchResults(results);
  };

  // Share functionality
  const sharePDF = async () => {
    try {
      // Mock implementation since we can't actually share the bundled PDF directly
      Alert.alert('Share Feature',
        'In a production app, this would share the PDF. For security reasons, we cannot directly share bundled assets in this demo.');

      // In a real implementation with a downloadable PDF:
      // await Share.share({
      //   title: 'Discover Canada Guide',
      //   message: 'Check out this guide to help with your Canadian citizenship test!',
      //   url: Platform.OS === 'ios' ? `file://${source.uri}` : source.uri,
      // });
    } catch (error) {
      console.error('Error sharing PDF:', error);
      Alert.alert('Sharing failed', 'There was an error sharing the PDF.');
    }
  };

  // Zoom controls
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3.0)); // Max zoom 3x
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5)); // Min zoom 0.5x
  };

  // Render bookmark item
  const renderBookmarkItem = ({ item }: { item: Bookmark }) => (
    <TouchableOpacity
      style={[styles.listItem, { borderColor: isDark ? '#333333' : '#cccccc' }]}
      onPress={() => {
        goToPage(item.page);
        setIsBookmarksVisible(false);
      }}
    >
      <View style={styles.listItemContent}>
        <ThemedText style={styles.listItemTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.listItemSubtitle}>Page {item.page}</ThemedText>
      </View>
      <TouchableOpacity onPress={() => removeBookmark(item.id)}>
        <Ionicons name="trash-outline" size={24} color={colors.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render annotation item
  const renderAnnotationItem = ({ item }: { item: Annotation }) => (
    <TouchableOpacity
      style={[styles.listItem, { borderColor: isDark ? '#333333' : '#cccccc' }]}
      onPress={() => {
        goToPage(item.page);
        setIsAnnotationsVisible(false);
      }}
    >
      <View style={[styles.listItemContent, { borderLeftWidth: 4, borderLeftColor: item.color }]}>
        <ThemedText style={styles.listItemTitle}>Page {item.page}</ThemedText>
        <ThemedText style={styles.listItemSubtitle}>{item.text}</ThemedText>
      </View>
      <TouchableOpacity onPress={() => removeAnnotation(item.id)}>
        <Ionicons name="trash-outline" size={24} color={colors.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render TOC item
  const renderTOCItem = ({ item }: { item: TOCItem }) => (
    <TouchableOpacity
      style={[
        styles.tocItem,
        {
          paddingLeft: 20 + (item.level * 20),
          borderColor: isDark ? '#333333' : '#cccccc'
        }
      ]}
      onPress={() => {
        goToPage(item.page);
        setIsTOCVisible(false);
      }}
    >
      <ThemedText style={styles.tocItemTitle}>{item.title}</ThemedText>
      <ThemedText style={styles.tocItemPage}>p. {item.page}</ThemedText>
    </TouchableOpacity>
  );

  // Render search result item
  const renderSearchResultItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.listItem, { borderColor: isDark ? '#333333' : '#cccccc' }]}
      onPress={() => {
        goToPage(item.page);
        setIsSearchVisible(false);
      }}
    >
      <View style={styles.listItemContent}>
        <ThemedText style={styles.listItemTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.listItemSubtitle}>Page {item.page}</ThemedText>
        <ThemedText style={styles.searchSnippet}>{item.snippet}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  // Annotations on current page
  const currentPageAnnotations = annotations.filter(
    annotation => annotation.page === currentPage
  );

  return (
    <ThemedView style={styles.container}>
      {/* PDF View */}
      <View style={styles.pdfContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
            <ThemedText style={styles.loadingText}>Loading PDF...</ThemedText>
          </View>
        )}

        <Pdf
          ref={pdfRef}
          source={source}
          style={[styles.pdf, { transform: [{ scale }] }]}
          page={currentPage}
          scale={scale}
          spacing={0}
          minScale={0.5}
          maxScale={3.0}
          onLoadComplete={(numberOfPages: number, filePath: string) => {
            console.log(`PDF loaded: ${numberOfPages} pages`);
            setLoading(false);
            setTotalPages(numberOfPages);
          }}
          onPageChanged={handlePageChange}
          onError={(error: Error) => {
            console.error('PDF Error:', error);
            setLoading(false);
            Alert.alert('Error', 'Failed to load the PDF. Please try again.');
          }}
          enablePaging={true}
          enableAnnotationRendering={true}
          // If the PDF library supports annotations in future:
          // annotationRenderingMode="embedded"
        />
      </View>

      {/* Current Page Annotations Display */}
      {currentPageAnnotations.length > 0 && (
        <View style={styles.currentAnnotationsContainer}>
          <ScrollView>
            {currentPageAnnotations.map(annotation => (
              <View
                key={annotation.id}
                style={[
                  styles.currentAnnotation,
                  {
                    backgroundColor: `${annotation.color}50`, // 50% opacity
                    borderLeftColor: annotation.color
                  }
                ]}
              >
                <Text style={styles.annotationText}>{annotation.text}</Text>
                <TouchableOpacity onPress={() => removeAnnotation(annotation.id)}>
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Bottom Control Bar */}
      <View style={[styles.controlBar, { backgroundColor: isDark ? '#1c1c1c' : '#f5f5f5' }]}>
        <TouchableOpacity onPress={() => setIsBookmarksVisible(true)}>
          <Ionicons name="bookmark-outline" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsAnnotationsVisible(true)}>
          <Ionicons name="document-text-outline" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsTOCVisible(true)}>
          <Ionicons name="list-outline" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSearchVisible(true)}>
          <Ionicons name="search-outline" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsAnnotating(true)}>
          <Ionicons name="create-outline" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={sharePDF}>
          <Ionicons name="share-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Zoom Controls */}
      <View style={[styles.zoomControls, { backgroundColor: isDark ? '#1c1c1c' : '#f5f5f5' }]}>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
          <Ionicons name="remove" size={24} color={colors.text} />
        </TouchableOpacity>

        <ThemedText style={styles.zoomText}>{Math.round(scale * 100)}%</ThemedText>

        <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
          <Ionicons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Page Controls */}
      <View style={[styles.pageControls, { backgroundColor: isDark ? '#1c1c1c' : '#f5f5f5' }]}>
        <TouchableOpacity
          style={styles.pageButton}
          onPress={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentPage <= 1 ? '#999999' : colors.text}
          />
        </TouchableOpacity>

        <View style={styles.pageNumberContainer}>
          <ThemedText style={styles.pageNumber}>
            {currentPage} / {totalPages}
          </ThemedText>
        </View>

        <TouchableOpacity
          style={styles.pageButton}
          onPress={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentPage >= totalPages ? '#999999' : colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Add Bookmark Button */}
      <TouchableOpacity
        style={[styles.addBookmarkButton, { backgroundColor: colors.tint }]}
        onPress={addBookmark}
      >
        <Ionicons name="bookmark" size={24} color="white" />
      </TouchableOpacity>

      {/* Bookmarks Modal */}
      <Modal
        visible={isBookmarksVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsBookmarksVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' }]}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#121212' : 'white' }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Bookmarks</ThemedText>
              <TouchableOpacity onPress={() => setIsBookmarksVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {bookmarks.length === 0 ? (
              <ThemedText style={styles.emptyStateText}>
                You don&apos;t have any bookmarks yet. Tap the bookmark button to add one.
              </ThemedText>
            ) : (
              <FlatList
                data={bookmarks.sort((a, b) => a.page - b.page)}
                renderItem={renderBookmarkItem}
                keyExtractor={item => item.id}
                style={styles.list}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Table of Contents Modal */}
      <Modal
        visible={isTOCVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsTOCVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' }]}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#121212' : 'white' }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Table of Contents</ThemedText>
              <TouchableOpacity onPress={() => setIsTOCVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={tableOfContents}
              renderItem={renderTOCItem}
              keyExtractor={item => item.id.toString()}
              style={styles.list}
            />
          </View>
        </View>
      </Modal>

      {/* Search Modal */}
      <Modal
        visible={isSearchVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSearchVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' }]}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#121212' : 'white' }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Search</ThemedText>
              <TouchableOpacity onPress={() => setIsSearchVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    backgroundColor: isDark ? '#333' : '#f0f0f0',
                    color: isDark ? 'white' : 'black'
                  }
                ]}
                placeholder="Enter search term..."
                placeholderTextColor={isDark ? '#aaa' : '#666'}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity
                style={[styles.searchButton, { backgroundColor: colors.tint }]}
                onPress={performSearch}
              >
                <ThemedText style={styles.searchButtonText}>Search</ThemedText>
              </TouchableOpacity>
            </View>

            {searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResultItem}
                keyExtractor={(item, index) => `search-result-${index}`}
                style={styles.list}
              />
            ) : (
              searchQuery.trim() ? (
                <ThemedText style={styles.emptyStateText}>
                  No results found. Try different search terms.
                </ThemedText>
              ) : (
                <ThemedText style={styles.emptyStateText}>
                  Enter a term to search in the document.
                </ThemedText>
              )
            )}
          </View>
        </View>
      </Modal>

      {/* Annotation Modal */}
      <Modal
        visible={isAnnotating}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAnnotating(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' }]}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#121212' : 'white' }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Add Annotation</ThemedText>
              <TouchableOpacity onPress={() => setIsAnnotating(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.annotationLabel}>
              Page {currentPage}
            </ThemedText>

            <TextInput
              style={[
                styles.annotationInput,
                {
                  backgroundColor: isDark ? '#333' : '#f0f0f0',
                  color: isDark ? 'white' : 'black'
                }
              ]}
              placeholder="Enter your notes..."
              placeholderTextColor={isDark ? '#aaa' : '#666'}
              value={annotationText}
              onChangeText={setAnnotationText}
              multiline={true}
              numberOfLines={4}
            />

            <View style={styles.colorPickerContainer}>
              <ThemedText style={styles.colorPickerLabel}>Color:</ThemedText>
              <View style={styles.colorOptions}>
                {['#FFFF00', '#FF9999', '#99FF99', '#9999FF', '#FFCC99'].map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      annotationColor === color && styles.selectedColorOption
                    ]}
                    onPress={() => setAnnotationColor(color)}
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.tint }]}
              onPress={addAnnotation}
            >
              <ThemedText style={styles.addButtonText}>Save Annotation</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Annotations Modal */}
      <Modal
        visible={isAnnotationsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAnnotationsVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' }]}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#121212' : 'white' }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Annotations</ThemedText>
              <TouchableOpacity onPress={() => setIsAnnotationsVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {annotations.length === 0 ? (
              <ThemedText style={styles.emptyStateText}>
                You don&apos;t have any annotations yet. Tap the pencil button to add notes to pages.
              </ThemedText>
            ) : (
              <FlatList
                data={annotations.sort((a, b) => a.page - b.page)}
                renderItem={renderAnnotationItem}
                keyExtractor={item => item.id}
                style={styles.list}
              />
            )}
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdfContainer: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  currentAnnotationsContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    maxHeight: 100,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentAnnotation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginBottom: 5,
    borderRadius: 4,
    borderLeftWidth: 4,
  },
  annotationText: {
    flex: 1,
    fontSize: 12,
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  zoomControls: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 20,
    right: 10,
    top: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  zoomButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomText: {
    marginHorizontal: 8,
    fontWeight: '600',
    fontSize: 12,
  },
  pageControls: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 20,
    left: 10,
    top: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNumberContainer: {
    paddingHorizontal: 10,
  },
  pageNumber: {
    fontWeight: '600',
    fontSize: 12,
  },
  addBookmarkButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  listItemContent: {
    flex: 1,
    paddingRight: 10,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  tocItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingRight: 15,
    borderBottomWidth: 1,
  },
  tocItemTitle: {
    fontSize: 16,
    flex: 1,
  },
  tocItemPage: {
    fontSize: 14,
    opacity: 0.7,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  searchSnippet: {
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
  annotationLabel: {
    marginBottom: 10,
    fontWeight: '600',
  },
  annotationInput: {
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  colorPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  colorPickerLabel: {
    marginRight: 10,
  },
  colorOptions: {
    flexDirection: 'row',
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#666',
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});