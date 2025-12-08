const SERVER_URL = "http://localhost:8080";
let token = localStorage.getItem("token");

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// --------------------- AUTHENTICATION ---------------------
function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Enter email and password");
        return;
    }

    fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => { throw new Error(data.message || "Login Failed") });
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("token", data.token);
            window.location.href = "todos.html";
        })
        .catch(error => alert(error.message));
}

function register() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Enter email and password");
        return;
    }

    fetch(`${SERVER_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => { throw new Error(data.message || "Register Failed") });
            }
            alert("Registered Successfully");
            window.location.href = "login.html";
        })
        .catch(error => alert(error.message));
}

// --------------------- TODO CARD ---------------------
// --------------------- TODO CARD ---------------------
function createTodoCard(todo) {
    const card = document.createElement("div");
    card.className = "todo-card";
    card.id = `todo-card-${todo.id}`; // Add ID to card for easier debugging

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `checkbox-${todo.id}`;
    checkbox.checked = todo.isCompleted;
    checkbox.addEventListener("change", function () {
        todo.isCompleted = checkbox.checked;
        updateTodoStatus(todo);
    });

    // Title Span (display mode)
    const span = document.createElement("span");
    span.id = `title-${todo.id}`;
    span.textContent = todo.title;
    if (todo.isCompleted) {
        span.style.textDecoration = "line-through";
        span.style.color = "#aaa";
    }

    // Container for buttons
    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "5px";
    deleteBtn.id = `delete-btn-${todo.id}`;
    deleteBtn.onclick = function () { deleteTodo(todo.id) };

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);

    card.appendChild(checkbox);
    card.appendChild(span);
    card.appendChild(btnContainer);

    return card;
}

// --------------------- LOAD TODOS ---------------------
function loadTodos() {
    let token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    fetch(`${SERVER_URL}/todo/get`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load todos: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(todos => {
            const todoList = document.getElementById("todo-list");
            todoList.innerHTML = "";

            if (!todos || todos.length === 0) {
                todoList.innerHTML = `<p>No todos found</p>`;
            } else {
                todos.forEach(todo => todoList.appendChild(createTodoCard(todo)));
            }
        })
        .catch(error => {
            console.error("Load todos error:", error);
            const todoList = document.getElementById("todo-list");
            todoList.innerHTML = `
            <div style="color: red; padding: 20px; text-align: center;">
                <p><strong>Error Loading Todos</strong></p>
                <p>${error.message}</p>
                <p style="font-size: small; margin-top: 10px;">
                    Possible causes: Backend not running, CORS issue, or invalid token.
                </p>
            </div>`;
        });
}

// Make sure this runs after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("todo-list")) {
        loadTodos();
    }
});

// --------------------- ADD TODO ---------------------
function addTodo() {
    const input = document.getElementById("new-todo");
    const title = input.value.trim();

    if (!title) {
        alert("Enter a todo");
        return;
    }

    fetch(`${SERVER_URL}/todo/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: title, isCompleted: false })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to add todo");
            }
            input.value = "";
            loadTodos();
        })
        .catch(err => alert(err.message));
}

// --------------------- UPDATE TODO ---------------------
function updateTodoStatus(todo) {
    fetch(`${SERVER_URL}/todo`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(todo)
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to update todo");
            loadTodos();
        })
        .catch(err => alert(err.message));
}

// --------------------- DELETE TODO ---------------------
function deleteTodo(id) {
    fetch(`${SERVER_URL}/todo/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to delete todo");
            loadTodos();
        })
        .catch(err => alert(err.message));
}

// --------------------- INITIALIZE ---------------------
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("todo-list")) loadTodos();
});

// // --------------------- CONFIG ---------------------
// const SERVER_URL = "http://localhost:8080";
// let token = localStorage.getItem("token");

// // --------------------- AUTHENTICATION ---------------------
// function login() {
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;


//     fetch(`${SERVER_URL}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password })
//     })
//         .then(Response => {
//             if (!Response.ok) {
//                 return Response.json().then(data => { throw new Error(data.message || "Login Failed") });
//             }
//             return Response.json();

//         })
//         .then(data => {
//             localStorage.setItem("token", data.token)
//             window.location = "todos.html";
//         })
//         .catch(error => {
//             alert(error.message);
//         })
// }

