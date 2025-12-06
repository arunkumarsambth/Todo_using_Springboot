// --------------------- CONFIG ---------------------
const SERVER_URL = "http://localhost:8080";
let token = localStorage.getItem("token");

// --------------------- AUTHENTICATION ---------------------
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    
        fetch(`${SERVER_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(Response=>
        {
            if(!Response.ok){
                throw new Error(data.message || "Register Failed")
            }
            return Response.json();

        })
        .then(data=>{
            localStorage.setItem("token",data.token)
            window.location="todos.html";
        })
        .catch(error =>{
            alert(error.message);
        })
}

function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    
        fetch(`${SERVER_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(Response=>
        {
            if(Response.ok){
                alert("Registered Successfully");
                window.location.href = "login.html";
            }
            else{
                return Response.json().then(data =>{throw new Error(data.message || "Register Failed")})
            }
        }).catch(error =>{
            alert(error.message);
        })
}

// --------------------- TODO CARD ---------------------
function createTodoCard(todo) {
    const card = document.createElement("div");
    card.className = "todo-card";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.isCompleted;

    checkbox.addEventListener("change", function() {
        const updateTodo ={...todo ,isCompleted:checkbox.checked}
        updateTodoStatus(updateTodo);
    });

    const span = document.createElement("span");
    span.textContent = todo.title;
    if (todo.isCompleted) {
        span.style.textDecoration = "line-through";
        span.style.color = "#aaa";
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.onclick = function(){ deleteTodo(todo.id)};

    card.appendChild(checkbox);
    card.appendChild(span);
    card.appendChild(deleteBtn);

    return card;
}

// --------------------- LOAD TODOS ---------------------
function loadTodos() {
    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    fetch(`${SERVER_URL}/todo`, {
            method:"GET",
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(Response=>{
            if (!res.ok){
                 throw new Error("Failed to load todos");
            }
            return Response.json();    
        })
        .then((todos)=>{
            const  todoList=document.getElementById("todo-list")
            todoList.innerHTML="";

            if(!todos || todos.length===0){
                todoList.innerHTML=`<p>asdfgh</p>`
            }
            else {
            todos.forEach(todo => todoList.appendChild(createTodoCard(todo)));
        }
        })
        .catch(error=>{
            alert(error.message);
            // document.getElementById("todo-list").innerHTML=`<p>asdfghjkl</p>`;
        })
}

// --------------------- ADD TODO ---------------------
async function addTodo() {
    const input = document.getElementById("new-todo");
    const title = input.value.trim();

    if (!title) {
        alert("Enter a todo");
        return;
    }

    try {
        const res = await fetch(`${SERVER_URL}/todo/create`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ title, complete: false })
        });

        if (!res.ok) throw new Error("Failed to add todo");

        input.value = "";
        loadTodos();

    } catch (err) {
        alert("Error adding todo");
    }
}

// --------------------- UPDATE TODO ---------------------
async function updateTodoStatus(todo) {
    try {
        const res = await fetch(`${SERVER_URL}/todo/${todo.id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(todo)
        });

        if (!res.ok) throw new Error("Failed to update todo");

        loadTodos();

    } catch (err) {
        alert("Error updating todo");
    }
}

// --------------------- DELETE TODO ---------------------
async function deleteTodo(id) {
    try {
        const res = await fetch(`${SERVER_URL}/todo/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to delete todo");

        loadTodos();

    } catch (err) {
        alert("Error deleting todo");
    }
}

// --------------------- INITIALIZE ---------------------
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("todo-list")) loadTodos();
});
