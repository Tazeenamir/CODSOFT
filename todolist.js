document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addButton = document.getElementById("addButton");
  const taskList = document.getElementById("taskList");
  const notification = document.getElementById("notification");
  let alternateColor = false;

  addButton.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      addTask(taskText);
      showNotification("Task added successfully!");
    }
  });

  taskList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-icon")) {
      deleteTask(event.target.parentElement);
      showNotification("Task deleted successfully!");
    } else if (event.target.classList.contains("edit-icon")) {
      enterEditMode(event.target.parentElement);
    } else if (event.target.classList.contains("save-icon")) {
      finishEditMode(event.target.parentElement);
      showNotification("Task edited successfully!");
    }
  });

  function addTask(taskText) {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${taskText}</span>
      <i class="fas fa-trash delete-icon"></i>
      <i class="fas fa-edit edit-icon"></i>
      <i class="fas fa-save save-icon"></i>
    `;
    if (alternateColor) {
      li.classList.add("alternate");
    }
    alternateColor = !alternateColor;
    taskList.appendChild(li);
    taskInput.value = "";
    saveTasksToLocalStorage();
  }

  function deleteTask(taskElement) {
    taskElement.remove();
    saveTasksToLocalStorage();
  }

  function enterEditMode(taskElement) {
    const taskSpan = taskElement.querySelector("span");
    const editField = document.createElement("input");
    editField.type = "text";
    editField.value = taskSpan.textContent;
    editField.classList.add("editField");

    const saveButton = document.createElement("i");
    saveButton.className = "fas fa-save save-icon";
    saveButton.addEventListener("click", () => {
      finishEditMode(taskElement, editField);
      showNotification("Task edited successfully!");
    });

    taskElement.appendChild(editField);
    taskElement.appendChild(saveButton);
    taskSpan.style.display = "none";
  }

  function finishEditMode(taskElement, editField) {
    const taskSpan = taskElement.querySelector("span");
    const updatedTaskText = editField.value.trim();
    taskSpan.textContent = updatedTaskText;
    taskSpan.style.display = "inline";
    editField.remove();
    saveTasksToLocalStorage();
  }

  function showNotification(message) {
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => {
      notification.style.display = "none";
    }, 2000);
  }

  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((taskText) => {
      addTask(taskText);
    });
  }

  taskInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      const taskText = taskInput.value.trim();
      if (taskText !== "") {
        addTask(taskText);
        showNotification("Task added successfully!");
      }
    }
  });

  function saveTasksToLocalStorage() {
    const tasks = Array.from(document.querySelectorAll("li span")).map(
      (span) => span.textContent
    );
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  loadTasksFromLocalStorage();
});

