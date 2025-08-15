const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delet-all-button");
const editButton = document.getElementById("edit-button");
const filterButtons = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

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

const displayTodos = (data) => {
  const todoList = data ? data : todos;
  todosBody.innerHTML = "";
  if (!todoList.length) {
    todosBody.innerHTML = "<tr><th colspan='4'>No task found!</th></tr>";
    return;
  }
  todoList.forEach((todo) => {
    todosBody.innerHTML += `
        <tr>
            <td>${todo.task}</td>
            <td>${todo.date || "no date"}</td>
            <td>${todo.completed ? "Complated" : "Pending"}</td>
            <td>
                <button onclick='editHandler(${todo.id})'>Edit</button>
                <button onclick='toggleHandler(${todo.id})'>
                  ${todo.completed ? "Undo" : "Do"}
                </button>
                <button onclick='deleteHandler(${todo.id})'>Delete</button>
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

const editHandler = (id) => {
  const todo = todos.find((todo) => +todo.id === +id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editButton.style.display = "block";
  editButton.dataset.id = id;
};

const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => +todo.id === +id);
  const task = taskInput.value.trim();
  if (!task) {
    showAlert("Please enter a todo!", "error");
  } else {
    todo.task = taskInput.value;
    todo.date = dateInput.value;
    editButton.style.display = "none";
    addButton.style.display = "block";
    saveToLocalStorage();
    displayTodos();
    showAlert("Todo edited successfully", "success");
    taskInput.value = "";
    dateInput.value = "";
  }
};

const toggleHandler = (id) => {
  const todo = todos.find((todo) => +todo.id === +id);
  todo.completed = !todo.completed;
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo status changed successfully", "success");
};

const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => +todo.id !== +id);
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo delete successfully", "success");
};

const filterHandler = (event) => {
  const filter = event.target.dataset.filter;
  let filterTodos = null;
  switch (filter) {
    case "pending":
      filterTodos = todos.filter((todo) => todo.completed === false);
      break;
    case "completed":
      filterTodos = todos.filter((todo) => todo.completed === true);
      break;
    default:
      filterTodos = todos;
      break;
  }
  displayTodos(filterTodos);
};

window.addEventListener("load", () => displayTodos());
addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButtons.forEach((button) =>
  button.addEventListener("click", filterHandler)
);
