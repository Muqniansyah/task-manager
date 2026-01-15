import { useState, useEffect } from "react";

function App() {
  // API URL
  const API_URL = import.meta.env.VITE_API_URL;
  // nyimpan data task dari backend
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState(""); // variabel buat add data
  // state edit
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // dipanggil 1x saat halaman dibuka
  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // ========================
  // POST - TAMBAH TASK
  // ========================
  const addTask = () => {
    if (!title) return;

    fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        completed: false,
      }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks((prev) => [...prev, newTask]); // update state langsung
        setTitle(""); // kosongkan input
      })
      .catch((err) => console.error(err));
  };

  // ========================
  // DELETE TASK
  // ========================
  const deleteTask = (id) => {
    fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTasks((prev) => prev.filter((task) => task._id !== id)); // update state
      })
      .catch((err) => console.error(err));
  };

  // ========================
  // PUT - TOGGLE COMPLETED
  // ========================
  const toggleCompleted = (task) => {
    fetch(`${API_URL}/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
        );
      })
      .catch((err) => console.error(err));
  };

  // ========================
  // PUT - EDIT TASK
  // ========================
  const updateTask = (id) => {
    fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editTitle,
      }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          )
        );
        setEditingId(null);
        setEditTitle("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="container">
        <h1>Task Manager</h1>

        {/* FORM TAMBAH TASK */}
        <div className="form">
          <input
            type="text"
            placeholder="Tambah task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button onClick={addTask}>Add</button>
        </div>

        {/* MENAMPILKAN DATA */}
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className={task.completed ? "done" : ""}>
              {/* BAGIAN KIRI */}
              <div className="task-left">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompleted(task)}
                />

                {/* task */}
                {editingId === task._id ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  <span>{task.title}</span>
                )}
              </div>

              {/* BAGIAN KANAN */}
              <div className="task-actions">
                {editingId === task._id ? (
                  <button
                    className="save-btn"
                    onClick={() => updateTask(task._id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingId(task._id);
                      setEditTitle(task.title);
                    }}
                  >
                    Edit
                  </button>
                )}

                {/* MongoDB identifikasi data pakai _id */}
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
