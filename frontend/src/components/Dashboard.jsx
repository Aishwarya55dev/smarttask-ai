import { useEffect, useState } from "react";
import { getProductivityInsights } from "../services/aiService";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

function Dashboard({ tasks }) {
  const [insight, setInsight] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);

  const pendingTasks = tasks.filter((t) => t.status === "Pending");
  const completedTasks = tasks.filter((t) => t.status === "Completed");

  const urgentTasks = pendingTasks.filter((task) => {
    if (!task.deadline) return false;
    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);
    return task.priority === "High" && deadline >= today && deadline <= threeDaysLater;
  });

  const overdueTasks = pendingTasks.filter((task) => {
    if (!task.deadline) return false;
    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
  });

  const todayTasks = pendingTasks.filter((task) => {
    if (!task.deadline) return false;
    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);
    return deadline.getTime() === today.getTime();
  });

  const tomorrowTasks = pendingTasks.filter((task) => {
    if (!task.deadline) return false;
    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);
    return deadline.getTime() === tomorrow.getTime();
  });

  const totalHours = pendingTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const focusTask = urgentTasks[0] || pendingTasks[0];

  // ── Chart Data ──
  const pieData = [
    { name: "Completed", value: completedTasks.length },
    { name: "Pending", value: pendingTasks.length },
  ];

  const PIE_COLORS = ["#10b981", "#7c3aed"];

  const priorityData = [
    { name: "High", value: tasks.filter((t) => t.priority === "High").length },
    { name: "Medium", value: tasks.filter((t) => t.priority === "Medium").length },
    { name: "Low", value: tasks.filter((t) => t.priority === "Low").length },
  ];

  const statusData = [
    { name: "Overdue", value: overdueTasks.length },
    { name: "Due Today", value: todayTasks.length },
    { name: "Tomorrow", value: tomorrowTasks.length },
    { name: "Urgent", value: urgentTasks.length },
    { name: "Pending", value: pendingTasks.length },
    { name: "Completed", value: completedTasks.length },
  ];

  useEffect(() => {
    async function loadInsights() {
      if (tasks.length === 0) { setInsight(null); return; }
      try {
        const result = await getProductivityInsights();
        setInsight(result);
      } catch (error) {
        console.error(error);
      }
    }
    loadInsights();
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="dashboard">
        <h2>🤖 Today's AI Summary</h2>
        <p>Add tasks to see your productivity dashboard.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>🤖 Today's AI Summary</h2>

      {/* ── Stat Cards ── */}
      <div className="stat-grid">
        <div className="stat-card red">
          <span className="stat-icon">🚨</span>
          <span className="stat-value">{overdueTasks.length}</span>
          <span className="stat-label">Overdue</span>
        </div>
        <div className="stat-card orange">
          <span className="stat-icon">📅</span>
          <span className="stat-value">{todayTasks.length}</span>
          <span className="stat-label">Due Today</span>
        </div>
        <div className="stat-card blue">
          <span className="stat-icon">⏰</span>
          <span className="stat-value">{tomorrowTasks.length}</span>
          <span className="stat-label">Tomorrow</span>
        </div>
        <div className="stat-card green">
          <span className="stat-icon">✅</span>
          <span className="stat-value">{completedTasks.length}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card purple">
          <span className="stat-icon">📋</span>
          <span className="stat-value">{pendingTasks.length}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card teal">
          <span className="stat-icon">⏳</span>
          <span className="stat-value">{totalHours}h</span>
          <span className="stat-label">Remaining</span>
        </div>
      </div>

      {/* ── Focus Task ── */}
      {focusTask && (
        <div className="focus-task">
          <span className="focus-label">🔥 Focus First</span>
          <span className="focus-title">{focusTask.title}</span>
        </div>
      )}

      {/* ── Charts Row ── */}
      <div className="charts-row">

        {/* Pie Chart */}
        <div className="chart-card">
          <h3>Task Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1e2030",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: "#8892a4", fontSize: "0.82rem" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Bar Chart */}
        <div className="chart-card">
          <h3>By Priority</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData} barSize={32}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#8892a4", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8892a4", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e2030",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                <Cell fill="#ef4444" />
                <Cell fill="#f59e0b" />
                <Cell fill="#10b981" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Bar Chart */}
        <div className="chart-card">
          <h3>Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusData} barSize={24}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#8892a4", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8892a4", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e2030",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                }}
              />
              <Bar dataKey="value" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ── AI Coach ── */}
      <hr />
      <h3>🚨 AI Productivity Coach</h3>

      {insight ? (
        <>
          <p>
            <strong>Risk Level:</strong> {insight.risk}
          </p>
          <p>{insight.summary}</p>
          <ul>
            {insight.recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading AI insights...</p>
      )}
    </div>
  );
}

export default Dashboard;