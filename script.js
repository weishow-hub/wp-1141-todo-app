class TodoApp {
    constructor() {
        this.todos = [
            { id: 1, text: "todo 1", description: "This is the description for todo 1", completed: false, expanded: false },
            { id: 2, text: "todo 2", description: "This is the description for todo 2", completed: false, expanded: false }
        ];
        this.nextId = 3;
        
        this.initializeElements();
        this.bindEvents();
        this.renderTodos();
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
            id: this.nextId++,
            text: text,
            description: description || "No description provided",
            completed: false,
            expanded: false
        };
        
        this.todos.push(newTodo);
        this.renderTodos();
        
        this.todoInput.value = "";
        this.descriptionInput.value = "";
        this.todoInput.focus();
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.renderTodos();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
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
        todoItem.className = "todo-item";
        todoItem.dataset.id = todo.id;
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "todo-checkbox";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => this.toggleTodo(todo.id));
        
        const todoText = document.createElement("span");
        todoText.className = "todo-text";
        todoText.textContent = todo.text;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "delete";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.deleteTodo(todo.id);
        });
        
        todoItem.appendChild(checkbox);
        todoItem.appendChild(todoText);
        todoItem.appendChild(deleteBtn);
        
        todoItem.addEventListener("click", (e) => {
            if (e.target !== checkbox && e.target !== deleteBtn) {
                this.toggleDescription(todo.id);
            }
        });
        
        return todoItem;
    }
    
    createDescriptionElement(todo) {
        const description = document.createElement("div");
        description.className = `todo-description ${todo.expanded ? "show" : ""}`;
        description.textContent = todo.description;
        return description;
    }
    
    renderTodos() {
        this.todoList.innerHTML = "";
        
        this.todos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            this.todoList.appendChild(todoElement);
            
            const descriptionElement = this.createDescriptionElement(todo);
            this.todoList.appendChild(descriptionElement);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new TodoApp();
});
