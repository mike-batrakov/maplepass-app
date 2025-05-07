# MaplePass - GitHub Copilot Instructions

## Project Overview
MaplePass is a React Native (Expo) mobile app designed to help users prepare for the Canadian Citizenship Exam with study materials, practice tests, flashcards, and progress tracking.

## Code Style & Conventions
- Use **TypeScript** with proper typing for all components and functions
- Follow React Native / Expo best practices for performance
- Maintain a clean, functional component approach with hooks
- Use camelCase for variables/functions and PascalCase for components/interfaces
- Comment complex logic and keep code self-documenting when possible
- Platform-specific implementations use .ios.tsx and .android.tsx extensions
- Prefer themed components (ThemedText, ThemedView) over direct styling

## Project Structure
- `/app`: Main app code using Expo Router file-based navigation
  - `_layout.tsx`: Root layout configuration
  - `+not-found.tsx`: 404 error handling
  - `(tabs)/`: Tab-based navigation
    - `_layout.tsx`: Tab navigation configuration
    - `index.tsx`: Home screen
    - `explore.tsx`: Explore/discovery screen
- `/components`: Reusable UI components
  - `/ui`: Platform-specific UI components (TabBarBackground, IconSymbol)
  - `Collapsible.tsx`: Collapsible content container
  - `ParallaxScrollView.tsx`: Performance-optimized scrolling
  - `ThemedText.tsx`, `ThemedView.tsx`: Theme-aware components
  - `HapticTab.tsx`: Haptic feedback for tabs
- `/constants`: App-wide constants and theme information
  - `Colors.ts`: App color palette and theme definitions
- `/hooks`: Custom React hooks
  - `useColorScheme.ts`: Detect and manage color scheme
  - `useThemeColor.ts`: Access theme colors consistently
- `/assets`: Images, fonts, and other static assets
- `/docs`: Project documentation
- `/scripts`: Helper scripts for development

## Navigation Patterns
- Use Expo Router for file-based navigation
- Tab-based navigation in `app/(tabs)/` directory
- Stack-based navigation should use groups with parentheses and named routes
- Use modals for temporary content that shouldn't interrupt the main flow

## Theming & Styling
- Use the `useThemeColor` hook for accessing theme-based colors
- Prefer `ThemedText` and `ThemedView` over raw React Native components
- Get color values from `constants/Colors.ts` instead of hardcoding
- Support both light and dark modes for all UI components
- Follow platform-specific design conventions with .ios.tsx and .android.tsx files

## Feature Guidelines
When suggesting code for:
- **Study Materials**: Organize content by chapters from the "Discover Canada" guide
- **Practice Tests**: Support both free tests and premium (IAP) content
- **Flashcards**: Include proper animations for card flipping
- **Progress Tracking**: Maintain persistent storage of user progress
- **Gamification**: Implement passport stamp collection for achievements

## Component Patterns
- Use functional components with hooks
- Implement performance optimizations:
  - Memoize expensive calculations with useMemo
  - Use useCallback for function references
  - Implement proper list rendering with FlatList/SectionList
  - Use ParallaxScrollView for enhanced scroll experiences
- Maintain platform parity with graceful fallbacks for platform-specific features

## Dependencies
- React Native with Expo
- TypeScript
- Expo Router for navigation
- Context API for state management
- Planned: In-App Purchase integration

## Best Practices
- Keep accessibility in mind (VoiceOver/TalkBack support)
- Ensure proper error handling
- Implement offline support where possible
- Follow atomic design principles for components
- Performance: minimize re-renders, optimize images, use memoization appropriately
- Use HapticTab for tactile feedback in interactive components

## Platform-Specific Considerations
- iOS-specific UI components should use .ios.tsx extension
- Android-specific components should use .android.tsx extension
- Web support is a secondary priority but maintain compatibility where feasible

## Known Issues or Limitations
- Initial version targeting iOS and Android only (web is secondary priority)
- Handle offline/online transitions gracefully
- Account for different screen sizes across devices

## Domain-Specific Knowledge
- Canadian Citizenship exam content from "Discover Canada" guide
- Provincial/territorial knowledge requirements
- Historical, geographical, and governmental systems of Canada
- Rights and responsibilities of Canadian citizens