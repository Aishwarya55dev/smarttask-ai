import { useState } from "react";
import { startVoiceRecognition } from "../services/voiceService";

function TaskForm({ addTask }) {
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    addTask(task, deadline);
    setTask("");
    setDeadline("");
  };

  const handleVoice = () => {
    startVoiceRecognition((transcript) => {
      setTask(transcript);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />

      <button type="button" onClick={handleVoice}>
        🎤 Voice
      </button>

      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
/*
import { useState } from "react";

function TaskForm({ addTask }) {
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!task.trim()) return;

    addTask(task, deadline);

    setTask("");
    setDeadline("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />

      <button type="submit">
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
*/