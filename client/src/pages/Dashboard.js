import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const API = "http://localhost:5000/api/tasks";

  
  // FETCH TASKS
 
  const getTasks = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: "Bearer " + token }
      });
      setTasks(res.data);
    } catch (err) {
      console.error("GET ERROR:", err.message);
    }
  };

  
  // CREATE TASK
 
  const createTask = async () => {
    if (!title.trim()) return alert("Enter task");

    try {
      setLoading(true);

      await axios.post(
        API,
        { title },
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      setTitle("");
      getTasks();
    } catch (err) {
      console.error("CREATE ERROR:", err.message);
    } finally {
      setLoading(false);
    }
  };


  // DELETE

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`, {
      headers: { Authorization: "Bearer " + token }
    });
    getTasks();
  };


  // TOGGLE STATUS

  const toggleStatus = async (task) => {
    await axios.put(
      `${API}/${task._id}`,
      {
        status: task.status === "pending" ? "completed" : "pending"
      },
      {
        headers: { Authorization: "Bearer " + token }
      }
    );
    getTasks();
  };

 
  // LOGOUT

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // LOAD

  useEffect(() => {
    if (!token) return (window.location.href = "/");
    getTasks();
  }, []);


  // UI

  return (
    <div
  style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1d2671, #c33764)",

    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: "650px",
      padding: "25px",
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      fontFamily: "Arial"
    }}
  >
      <h2 style={{ textAlign: "center" }}>📝 Task Manager</h2>

      {/* Logout */}
      <div style={{ textAlign: "right", marginBottom: "15px" }}>
        <button
          onClick={logout}
          style={{
            background: "#ff4d4f",
            color: "white",
            border: "none",
            padding: "7px 14px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          placeholder="Enter task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={createTask}
          disabled={loading}
          style={{
            background: "#28a745",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          {loading ? "..." : "Add"}
        </button>
      </div>

      {/* Tasks */}
      <div style={{ marginTop: "25px" }}>
        {tasks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            No tasks yet 🚀
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "12px",

                //  DARK MODERN STYLE
                background:
                  "linear-gradient(135deg, #2c3e50, #4ca1af)",
                color: "white",

                boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span
                style={{
                  fontSize: "17px",
                  textDecoration:
                    task.status === "completed"
                      ? "line-through"
                      : "none",
                  opacity: task.status === "completed" ? 0.6 : 1
                }}
              >
                {task.title}
              </span>

              <div>
                <button
                  onClick={() => toggleStatus(task)}
                  style={{
                    marginRight: "8px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  ✔
                </button>

                <button
                  onClick={() => deleteTask(task._id)}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </div>

  );
}