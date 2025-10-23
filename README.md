# Todo

A minimal, iOS-style Progressive Web App for managing tasks with due dates and offline support.

## Features

- **Minimal iOS Design** - Clean, native iOS-style interface with smooth animations
- **Progressive Web App** - Install on any device and use offline
- **IndexedDB Storage** - Fast, reliable client-side database storage
- **Due Dates** - Set optional due dates with overdue indicators
- **Smart Sorting** - Auto-sorts by status, due date, and creation time
- **Offline First** - Works without internet via Service Worker
- **Touch Optimized** - Prevents iOS bounce/overscroll, optimized for touch
- **Dark Mode** - Automatic dark mode support based on system preference
- **iOS Safe Areas** - Respects notch and home indicator on modern devices
- **Smooth Animations** - iOS-style slide-in, bounce, and fade animations
- **Haptic Feedback** - Visual feedback for all interactions

## Installation

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home screen"
4. Tap "Add"

### Desktop (Chrome/Edge)
1. Visit the app
2. Click the install icon in the address bar
3. Click "Install"

## Technology Stack

- **HTML5** - Semantic markup with viewport-fit for iOS
- **CSS3** - Modern CSS with variables, animations, and safe-area-inset
- **JavaScript (ES2024+)** - Modern async/await, classes, optional chaining
- **IndexedDB** - Client-side database for persistent storage
- **Service Workers** - Offline functionality and caching
- **Web App Manifest** - PWA configuration

## Code Quality

- **Modern JavaScript** - ES2024+ features throughout
- **Async/Await** - All database operations are properly async
- **Error Handling** - Comprehensive try/catch with rollback on failure
- **Class-Based Architecture** - Clean separation of concerns
- **Event Delegation** - Efficient event handling
- **Accessibility** - ARIA labels and semantic HTML
- **Performance** - Element caching and efficient rendering

## iOS-Specific Features

- **Fixed Positioning** - Prevents scrolling out of container
- **Overscroll Prevention** - Disables pull-to-refresh and bounce
- **Safe Area Support** - Works with notch, Dynamic Island, home indicator
- **Touch Action** - Optimized touch handling
- **No Zoom** - Prevents accidental zoom on input focus
- **Status Bar Integration** - Proper status bar styling

## Due Date Features

- **Flexible Dates** - Optional due dates for any task
- **Smart Display** - "Today", "Tomorrow", or relative days
- **Overdue Alerts** - Red warning for overdue incomplete tasks
- **Auto Sorting** - Tasks sorted by due date automatically
- **Date Validation** - Prevents setting dates in the past

## Browser Support

- **iOS Safari** 14+
- **Chrome/Edge** 90+
- **Firefox** 88+
- **Samsung Internet** 15+

## Development

The app uses modern JavaScript features:
- ES6 Classes
- Async/await
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- Template literals
- Arrow functions
- Destructuring
- Promises

## Performance

- **Lazy Loading** - Service worker caches on demand
- **Optimistic Updates** - UI updates immediately with rollback on error
- **Efficient Rendering** - Only re-renders when necessary
- **Element Caching** - DOM queries cached at initialization
- **Event Delegation** - Single listener for all todo items

## Security

- **XSS Protection** - All user input is escaped before rendering
- **HTTPS Only** - Service workers require secure context
- **No External Dependencies** - Zero third-party libraries
- **CSP Ready** - Compatible with Content Security Policy

## Deployment

Deploy to GitHub Pages or any static host:
1. Push to your repository
2. Enable GitHub Pages in settings
3. Select your branch
4. Access at your GitHub Pages URL

## License

MIT

---

**Built with modern web standards and AGI-level code quality**
