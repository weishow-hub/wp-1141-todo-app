// 使用者認證管理
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
    }
    
    loadUsers() {
        const usersJson = localStorage.getItem('users');
        return usersJson ? JSON.parse(usersJson) : {};
    }
    
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }
    
    register(username, password) {
        if (this.users[username]) {
            return { success: false, message: '使用者名稱已存在' };
        }
        
        if (password.length < 4) {
            return { success: false, message: '密碼長度至少需要 4 個字元' };
        }
        
        this.users[username] = {
            password: password,
            todos: [],
            nextId: 1
        };
        this.saveUsers();
        return { success: true };
    }
    
    login(username, password) {
        const user = this.users[username];
        if (!user || user.password !== password) {
            return { success: false, message: '使用者名稱或密碼錯誤' };
        }
        
        this.currentUser = username;
        localStorage.setItem('currentUser', username);
        return { success: true };
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }
    
    getCurrentUser() {
        if (!this.currentUser) {
            this.currentUser = localStorage.getItem('currentUser');
        }
        return this.currentUser;
    }
    
    getUserTodos() {
        const username = this.getCurrentUser();
        if (!username || !this.users[username]) {
            return [];
        }
        return this.users[username].todos || [];
    }
    
    saveUserTodos(todos) {
        const username = this.getCurrentUser();
        if (!username || !this.users[username]) {
            return;
        }
        this.users[username].todos = todos;
        this.saveUsers();
    }
    
    getNextId() {
        const username = this.getCurrentUser();
        if (!username || !this.users[username]) {
            return 1;
        }
        const currentId = this.users[username].nextId || 1;
        this.users[username].nextId = currentId + 1;
        this.saveUsers();
        return currentId;
    }
}

// 待辦事項應用程式
class TodoApp {
    constructor() {
        this.authManager = new AuthManager();
        this.todos = [];
        this.editingId = null;
        
        this.initializeAuth();
    }
    
    initializeAuth() {
        // 檢查是否已登入
        const currentUser = this.authManager.getCurrentUser();
        if (currentUser) {
            this.showApp();
        } else {
            this.showAuth();
        }
        
        this.setupAuthEvents();
    }
    
