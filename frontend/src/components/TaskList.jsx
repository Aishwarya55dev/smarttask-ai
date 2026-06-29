import { useState } from "react";
function TaskList({ tasks, deleteTask, toggleTaskStatus }) {
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = tasks
    .filter((task) => {
      if (filter === "All") return true;
      if (filter === "Pending") return task.status === "Pending";
      if (filter === "Completed") return task.status === "Completed";
      if (filter === "High") return task.priority === "High";
      if (filter === "Medium") return task.priority === "Medium";
      if (filter === "Low") return task.priority === "Low";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
      if (sortBy === "priority") {
        const order = { High: 0, Medium: 1, Low: 2 };
        return order[a.priority] - order[b.priority];
      }
      return 0;
    });

  if (tasks.length === 0) {
    return <p className="empty">No tasks added yet.</p>;
  }

  return (
    <div className="task-list-wrapper">

      {/* Filter & Sort Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          {["All", "Pending", "Completed", "High", "Medium", "Low"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="deadline">Deadline</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* Task Count */}
      <p className="task-count">
        Showing <strong>{filtered.length}</strong> of <strong>{tasks.length}</strong> tasks
      </p>

      {filtered.length === 0 ? (
        <p className="empty">No tasks match this filter.</p>
      ) : (
        <div className="task-list">
          {filtered.map((task) => (
            <div
              key={task._id}
              className={`task-card ${task.status === "Completed" ? "completed" : ""} priority-${task.priority.toLowerCase()}`}
            >
              <h3>{task.title}</h3>

              <p>
                <strong>Priority:</strong> {task.priority}
              </p>

              <p>
                <strong>Status:</strong> {task.status}
              </p>

              <p>
                <strong>Deadline:</strong>{" "}
                {new Date(task.deadline).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <p>
                <strong>Estimated Hours:</strong> {task.estimatedHours}
              </p>

              <h4>Action Plan</h4>
              <ul>
                {task.breakdown?.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>

              <h4>AI Advice</h4>
              <ul>
                {task.advice?.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>

              <h4>🚨 AI Reminder</h4>
              <p className="ai-reminder">{task.reminder}</p>

              <div className="card-actions">
                <button onClick={() => toggleTaskStatus(task._id)}>
                  {task.status === "Pending" ? "✅ Complete" : "↩ Undo"}
                </button>
                <button onClick={() => deleteTask(task._id)}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;