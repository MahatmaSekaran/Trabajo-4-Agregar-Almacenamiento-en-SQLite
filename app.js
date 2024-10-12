const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Agregar tareas
taskForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        const newTask = await addTask(taskText);
        if (newTask) {
            taskInput.value = '';
        }
    } else {
        alert('Por favor, ingresa una tarea.');
    }
});

// Función para agregar tarea
async function addTask(taskText) {
    try {
        const response = await fetch('http://localhost:3000/tareas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descripcion: taskText }),
        });
        const task = await response.json();
        displayTask(task);
        return task;
    } catch (error) {
        console.error('Error al agregar tarea:', error);
    }
}

// Mostrar tarea en la lista
function displayTask(task) {
    const li = document.createElement('li');
    li.textContent = task.descripcion; // Mostrar la descripción de la tarea
    li.setAttribute('data-id', task.id); // Guardar el ID de la tarea

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.className = 'delete';
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
}

// Eliminar tareas
taskList.addEventListener('click', async function(e) {
    if (e.target.classList.contains('delete')) {
        const li = e.target.parentElement;
        const taskId = li.getAttribute('data-id'); // Obtener el ID de la tarea

        await deleteTask(taskId); // Eliminar tarea del servidor
        taskList.removeChild(li); // Eliminar tarea de la lista
    }

    // Marcar como completada
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle('completed');
    }
});

// Función para eliminar tarea
async function deleteTask(taskId) {
    try {
        await fetch(`http://localhost:3000/tareas/${taskId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
    }
}

// Obtener y mostrar tareas al cargar la página
const obtenerTareas = async () => {
    try {
        const response = await fetch('http://localhost:3000/tareas');
        const data = await response.json();
        data.tareas.forEach(task => displayTask(task));
    } catch (error) {
        console.error('Error al obtener tareas:', error);
    }
};

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', obtenerTareas);
