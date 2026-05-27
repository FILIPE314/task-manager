const dateTask = document.querySelector('#date');
const contentTask = document.querySelector('#content');
const statsTask = document.querySelector('#stats');
const priorityTask = document.querySelector('#priority');
const btnAdd = document.querySelector('#btnAdd');
const list = document.querySelector('#task-list');
const div_wrap = document.querySelector('#wrap');
const searchTasks = document.querySelector('#search');
const searchContent = document.querySelector('#content_search');

// Carrega todas as tarefas
function loadTasks() {
  const tasks = getStoredTasks();
  list.innerHTML = '';
  tasks.forEach(task => {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td'); td1.textContent = task.date;
    const td2 = document.createElement('td'); td2.textContent = task.content;
    const td3 = document.createElement('td'); td3.textContent = task.status;
    const td4 = document.createElement('td'); td4.textContent = task.priority;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td4); // mantém sua ordem: prioridade antes do status
    tr.appendChild(td3);
    applyStatusColor(td3, task.status);
    createButtons(tr, td1, td2, td3, td4);
    list.appendChild(tr);
  });
}

// Valida se os campos estão preenchidos
function validation(td1, td2, td3, td4) {
    if (td1 !== '' && td2 !== '' && td3 !== '' && td4 !== '') {
        addTask()
    } else {
        alert('Preencha todos os campos❌');
    }
}

// Adiciona as Tasks e suas propriedades
function addTask() {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const td4 = document.createElement('td');
    td1.textContent = dateTask.value;
    td2.textContent = contentTask.value;
    td3.textContent = statsTask.value;
    td4.textContent = priorityTask.value;
    const task = {
        date: td1.textContent,
        content: td2.textContent,
        status: td3.textContent,
        priority: td4.textContent
    };
    addTaskToStorage(task);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td4);
    tr.appendChild(td3);
    list.appendChild(tr);
    applyStatusColor(td3, statsTask.value);
    createButtons(tr, td1, td2, td3, td4);
    dateTask.value = '';
    contentTask.value = '';
    statsTask.value = '';
    priorityTask.value = '';
}
btnAdd.addEventListener('click', () => validation(dateTask.value, contentTask.value, statsTask.value, priorityTask.value));

// Cria os botões Delete e Edit
function createButtons(tr, td1, td2, td3, td4) {
    const btn1 = document.createElement('button');
    btn1.addEventListener('click', function() {
        dateTask.value = td1.textContent;
        contentTask.value = td2.textContent;
        statsTask.value = td3.textContent;
        priorityTask.value = td4.textContent;
        const rows = Array.from(list.querySelectorAll('tr'));
        const idx = rows.indexOf(tr);
        if (idx !== -1) removeTaskFromStorage(idx);
        tr.remove();
        btn1.remove();
        btn2.remove();
    });
    const btn2 = document.createElement('button');
    btn2.addEventListener('click', function() {
        const rows = Array.from(list.querySelectorAll('tr'));
        const idx = rows.indexOf(tr);
        if (idx !== -1) removeTaskFromStorage(idx);
        tr.remove();
        btn1.remove();
        btn2.remove();
    });
    btn1.textContent = 'Editar';
    btn1.id = 'edit'
    btn2.textContent = 'Excluir';
    btn2.id = 'exclude'
    tr.appendChild(btn1);
    tr.appendChild(btn2);
}

// Pega a tarefa na memória
function getStoredTasks() {
  try { return JSON.parse(localStorage.getItem('tasks') || '[]'); }
  catch { return []; }
}

// Adicona a tarefa na memória
function addTaskToStorage(task) {
  const tasks = getStoredTasks();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove a tarefa na memória
function removeTaskFromStorage(indexOrId) {
  const tasks = getStoredTasks();
  if (typeof indexOrId === 'number') {
    if (indexOrId < 0 || indexOrId >= tasks.length) return;
    tasks.splice(indexOrId, 1);
  } else {
    // se estiver usando id: filtrar por id
    const id = indexOrId;
    const filtered = tasks.filter(t => t.id !== id);
    return localStorage.setItem('tasks', JSON.stringify(filtered));
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Aplica cor conforme o status da tarefa
function applyStatusColor(td, statusValue) {
    if (statusValue === 'Pending') {
        td.classList.add('s-pendente')
    } else if (statusValue === 'In progress') {
        td.classList.add('s-em-andamento')
    } else if (statusValue === 'Completed') {
        td.classList.add('s-concluida')
    }
}

// Pesquisa as tarefas
function search() {
    const query = searchContent.value.toLowerCase();
    const rows = list.querySelectorAll('tr');
    for (const row of rows) {
        const text = row.textContent.toLowerCase();
        if (text.includes(query)) {
            row.style.display = ''
        } else {
            row.style.display = 'none'
        }
    }
}
searchTasks.addEventListener('click', search);
loadTasks();

const rows = document.querySelectorAll("tbody tr");
rows.forEach((row, index) => {
  row.style.animationDelay = `${index * 0.3}s`;
});