    setupAuthEvents() {
        // 登入表單
        const loginBtn = document.getElementById('loginBtn');
        const loginUsername = document.getElementById('loginUsername');
        const loginPassword = document.getElementById('loginPassword');
        
        loginBtn.addEventListener('click', () => {
            const username = loginUsername.value.trim();
            const password = loginPassword.value.trim();
            
            if (!username || !password) {
                this.showAuthError('請輸入使用者名稱和密碼');
                return;
            }
            
            const result = this.authManager.login(username, password);
            if (result.success) {
                this.showApp();
                loginUsername.value = '';
                loginPassword.value = '';
                this.showAuthError('');
            } else {
                this.showAuthError(result.message);
            }
        });
        
        // 註冊表單
        const registerBtn = document.getElementById('registerBtn');
        const registerUsername = document.getElementById('registerUsername');
        const registerPassword = document.getElementById('registerPassword');
        const registerPasswordConfirm = document.getElementById('registerPasswordConfirm');
        
        registerBtn.addEventListener('click', () => {
            const username = registerUsername.value.trim();
            const password = registerPassword.value.trim();
            const passwordConfirm = registerPasswordConfirm.value.trim();
            
            if (!username || !password || !passwordConfirm) {
                this.showRegisterError('請填寫所有欄位');
                return;
            }
            
            if (password !== passwordConfirm) {
                this.showRegisterError('密碼不一致');
                return;
            }
            
            const result = this.authManager.register(username, password);
            if (result.success) {
                this.showRegisterError('');
                // 自動登入
                this.authManager.login(username, password);
                this.showApp();
                registerUsername.value = '';
                registerPassword.value = '';
                registerPasswordConfirm.value = '';
            } else {
                this.showRegisterError(result.message);
            }
        });
        
        // 切換表單
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'block';
            this.showAuthError('');
        });
        
        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
            this.showRegisterError('');
        });
        
        // 登出
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.authManager.logout();
            this.showAuth();
        });
        
        // Enter 鍵登入/註冊
        loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginBtn.click();
        });
        
        registerPasswordConfirm.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') registerBtn.click();
        });
    }
    
    showAuth() {
        document.getElementById('authContainer').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
    }
    
    showApp() {
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
        
        const username = this.authManager.getCurrentUser();
        document.getElementById('usernameDisplay').textContent = `歡迎，${username}`;
        
        this.loadTodos();
        this.initializeElements();
        this.bindEvents();
        this.renderTodos();
    }
    
    showAuthError(message) {
        document.getElementById('authError').textContent = message;
    }
    
    showRegisterError(message) {
        document.getElementById('registerError').textContent = message;
    }
    
    loadTodos() {
        this.todos = this.authManager.getUserTodos();
    }
    
    saveTodos() {
        this.authManager.saveUserTodos(this.todos);
    }
    
    initializeElements() {
        this.todoInput = document.getElementById("todoInput");
        this.descriptionInput = document.getElementById("descriptionInput");
        this.addBtn = document.getElementById("addBtn");
        this.todoList = document.getElementById("todoList");
    }
    
    bindEvents() {
        this.addBtn.addEventListener("click", () => this.addTodo());
        
        this.todoInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.addTodo();
        });
        
        this.descriptionInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && e.ctrlKey) this.addTodo();
        });
    }
    
    addTodo() {
        const text = this.todoInput.value.trim();
        const description = this.descriptionInput.value.trim();
        
        if (!text) return;
        
        const newTodo = {
            id: this.authManager.getNextId(),
            text: text,
            description: description || "",
            completed: false,
            expanded: false
        };
        
        this.todos.push(newTodo);
        this.saveTodos();
        this.renderTodos();
        
        this.todoInput.value = "";
        this.descriptionInput.value = "";
        this.todoInput.focus();
    }
    
    deleteTodo(id) {
        if (confirm('確定要刪除此待辦事項嗎？')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveTodos();
            this.renderTodos();
        }
    }
    
    startEdit(id) {
        this.editingId = id;
        this.renderTodos();
    }
    
    cancelEdit() {
        this.editingId = null;
        this.renderTodos();
    }
    
    saveEdit(id, newText, newDescription) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.text = newText.trim();
            todo.description = newDescription.trim();
            this.saveTodos();
            this.editingId = null;
            this.renderTodos();
        }
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
        }
    }
    
    toggleDescription(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.expanded = !todo.expanded;
            this.renderTodos();
        }
    }
    
    createTodoElement(todo) {
        const todoItem = document.createElement("div");
        todoItem.className = `todo-item ${todo.completed ? "completed" : ""}`;
        todoItem.dataset.id = todo.id;
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "todo-checkbox";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => this.toggleTodo(todo.id));
        
        if (this.editingId === todo.id) {
            // 編輯模式
            const editContainer = document.createElement("div");
            editContainer.className = "edit-container";
            
            const editTextInput = document.createElement("input");
            editTextInput.type = "text";
            editTextInput.className = "edit-text-input";
            editTextInput.value = todo.text;
            
            const editDescInput = document.createElement("textarea");
            editDescInput.className = "edit-desc-input";
            editDescInput.value = todo.description;
            editDescInput.placeholder = "描述（選填）";
            
            const buttonGroup = document.createElement("div");
            buttonGroup.className = "edit-buttons";
            
            const saveBtn = document.createElement("button");
            saveBtn.className = "save-btn";
            saveBtn.textContent = "儲存";
            saveBtn.addEventListener("click", () => {
                this.saveEdit(todo.id, editTextInput.value, editDescInput.value);
            });
            
            const cancelBtn = document.createElement("button");
            cancelBtn.className = "cancel-btn";
            cancelBtn.textContent = "取消";
            cancelBtn.addEventListener("click", () => {
                this.cancelEdit();
            });
            
            buttonGroup.appendChild(saveBtn);
            buttonGroup.appendChild(cancelBtn);
            
            editContainer.appendChild(editTextInput);
            editContainer.appendChild(editDescInput);
            editContainer.appendChild(buttonGroup);
            
            todoItem.appendChild(checkbox);
            todoItem.appendChild(editContainer);
            
            // 自動聚焦
            setTimeout(() => editTextInput.focus(), 0);
            
            // Enter 鍵儲存
            editTextInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    saveBtn.click();
                }
            });
            
        } else {
            // 顯示模式
            const todoText = document.createElement("span");
            todoText.className = "todo-text";
            todoText.textContent = todo.text;
            
            const buttonGroup = document.createElement("div");
            buttonGroup.className = "todo-buttons";
            
            const editBtn = document.createElement("button");
            editBtn.className = "edit-btn";
            editBtn.textContent = "編輯";
            editBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.startEdit(todo.id);
            });
            
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = "刪除";
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.deleteTodo(todo.id);
            });
            
            buttonGroup.appendChild(editBtn);
            buttonGroup.appendChild(deleteBtn);
            
            todoItem.appendChild(checkbox);
            todoItem.appendChild(todoText);
            todoItem.appendChild(buttonGroup);
            
            todoItem.addEventListener("click", (e) => {
                if (e.target !== checkbox && e.target !== editBtn && e.target !== deleteBtn && 
                    !e.target.closest('.todo-buttons')) {
                    this.toggleDescription(todo.id);
                }
            });
        }
        
        return todoItem;
    }
    
    createDescriptionElement(todo) {
        if (this.editingId === todo.id) {
            return null; // 編輯模式時不顯示描述
        }
        
        const description = document.createElement("div");
        description.className = `todo-description ${todo.expanded ? "show" : ""}`;
        description.textContent = todo.description || "無描述";
        return description;
    }
    
    renderTodos() {
        if (!this.todoList) return;
        
        this.todoList.innerHTML = "";
        
        if (this.todos.length === 0) {
            const emptyMessage = document.createElement("div");
            emptyMessage.className = "empty-message";
            emptyMessage.textContent = "目前沒有待辦事項，開始新增吧！";
            this.todoList.appendChild(emptyMessage);
            return;
        }
        
        this.todos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            this.todoList.appendChild(todoElement);
            
            const descriptionElement = this.createDescriptionElement(todo);
            if (descriptionElement) {
                this.todoList.appendChild(descriptionElement);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new TodoApp();
});
