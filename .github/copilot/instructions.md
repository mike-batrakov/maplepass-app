# MaplePass - GitHub Copilot Instructions

## Project Overview
MaplePass is a React Native (Expo) mobile app designed to help users prepare for the Canadian Citizenship Exam with study materials, practice tests, flashcards, and progress tracking.

## Code Style & Conventions
- Use **TypeScript** with proper typing for all components and functions
- Follow React Native / Expo best practices for performance
- Maintain a clean, functional component approach with hooks
- Use camelCase for variables/functions and PascalCase for components/interfaces
- Comment complex logic and keep code self-documenting when possible

## Project Structure
- `/app`: Main app code using Expo Router file-based navigation
  - `/screens`: App screens (Home, Study, Tests, Flashcards, Progress)
- `/components`: Reusable UI components
- `/constants`: App-wide constants and theme information
- `/hooks`: Custom React hooks
- `/data`: Static data for citizenship exam content
- `/assets`: Images, fonts, and other static assets

## Feature Guidelines
When suggesting code for:
- **Study Materials**: Organize content by chapters from the "Discover Canada" guide
- **Practice Tests**: Support both free tests and premium (IAP) content
- **Flashcards**: Include proper animations for card flipping
- **Progress Tracking**: Maintain persistent storage of user progress
- **Gamification**: Implement passport stamp collection for achievements

## Dependencies
- React Native with Expo
- TypeScript
- React Navigation
- Expo Router
- Context API for state management
- Planned: In-App Purchase integration

## Best Practices
- Keep accessibility in mind (VoiceOver/TalkBack support)
- Ensure proper error handling
- Implement offline support where possible
- Follow atomic design principles for components
- Performance: minimize re-renders, optimize images, use memoization appropriately

## Known Issues or Limitations
- Initial version targeting iOS and Android only (web is secondary priority)
- Handle offline/online transitions gracefully
- Account for different screen sizes across devices