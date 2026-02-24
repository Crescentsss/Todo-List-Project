const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const completedTaskList = document.getElementById("completedTaskList");
const toggleBtn = document.getElementById("themeToggle");
const sidebar = document.getElementById("sidebar");
const app = document.querySelector(".app");
const menuToggle = document.querySelector(".menu-toggle");
const undoBtn = document.querySelector(".undoBtn");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];



function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveCompletedTasks() {
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}
function saveToStorage() {
  saveTasks();
  saveCompletedTasks();
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}
updateThemeUI();



function renderTasks() {
  if (!taskList) return;

  taskList.innerHTML = "";

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task-item";

    div.innerHTML = `
      <span class="task-title">${task.title}</span>
      <div class="task-actions">
        <button class="completeBtn">✅</button>
        <button class="trashBtn">🗑️</button>
      </div>
    `;

    taskList.appendChild(div);
  });
}



function renderCompletedTasks() {
  if (!completedTaskList) return;

  completedTaskList.innerHTML = "";

  completedTasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task-item";

    div.innerHTML = `
      <span class="task-title">${task.title}</span>
      <div>
      <button class="undoBtn">↩️</button>
      <button class="trashBtn">🗑️</button>
      </div>
    `;

    completedTaskList.appendChild(div);
  });
}



if (addTaskBtn && taskInput) {
  addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
      id: Date.now(),
      title: text,
      completed: false
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
  });
}


if (taskList) {
  taskList.addEventListener("click", (e) => {
    const item = e.target.closest(".task-item");
    if (!item) return;

    const index = [...taskList.children].indexOf(item);


    if (e.target.classList.contains("trashBtn")) {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }


    if (e.target.classList.contains("completeBtn")) {
      const completed = tasks.splice(index, 1)[0];
      completed.completed = true;

      completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

      completedTasks.push(completed);
      saveTasks();
      saveCompletedTasks();

      renderTasks();
      renderCompletedTasks();
    }
  });
}


if (completedTaskList) {
  completedTaskList.addEventListener("click", (e) => {
    if (!e.target.classList.contains("trashBtn")) return;

    const item = e.target.closest(".task-item");
    const index = [...completedTaskList.children].indexOf(item);

    completedTasks.splice(index, 1);
    saveCompletedTasks();
    renderCompletedTasks();
  });
}


renderTasks();
renderCompletedTasks();

function updateThemeUI() {
  const isDark = document.body.classList.contains("dark");
  toggleBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  updateThemeUI();
});



// sidebar toggle kısmı ayrıca localstorage kayıt

const sideBar = localStorage.getItem("kapaliMi") === "true";
if (sideBar) {
  sidebar.classList.add("closed");
  app.classList.add("sidebar-closed");
}

if (sidebar && app && menuToggle) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
    app.classList.toggle("sidebar-closed");

    localStorage.setItem("kapaliMi", sidebar.classList.contains("closed"));
  });
}

// return task (undoBtn)

completedTaskList.addEventListener("click", (e) => {
  if (!e.target.classList.contains("undoBtn")) return;

  const item = e.target.closest(".task-item");
  const index = [...completedTaskList.children].indexOf(item);

  const returnedTask = completedTasks.splice(index, 1)[0];
  returnedTask.completed = false;
  tasks.push(returnedTask);

  saveTasks();
  saveCompletedTasks();

  renderTasks();
  renderCompletedTasks();
});


// tasklara tarih eklenebilir, tamamlanma süresi hesaplanabilir ve tasklara öncelik eklenebilir, böylece kullanıcı hangi taskların daha önemli olduğunu görebilir. tamamlanan tasklar arşivlenebilir, kullanıcı geçmişte tamamladığı taskları görebilir ancak ana listede kalmaz
// tamamlama yüzdesi eklenecek buna düzgün gui bulunup % şeklinde gösterilecek, tamamlanan tasklar geri döndürülebilir olacak, tasklara tarih eklenebilir, tamamlanma süresi hesaplanabilir, tasklara öncelik eklenebilir, tamamlanan tasklar arşivlenebilir gibi özellikler eklenebilir.
