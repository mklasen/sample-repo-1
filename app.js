// Modern Todo App with IndexedDB - AGI Level Implementation
// Using ES2024+ features and best practices

class DatabaseManager {
    constructor(dbName = 'TodoAppDB', version = 1) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains('todos')) {
                    const store = db.createObjectStore('todos', { keyPath: 'id' });
                    store.createIndex('completed', 'completed', { unique: false });
                    store.createIndex('dueDate', 'dueDate', { unique: false });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                }
            };
        });
    }

    async getAll() {
        const tx = this.db.transaction('todos', 'readonly');
        const store = tx.objectStore('todos');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async add(todo) {
        const tx = this.db.transaction('todos', 'readwrite');
        const store = tx.objectStore('todos');
        return new Promise((resolve, reject) => {
            const request = store.add(todo);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async update(todo) {
        const tx = this.db.transaction('todos', 'readwrite');
        const store = tx.objectStore('todos');
        return new Promise((resolve, reject) => {
            const request = store.put(todo);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(id) {
        const tx = this.db.transaction('todos', 'readwrite');
        const store = tx.objectStore('todos');
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async deleteMultiple(ids) {
        const tx = this.db.transaction('todos', 'readwrite');
        const store = tx.objectStore('todos');
        const promises = ids.map(id =>
            new Promise((resolve, reject) => {
                const request = store.delete(id);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            })
        );
        return Promise.all(promises);
    }
}

class TodoApp {
    constructor() {
        this.db = new DatabaseManager();
        this.todos = [];
        this.currentFilter = 'all';
        this.elements = this.cacheElements();
        this.init();
    }

    cacheElements() {
        return {
            todoInput: document.getElementById('todoInput'),
            dueDateInput: document.getElementById('dueDateInput'),
            addBtn: document.getElementById('addBtn'),
            todoList: document.getElementById('todoList'),
            filterBtns: document.querySelectorAll('.filter-btn'),
            clearBtn: document.getElementById('clearCompleted'),
            stats: document.getElementById('stats')
        };
    }

    async init() {
        try {
            await this.db.init();
            await this.loadTodos();
            this.attachEventListeners();
            this.preventIOSBounce();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize. Please refresh.');
        }
    }

    attachEventListeners() {
        const { todoInput, addBtn, filterBtns, clearBtn, dueDateInput, todoList } = this.elements;

        // Add todo
        addBtn.addEventListener('click', () => this.handleAddTodo());
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleAddTodo();
        });

        // Filter todos
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterChange(e.target));
        });

        // Clear completed
        clearBtn.addEventListener('click', () => this.handleClearCompleted());

        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        dueDateInput.min = today;

        // Todo list interactions (using event delegation)
        todoList.addEventListener('change', (e) => {
            if (e.target.classList.contains('todo-checkbox')) {
                const id = parseInt(e.target.dataset.id);
                this.handleToggleTodo(id);
            }
        });

        todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn') ||
                e.target.closest('.delete-btn')) {
                const btn = e.target.closest('.delete-btn');
                const id = parseInt(btn.dataset.id);
                this.handleDeleteTodo(id);
            }
        });
    }

    preventIOSBounce() {
        // Prevent pull-to-refresh and overscroll on iOS
        let lastTouchY = 0;
        const listContainer = document.querySelector('.list-container');

        document.body.addEventListener('touchstart', (e) => {
            lastTouchY = e.touches[0].clientY;
        }, { passive: false });

        document.body.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const touchYDelta = touchY - lastTouchY;
            lastTouchY = touchY;

            // Prevent pull-to-refresh
            if (!listContainer.contains(e.target) && touchYDelta > 0) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    async handleAddTodo() {
        const { todoInput, dueDateInput } = this.elements;
        const text = todoInput.value.trim();

        if (!text) {
            this.shake(todoInput);
            return;
        }

        const todo = {
            id: Date.now(),
            text,
            completed: false,
            createdAt: new Date().toISOString(),
            dueDate: dueDateInput.value || null
        };

        try {
            await this.db.add(todo);
            this.todos.push(todo);
            this.render();

            // Clear inputs with animation
            todoInput.value = '';
            dueDateInput.value = '';
            this.flash(this.elements.addBtn);
        } catch (error) {
            console.error('Failed to add todo:', error);
            this.showError('Failed to add task');
        }
    }

    async handleToggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        todo.completed = !todo.completed;

        try {
            await this.db.update(todo);
            this.render();
        } catch (error) {
            console.error('Failed to update todo:', error);
            todo.completed = !todo.completed; // Rollback
            this.showError('Failed to update task');
        }
    }

    async handleDeleteTodo(id) {
        const element = document.querySelector(`[data-id="${id}"]`);
        element?.classList.add('deleting');

        await new Promise(resolve => setTimeout(resolve, 300));

        try {
            await this.db.delete(id);
            this.todos = this.todos.filter(t => t.id !== id);
            this.render();
        } catch (error) {
            console.error('Failed to delete todo:', error);
            element?.classList.remove('deleting');
            this.showError('Failed to delete task');
        }
    }

    handleFilterChange(button) {
        this.elements.filterBtns.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.currentFilter = button.dataset.filter;
        this.render();
    }

    async handleClearCompleted() {
        const completedIds = this.todos
            .filter(t => t.completed)
            .map(t => t.id);

        if (completedIds.length === 0) return;

        // Animate out
        completedIds.forEach(id => {
            const element = document.querySelector(`[data-id="${id}"]`);
            element?.classList.add('deleting');
        });

        await new Promise(resolve => setTimeout(resolve, 300));

        try {
            await this.db.deleteMultiple(completedIds);
            this.todos = this.todos.filter(t => !t.completed);
            this.render();
        } catch (error) {
            console.error('Failed to clear completed:', error);
            this.showError('Failed to clear tasks');
        }
    }

    async loadTodos() {
        try {
            this.todos = await this.db.getAll();
            this.render();
        } catch (error) {
            console.error('Failed to load todos:', error);
            this.showError('Failed to load tasks');
        }
    }

    getFilteredTodos() {
        const filtered = {
            all: this.todos,
            active: this.todos.filter(t => !t.completed),
            completed: this.todos.filter(t => t.completed)
        }[this.currentFilter];

        // Sort: active first, then by due date, then by creation date
        return filtered.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
            if (a.dueDate) return -1;
            if (b.dueDate) return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }

    render() {
        const filtered = this.getFilteredTodos();
        const { todoList } = this.elements;

        if (filtered.length === 0) {
            todoList.innerHTML = this.renderEmptyState();
        } else {
            todoList.innerHTML = filtered.map(todo => this.renderTodoItem(todo)).join('');
        }

        this.updateStats();
    }

    renderTodoItem(todo) {
        const dueInfo = this.getDueDateInfo(todo.dueDate);
        const overdueClass = dueInfo.isOverdue && !todo.completed ? 'overdue' : '';

        return `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-checkbox-wrapper">
                    <input type="checkbox"
                           class="todo-checkbox"
                           ${todo.completed ? 'checked' : ''}
                           data-id="${todo.id}">
                    <div class="checkbox-custom"></div>
                </div>
                <div class="todo-content">
                    <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                    <div class="todo-meta">
                        ${dueInfo.text ? `
                            <span class="todo-date ${overdueClass}">
                                ${dueInfo.icon} ${dueInfo.text}
                            </span>
                        ` : ''}
                        <span class="todo-created">${this.formatRelativeTime(todo.createdAt)}</span>
                    </div>
                </div>
                <button class="delete-btn"
                        data-id="${todo.id}"
                        aria-label="Delete task">
                    ×
                </button>
            </li>
        `;
    }

    renderEmptyState() {
        const messages = {
            all: { icon: '📋', text: 'No tasks yet', sub: 'Add your first task above' },
            active: { icon: '✨', text: 'All done!', sub: 'No active tasks' },
            completed: { icon: '🎯', text: 'No completed tasks', sub: 'Complete some tasks to see them here' }
        };

        const msg = messages[this.currentFilter];
        return `
            <div class="empty-state">
                <div class="empty-icon">${msg.icon}</div>
                <p>${msg.text}</p>
                <small>${msg.sub}</small>
            </div>
        `;
    }

    updateStats() {
        const { stats, clearBtn } = this.elements;
        const activeCount = this.todos.filter(t => !t.completed).length;
        const completedCount = this.todos.filter(t => t.completed).length;
        const total = this.todos.length;

        stats.textContent = total === 0
            ? 'No tasks'
            : `${activeCount} active • ${completedCount} done`;

        clearBtn.disabled = completedCount === 0;
    }

    getDueDateInfo(dueDate) {
        if (!dueDate) return { text: null, icon: '', isOverdue: false };

        const due = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const isOverdue = diffDays < 0;
        let text, icon;

        if (diffDays === 0) {
            icon = '📅';
            text = 'Today';
        } else if (diffDays === 1) {
            icon = '📅';
            text = 'Tomorrow';
        } else if (diffDays < 0) {
            icon = '⚠️';
            text = `${Math.abs(diffDays)} days overdue`;
        } else if (diffDays <= 7) {
            icon = '📅';
            text = `In ${diffDays} days`;
        } else {
            icon = '📅';
            text = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        return { text, icon, isOverdue };
    }

    formatRelativeTime(dateString) {
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

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // UI Feedback animations
    shake(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'shake 0.5s';
        }, 10);
    }

    flash(element) {
        const originalBg = element.style.background;
        element.style.background = '#34C759';
        setTimeout(() => {
            element.style.background = originalBg;
        }, 200);
    }

    showError(message) {
        // Simple error feedback - could be enhanced with toast notifications
        console.error(message);
    }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            console.log('SW registered:', registration.scope);

            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker?.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        if (confirm('New version available! Reload to update?')) {
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                            window.location.reload();
                        }
                    }
                });
            });
        } catch (error) {
            console.error('SW registration failed:', error);
        }
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}

// Initialize app
const app = new TodoApp();

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
