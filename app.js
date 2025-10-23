// Todo App with LocalStorage and IndexedDB support

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.storageType = 'localStorage';
        this.db = null;

        this.initElements();
        this.initIndexedDB();
        this.attachEventListeners();
        this.loadTodos();
    }

    initElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.statsEl = document.getElementById('stats');
        this.storageRadios = document.querySelectorAll('input[name="storage"]');
    }

    initIndexedDB() {
        const request = indexedDB.open('TodoDB', 1);

        request.onerror = () => {
            console.error('IndexedDB failed to open');
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log('IndexedDB opened successfully');
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('todos')) {
                const objectStore = db.createObjectStore('todos', { keyPath: 'id' });
                objectStore.createIndex('completed', 'completed', { unique: false });
            }
        };
    }

    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.filter;
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderTodos();
            });
        });

        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());

        this.storageRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.storageType = e.target.value;
                this.loadTodos();
            });
        });
    }

    async addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        await this.saveTodos();
        this.todoInput.value = '';
        this.renderTodos();
    }

    async toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            await this.saveTodos();
            this.renderTodos();
        }
    }

    async deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        await this.saveTodos();
        this.renderTodos();
    }

    async clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        await this.saveTodos();
        this.renderTodos();
    }

    async saveTodos() {
        if (this.storageType === 'localStorage') {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } else {
            await this.saveToIndexedDB();
        }
    }

    async loadTodos() {
        if (this.storageType === 'localStorage') {
            const stored = localStorage.getItem('todos');
            this.todos = stored ? JSON.parse(stored) : [];
        } else {
            await this.loadFromIndexedDB();
        }
        this.renderTodos();
    }

    async saveToIndexedDB() {
        if (!this.db) {
            console.error('IndexedDB not initialized');
            return;
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['todos'], 'readwrite');
            const objectStore = transaction.objectStore('todos');

            // Clear existing todos
            objectStore.clear();

            // Add all current todos
            this.todos.forEach(todo => {
                objectStore.add(todo);
            });

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    async loadFromIndexedDB() {
        if (!this.db) {
            // Wait for DB to initialize
            await new Promise(resolve => setTimeout(resolve, 100));
            if (!this.db) {
                console.error('IndexedDB not initialized');
                this.todos = [];
                return;
            }
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['todos'], 'readonly');
            const objectStore = transaction.objectStore('todos');
            const request = objectStore.getAll();

            request.onsuccess = () => {
                this.todos = request.result;
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    renderTodos() {
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = '<div class="empty-state"><p>No todos to display</p></div>';
        } else {
            this.todoList.innerHTML = filteredTodos.map(todo => `
                <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}
                           onchange="app.toggleTodo(${todo.id})">
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <span class="todo-date">${this.formatDate(todo.createdAt)}</span>
                    <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">Delete</button>
                </li>
            `).join('');
        }

        this.updateStats();
    }

    updateStats() {
        const activeCount = this.todos.filter(t => !t.completed).length;
        const completedCount = this.todos.filter(t => t.completed).length;
        this.statsEl.textContent = `${activeCount} active, ${completedCount} completed`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new TodoApp();
    });
} else {
    app = new TodoApp();
}

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration.scope);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('New service worker found, installing...');

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker available, prompt user to refresh
                            if (confirm('New version available! Reload to update?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });

    // Reload page when new service worker takes control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}
