const API_URL = 'http://localhost:3000/api/tasks';
const paginationControls = document.getElementById('paginationControls');
const dataTable = document.getElementById('dataTable').querySelector('tbody');
let tableData = [];
let currentPage = 1;
let rowsPerPage = 5;

// Fetch tasks and populate table
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        tableData = await response.json();
        renderTable();
        renderPagination();
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Render table rows
function renderTable() {
    dataTable.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = tableData.slice(start, end);

    paginatedData.forEach((task, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${start + index + 1}</td>
            <td>${task.id}</td>
            <td>${task.task}</td>
            <td>${task.task_status || 'To-Do'}</td>
            <td>
                <button class="deleteButton" onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;
        dataTable.appendChild(row);
    });
}

// Render pagination controls
function renderPagination() {
    paginationControls.innerHTML = '';
    const totalPages = Math.ceil(tableData.length / rowsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = i === currentPage ? 'active' : '';
        button.addEventListener('click', () => {
            currentPage = i;
            renderTable();
            renderPagination();
        });
        paginationControls.appendChild(button);
    }
}

// Add task
document.getElementById('addTaskButton').addEventListener('click', async function () {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: taskText }),
        });
        const newTask = await response.json();
        tableData.push(newTask);
        taskInput.value = '';
        renderTable();
        renderPagination();
    } catch (error) {
        console.error('Error adding task:', error);
    }
});

// Delete task
async function deleteTask(taskId) {
    try {
        await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
        tableData = tableData.filter(task => task.id !== taskId);
        renderTable();
        renderPagination();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Initialize
fetchTasks();
