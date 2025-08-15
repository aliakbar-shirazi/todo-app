const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delet-all-button");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
console.log(todos);

const generateId = () => {
  return Math.round(Date.now() * Math.random() * Math.random()).toString();
};

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const showAlert = (massage, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = massage;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 5000);
};

const displayTodos = () => {
  todosBody.innerHTML = "";
  if (!todos.length) {
    todosBody.innerHTML = "<tr><th colspan='4'>No task found!</th></tr>";
    return;
  }
  todos.forEach((todo) => {
    todosBody.innerHTML += `
        <tr>
            <td>${todo.task}</td>
            <td>${todo.date || "no date"}</td>
            <td>${todo.completed ? "Complated" : "Pending"}</td>
            <td>
                <button>Edit</button>
                <button>${todo.completed ? "Undo" : "Do"}</button>
                <button>Delete</button>
            </td>
        </tr>
    `;
  });
};

const addHandler = () => {
  const task = taskInput.value.trim();
  const date = dateInput.value;
  const todo = {
    id: generateId(),
    completed: false,
    task,
    date,
  };
  if (task) {
    todos.push(todo);
    saveToLocalStorage();
    displayTodos();
    taskInput.value = "";
    dateInput.value = "";
    showAlert("Todo added successfully", "success");
  } else {
    showAlert("Please enter a todo!", "error");
  }
};

const deleteAllHandler = () => {
  if (!todos.length) {
    showAlert("No todos to clear", "error");
  } else {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("All todos cleard successfully", "success");
  }
};

window.addEventListener("load", displayTodos);
addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
