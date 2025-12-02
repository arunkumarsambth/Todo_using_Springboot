// // Shared script for login, register, and todos pages
// const SERVER_URL = "http://localhost:8080";
// const token = localStorage.getItem("token");

// // --------------------- LOGIN ---------------------
// function login() {
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     fetch(`${SERVER_URL}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password })
//     })
//         .then(res => {
//             if (!res.ok) throw new Error("Login failed");
//             return res.json();
//         })
//         .then(data => {
//             localStorage.setItem("token", data.token);
//             window.location.href = "todos.html";
//         })
//         .catch(error => {
//             alert("Invalid credentials");
//         });
// }

// // --------------------- REGISTER ---------------------
// function register() {
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     fetch(`${SERVER_URL}/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password })
//     })
//         .then(res => {
//             if (!res.ok) throw new Error("Registration failed");
//             alert("Registered Successfully");
//             window.location.href = "login.html";
//         })
//         .catch(error => {
//             alert("Email already exists");
//         });
// }

// // --------------------- CREATE TODO CARD ---------------------
// function createTodoCard(todo) {
//     const card = document.createElement("div");
//     card.className = "todo-card";

//     const checkbox = document.createElement("input");
//     checkbox.type = "checkbox";
//     checkbox.checked = todo.complete;

//     checkbox.addEventListener("change", function () {
//         const update = { ...todo, complete: checkbox.checked };
//         updateTodoStatus(update);
//     });

//     const span = document.createElement("span");
//     span.textContent = todo.title;

//     if (todo.complete) {
//         span.style.textDecoration = "line-through";
//         span.style.color = "#aaa";
//     }

//     const deleteBtn = document.createElement("button");
//     deleteBtn.textContent = "X";
//     deleteBtn.onclick = function () {
//         deleteTodo(todo.id);
//     };

//     card.appendChild(checkbox);
//     card.appendChild(span);
//     card.appendChild(deleteBtn);

//     return card;
// }

// // --------------------- LOAD TODOS ---------------------
// function loadTodos() {
//     if (!token) {
//         alert("Login first. No token found!");
//         window.location.href = "login.html";
//         return;
//     }

//     console.log("Loading todos with token:", token);
//     fetch(`${SERVER_URL}/todo`, {
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
//         .then(async res => {
//             if (res.status === 401 || res.status === 403) {
//                 const debugInfo = res.headers.get("X-Auth-Debug");
//                 alert(`Session expired debug: Status ${res.status}. Debug: ${debugInfo}`);
//                 localStorage.removeItem("token");
//                 window.location.href = "login.html";
//                 return;
//             }
//             if (!res.ok) {
//                 const text = await res.text();
//                 throw new Error(`Failed to load todos: ${res.status} ${text}`);
//             }
//             return res.json();
//         })
//         .then(todos => {
//             if (!todos) return; // Handle case where we redirected
//             const todoList = document.getElementById("todo-list");
//             todoList.innerHTML = "";

//             if (todos.length === 0) {
//                 todoList.innerHTML = `<p>No todos found</p>`;
//             } else {
//                 todos.forEach(todo => {
//                     todoList.appendChild(createTodoCard(todo));
//                 });
//             }
//         })
//         .catch(error => {
//             console.error("Load todos error:", error);
//             document.getElementById("todo-list").innerHTML =
//                 `<p style="color:red">Error loading todos: ${error.message}</p>`;
//         });
// }

// // --------------------- ADD TODO ---------------------
// function addTodo() {
//     const input = document.getElementById("new-todo");
//     const title = input.value.trim();

//     if (title === "") {
//         alert("Enter todo");
//         return;
//     }

//     fetch(`${SERVER_URL}/todo/create`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ title: title, complete: false })
//     })
//         .then(res => {
//             if (!res.ok) throw new Error("Failed to add todo");
//             return res.json();
//         })
//         .then(newTodo => {
//             input.value = "";
//             loadTodos();
//         })
//         .catch(() => alert("Error adding todo"));
// }

// // --------------------- UPDATE TODO STATUS ---------------------
// function updateTodoStatus(todo) {
//     fetch(`${SERVER_URL}/todo/${todo.id}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(todo)
//     })
//         .then(res => {
//             if (!res.ok) throw new Error("Failed to update todo");
//             return res.json();
//         })
//         .then(() => loadTodos())
//         .catch(() => alert("Error updating todo"));
// }

// // --------------------- DELETE TODO ---------------------
// function deleteTodo(id) {
//     fetch(`${SERVER_URL}/todo/${id}`, {
//         method: "DELETE",
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
//         .then(res => {
//             if (!res.ok) throw new Error("Failed to delete");
//             return res.text();
//         })
//         .then(() => loadTodos())
//         .catch(() => alert("Error deleting todo"));
// }

// // --------------------- INITIALIZE ---------------------
// document.addEventListener("DOMContentLoaded", function () {
//     if (document.getElementById("todo-list")) {
//         loadTodos();
//     }
// });
