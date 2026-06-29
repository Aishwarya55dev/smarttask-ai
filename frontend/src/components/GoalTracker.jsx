import { useEffect, useState } from "react";

import {
  getGoals,
  createGoal,
  updateProgress,
  deleteGoal,
} from "../services/goalService";

function GoalTracker() {
  const [goals, setGoals] = useState([]);

  const [title, setTitle] = useState("");

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const data = await getGoals();
    setGoals(data);
  };

  const addGoal = async () => {
    if (!title.trim()) return;

    const goal = await createGoal({
      title,
      target: 100,
    });

    setGoals([goal, ...goals]);

    setTitle("");
  };

  const increaseProgress = async (goal) => {
    const updated = await updateProgress(
      goal._id,
      Math.min(goal.progress + 10, goal.target)
    );

    setGoals(
      goals.map((g) =>
        g._id === updated._id ? updated : g
      )
    );
  };

  const removeGoal = async (id) => {
    await deleteGoal(id);

    setGoals(
      goals.filter((g) => g._id !== id)
    );
  };

  return (
    <div className="goal-section">

      <h2>🎯 Goals</h2>

      <input
        placeholder="New Goal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={addGoal}>
        Add Goal
      </button>

      {goals.map((goal) => (
        <div key={goal._id} className="goal-card">

          <h3>{goal.title}</h3>

          <progress
            value={goal.progress}
            max={goal.target}
          />

          <p>
            {goal.progress}/{goal.target}
          </p>

          <button
            onClick={() =>
              increaseProgress(goal)
            }
          >
            +10%
          </button>

          <button
            onClick={() =>
              removeGoal(goal._id)
            }
          >
            Delete
          </button>

        </div>
      ))}

    </div>
  );
}

export default GoalTracker;