async function fetchTasks() {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/tasks', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
  
    if (res.ok) {
      const tasks = await res.json();
      const list = document.getElementById('task-list');
      list.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${task.title} (à faire pour ${new Date(task.due_time).toLocaleDateString()})</span>
          <button onclick="deleteTask(${task.id})">🗑</button>
        `;
        list.appendChild(li);
      });
    } else {
      alert("Erreur lors du chargement des taches");
    }
  }
  
  async function deleteTask(id) {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    fetchTasks();
  }
  
  document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const title = document.getElementById('title').value;
    const due_time = document.getElementById('due_time').value;
  
    await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, due_time })
    });
  
    document.getElementById('task-form').reset();
    fetchTasks();
  });
  
  window.onload = fetchTasks;