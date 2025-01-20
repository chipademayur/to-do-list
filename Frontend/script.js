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
        
        // Table rows with task data
        row.innerHTML = `
            <td>${start + index + 1}</td>
            <td>${task.id}</td>
            <td>${task.task}</td>
            <td>${task.task_status || 'To-Do'}</td>
            <td>
                <!-- Dynamically created Toggle Button -->
                <button class="toggleButton ${task.task_status || 'to-do'}" onclick="toggleTaskStatus(${task.id}, '${task.task_status || 'to-do'}')">
                    ${capitalizeStatus(task.task_status || 'to-do')}
                </button>
                <button class="deleteButton" onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;
        
        dataTable.appendChild(row);
    });
}

// Capitalize status text
function capitalizeStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
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

// Toggle task status
async function toggleTaskStatus(taskId, currentStatus) {
    const statusOrder = ['To-Do', 'processing', 'done'];
    let newStatus = '';

    // Determine the new status based on the current one
    const currentIndex = statusOrder.indexOf(currentStatus);
    newStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    try {
        // Send PATCH request to update the task status
        const response = await fetch(`${API_URL}/toggle-status/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            console.error('Error updating task status:', await response.text());
            return;
        }

        // Update the status in the tableData array immediately
        const updatedTask = await response.json();
        const taskIndex = tableData.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tableData[taskIndex].task_status = updatedTask.status;  // Update status
        }

        // Re-render the table to show updated status
        renderTable();
        renderPagination();
    } catch (error) {
        console.error('Error updating task status:', error);
    }
}

// Initialize
fetchTasks();
