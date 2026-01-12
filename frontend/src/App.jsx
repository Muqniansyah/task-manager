import { useState, useEffect } from "react";

function App() {
  // nyimpan data task dari backend
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState(""); // variabel buat add data

  // dipanggil 1x saat halaman dibuka
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // ambil data task
  const fetchTasks = () => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.log(err));
  };

  // function post task/tambah data
  const addTask = () => {
    if (!title) return;

    fetch("http://localhost:5000/api/tasks", {
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
      .then(() => {
        setTitle(""); // kosongkan input
        fetchTasks(); // refresh list/Ambil ulang data biar UI update
      })
      .catch((err) => console.error(err));
  };

  // function delete task
  const deleteTask = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        fetchTasks(); // refresh list
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h1>Task Manager</h1>
        {/* FORM TAMBAH TASK */}
        <input
          type="text"
          placeholder="Tambah task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button onClick={addTask}>Add</button>

        {/* menampilkan data */}
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              {task.title}
              {/* MongoDB identifikasi data pakai _id */}
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