// function register() {
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;


//     fetch(`${SERVER_URL}/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password })
//     })
//         .then(Response => {
//             if (Response.ok) {
//                 alert("Registered Successfully");
//                 window.location.href = "login.html";
//             }
//             else {
//                 return Response.json().then(data => { throw new Error(data.message || "Register Failed") })
//             }
//         }).catch(error => {
//             alert(error.message);
//         })
// }

// // --------------------- TODO CARD ---------------------
// function createTodoCard(todo) {
//     const card = document.createElement("div");
//     card.className = "todo-card";

//     const checkbox = document.createElement("input");
//     checkbox.type = "checkbox";
//     checkbox.checked = todo.isCompleted;

//     checkbox.addEventListener("change", function () {
//         const updateTodo = { ...todo, isCompleted: checkbox.checked }
//         updateTodoStatus(updateTodo);
//     });

// }

// // --------------------- LOAD TODOS ---------------------
// function loadTodos() {
//     if (!token) {
//         alert("Please login first");
//         window.location.href = "login.html";
//         return;
//     }

//     fetch(`${SERVER_URL}/todo`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//         }
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Failed to load todos");
//             }
//             return response.json();
//         })
//         .then((todos) => {
//             const todoList = document.getElementById("todo-list")
//             todoList.innerHTML = "";

//             if (!todos || todos.length === 0) {
//                 todoList.innerHTML = `<p>asdfgh</p>`
//             }
//             else {
//                 todos.forEach(todo => todoList.appendChild(createTodoCard(todo)));
//             }
//         })
//         .catch(error => {
//             console.error("Load todos error:", error);
//             // alert(error.message); // Optional: don't alert significantly on load
//             const todoList = document.getElementById("todo-list");
//             todoList.innerHTML = `
//                 <div style="color: red; padding: 20px; text-align: center;">
//                     <p><strong>Error Loading Todos</strong></p>
//                     <p>${error.message}</p>
//                     <p style="font-size: small; margin-top: 10px;">
//                         Possible causes: Backend not running, CORS issue, or invalid token.
//                     </p>
//                 </div>`;
//         })
// }

// // --------------------- ADD TODO ---------------------
// async function addTodo() {
//     const input = document.getElementById("new-todo");
//     const title = input.value.trim();

//     if (!title) {
//         alert("Enter a todo");
//         return;
//     }

//     const authHeader = `Bearer ${token}`;
//     console.log("Adding Todo. Token:", token);
//     console.log("Headers Authorization:", authHeader);

//     try {
//         const res = await fetch(`${SERVER_URL}/todo/create`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: authHeader
//             },
//             body: JSON.stringify({
//                 title: title,
//                 description: "Manual Entry from web", // Backend requires this field
//                 isCompleted: false
//             })
//         });

//         if (!res.ok) {
//             const errorText = await res.text();
//             throw new Error(`Failed to add todo: ${res.status} ${res.statusText} - ${errorText}`);
//         }

//         input.value = "";
//         loadTodos();

//     } catch (err) {
//         console.error("Add todo error:", err);
//         alert(`Error adding todo: ${err.message}`);
//     }
// }

// // --------------------- UPDATE TODO ---------------------
// async function updateTodoStatus(todo) {
//     try {
//         const res = await fetch(`${SERVER_URL}/todo/${todo.id}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify(todo)
//         });

//         if (!res.ok) throw new Error("Failed to update todo");

//         loadTodos();

//     } catch (err) {
//         alert("Error updating todo");
//     }
// }

// // --------------------- DELETE TODO ---------------------
// async function deleteTodo(id) {
//     try {
//         const res = await fetch(`${SERVER_URL}/todo/${id}`, {
//             method: "DELETE",
//             headers: { Authorization: `Bearer ${token}` }
//         });

//         if (!res.ok) throw new Error("Failed to delete todo");

//         loadTodos();

//     } catch (err) {
//         alert("Error deleting todo");
//     }
// }

// // --------------------- INITIALIZE ---------------------
// document.addEventListener("DOMContentLoaded", () => {
//     if (document.getElementById("todo-list")) loadTodos();
// });
