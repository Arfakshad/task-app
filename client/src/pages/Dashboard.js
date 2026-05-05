import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🔥 IMPORTANT: Your Render backend URL
  const API = "https://task-app-0jgl.onrender.com/api/tasks";

  // =========================
  // FETCH TASKS
  // =========================
  const getTasks = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      setTasks(res.data);
    } catch (err) {
      console.error("GET ERROR:", err.response?.data || err.message);
    }
  };

  // =========================
  // CREATE TASK
  // =========================
  const createTask = async () => {
    if (!title.trim()) return alert("Enter task");

    try {
      setLoading(true);

      const res = await axios.post(
        API,
        { title },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      console.log("Created:", res.data);

      setTitle("");
      getTasks();
    } catch (err) {
      console.error("CREATE ERROR:", err.response?.data || err.message);
      alert(err.response?.data || "Task failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE TASK
  // =========================
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      getTasks();
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err.message);
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================
  const toggleStatus = async (task) => {
    try {
      await axios.put(
        `${API}/${task._id}`,
        {
          status: task.status === "pending" ? "completed" : "pending"
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );
      getTasks();
    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err.message);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    if (!token) {
      alert("Please login first");
      window.location.href = "/";
      return;
    }
    getTasks();
  }, []);

  // =========================
  // UI
  // =========================
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
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
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

        {/* Add Task */}
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
            {loading ? "Adding..." : "Add"}
          </button>
        </div>

        {/* Task List */}
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
                  background: "linear-gradient(135deg, #2c3e50, #4ca1af)",
                  color: "white",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.2)"
                }}
              >
                <span
                  style={{
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