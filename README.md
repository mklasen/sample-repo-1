# Todo App

A modern, responsive Progressive Web App (PWA) that runs entirely in the browser with support for both LocalStorage and IndexedDB.

## Features

- **Progressive Web App (PWA)** - Install on your device and use offline
- **Add to Home Screen** - Works like a native app on mobile and desktop
- **Offline Support** - Works without internet connection via Service Worker
- Add, complete, and delete todos
- Filter todos by status (All, Active, Completed)
- Storage options: LocalStorage or IndexedDB
- Timestamps for each todo
- Responsive design
- Clean and modern UI with gradient design
- Clear completed todos
- Persistent data storage
- SVG favicon for crisp icon display

## Storage Options

### LocalStorage
- Simple key-value storage
- Synchronous API
- Stores data as JSON strings
- Storage limit: ~5-10MB

### IndexedDB
- More robust database solution
- Asynchronous API
- Better for larger datasets
- Storage limit: Much larger (hundreds of MBs)

## Usage

Simply open `index.html` in your browser, or visit the GitHub Pages URL.

### Installing as a PWA

#### On Desktop (Chrome/Edge/Opera):
1. Visit the app in your browser
2. Click the install icon in the address bar (⊕ or +)
3. Click "Install" in the popup
4. The app will open in its own window

#### On Mobile (Android):
1. Open the app in Chrome or supported browser
2. Tap the menu (⋮) and select "Add to Home screen"
3. Tap "Add" to confirm
4. The app icon will appear on your home screen

#### On iOS (Safari):
1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm

### Switching Storage Types

Use the radio buttons at the top to switch between LocalStorage and IndexedDB. Your todos are stored separately for each storage type.

## GitHub Pages Deployment

This app is designed to work with GitHub Pages. Simply enable GitHub Pages in your repository settings and point it to the main/master branch.

## PWA Icon Generation

The app includes placeholder icons. To generate proper icons:

1. Open `generate-icons.html` in a web browser
2. Click the download buttons for 192x192 and 512x512 icons
3. Replace the placeholder `icon-192.png` and `icon-512.png` files with the downloaded icons

Alternatively, the SVG favicon (`favicon.svg`) will be used as a fallback on modern browsers.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage API
- IndexedDB API
- Service Workers
- Web App Manifest
- PWA Technologies

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- LocalStorage
- IndexedDB
- Service Workers
- Web App Manifest

PWA installation is supported on:
- Chrome/Edge/Opera (Desktop & Mobile)
- Safari (iOS & macOS)
- Firefox (with limitations)
- Samsung Internet

## License

MIT
