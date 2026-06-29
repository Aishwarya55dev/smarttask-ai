import { useEffect, useState } from "react";
import "./App.css";
import AuthPage from "./components/AuthPage";
import { getAuth, logout } from "./services/authService";
import Dashboard from "./components/Dashboard";
import GoalTracker from "./components/GoalTracker";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Scheduler from "./components/Scheduler";
import TaskCalendar from "./components/TaskCalendar";
import HabitTracker from "./components/HabitTracker";
import {
  createTask,
  getTasks,
  deleteTask as deleteTaskAPI,
  toggleTaskStatus as toggleTaskStatusAPI,
} from "./services/taskService";
import {
  requestNotificationPermission,
  showNotification,
} from "./services/notificationService";

function App() {
  // ── 1. STATE ──
  const [user, setUser] = useState(getAuth().user);
  const [tasks, setTasks] = useState([]);

  // ── 2. EFFECTS ──
  useEffect(() => {
    if (!user) return; 
    fetchTasks();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (tasks.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    tasks.forEach((task) => {
      if (task.status === "Completed") return;
      if (!task.deadline) return;

      const deadline = new Date(task.deadline);
      deadline.setHours(0, 0, 0, 0);

      if (deadline.getTime() === today.getTime()) {
        showNotification(
          `⚠️ Due Today: ${task.title}`,
          `Priority: ${task.priority} — ${task.reminder}`
        );
      }

      if (deadline < today) {
        showNotification(
          `🚨 Overdue: ${task.title}`,
          `This task was due on ${deadline.toLocaleDateString()}`
        );
      }

      if (deadline.getTime() === tomorrow.getTime()) {
        showNotification(
          `⏰ Due Tomorrow: ${task.title}`,
          `${task.title} is due tomorrow.`
        );
      }
    });
  }, [tasks]);

  // ── 3. FUNCTIONS ──
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (taskTitle, deadline) => {
    try {
      const task = await createTask({ title: taskTitle, deadline });
      setTasks((prevTasks) => [task, ...prevTasks]);
      showNotification(
        "✅ Task Added",
        `"${task.title}" has been added successfully.`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskAPI(id);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTaskStatus = async (id) => {
    try {
      const updatedTask = await toggleTaskStatusAPI(id);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  // ── 4. CONDITIONAL RETURN ──
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // ── 5. MAIN RETURN ──
  return (
    <div className="app">
      <div className="header">
        <h1>LastMinute AI</h1>
        <p>Your AI Productivity Companion</p>
        <div className="user-bar">
          <span>👋 {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <Dashboard tasks={tasks} />
      <GoalTracker />
      <HabitTracker />
      <TaskForm addTask={addTask} />
      <TaskList
        tasks={tasks}
        deleteTask={deleteTask}
        toggleTaskStatus={toggleTaskStatus}
      />
      <Scheduler tasks={tasks} />
      <TaskCalendar tasks={tasks} />
    </div>
  );
}

export default App;