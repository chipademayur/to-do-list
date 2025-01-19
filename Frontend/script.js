const API_URL = 'http://localhost:3000/api/tasks';

document.getElementById('addTaskButton').addEventListener('click', async function() {
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
            body: JSON.stringify({ task: taskText })
        });
        const newTask = await response.json();
        displayTask(newTask);
        taskInput.value = '';
    } catch (error) {
        console.error('Error adding task:', error);
    }
});

async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        tasks.forEach(displayTask);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

function displayTask(task) {
    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.textContent = task.task;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton';

    deleteButton.addEventListener('click', async function() {
        try {
            await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
            taskList.removeChild(li);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    });

    li.appendChild(deleteButton);
    taskList.appendChild(li);
}

// Fetch tasks when the page loads
fetchTasks();
