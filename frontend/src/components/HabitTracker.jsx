import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";
const API = `${API_BASE}/api/habits`;
function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const res = await axios.get(API);
    setHabits(res.data);
  };

  const addHabit = async () => {
    if (!title.trim()) return;
    const res = await axios.post(API, { title });
    setHabits([res.data, ...habits]);
    setTitle("");
  };

  const markDone = async (id) => {
    const res = await axios.patch(`${API}/${id}/done`);
    setHabits(habits.map((h) => (h._id === id ? res.data : h)));
  };

  const deleteHabit = async (id) => {
    await axios.delete(`${API}/${id}`);
    setHabits(habits.filter((h) => h._id !== id));
  };

  return (
    <div className="goal-section">
      <h2>🔥 Habit Tracker</h2>

      <input
        placeholder="New Habit (e.g. Read 30 mins)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={addHabit}>Add Habit</button>

      {habits.map((habit) => (
        <div key={habit._id} className="goal-card">
          <h3>{habit.title}</h3>

          <p>🔥 Streak: {habit.streak} days</p>

          <p>
            {habit.completedToday
              ? "✅ Done today"
              : "❌ Not done yet"}
          </p>

          <button
            onClick={() => markDone(habit._id)}
            disabled={habit.completedToday}
          >
            Mark Done Today
          </button>

          <button onClick={() => deleteHabit(habit._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default HabitTracker;