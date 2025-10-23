# Todo App

A modern, responsive todo application that runs entirely in the browser with support for both LocalStorage and IndexedDB.

## Features

- Add, complete, and delete todos
- Filter todos by status (All, Active, Completed)
- Storage options: LocalStorage or IndexedDB
- Timestamps for each todo
- Responsive design
- Clean and modern UI
- Clear completed todos
- Persistent data storage

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

### Switching Storage Types

Use the radio buttons at the top to switch between LocalStorage and IndexedDB. Your todos are stored separately for each storage type.

## GitHub Pages Deployment

This app is designed to work with GitHub Pages. Simply enable GitHub Pages in your repository settings and point it to the main/master branch.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage API
- IndexedDB API

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- LocalStorage
- IndexedDB

## License

MIT
