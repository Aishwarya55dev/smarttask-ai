import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function analyzeTask(taskText) {
  try {

const prompt = `
Analyze this task:

"${taskText}"

Rules:
- priority must be High, Medium, or Low
- estimatedHours must be at least 1
- deadline should be inferred if possible
- Never return 0 estimated hours

Return ONLY raw JSON.

{
  "priority": "High",
  "deadline": "Tomorrow",
  "estimatedHours": 3
}
`;
   
   
const response = await ai.models.generateContent({
model: "gemini-2.5-flash-lite",
contents: prompt,
});

let text = response.text;

// Remove markdown code blocks
text = text.replace(/```json/g, "");
text = text.replace(/```/g, "");
text = text.trim();

console.log("Cleaned Response:", text);

const result = JSON.parse(text);

if (result.estimatedHours < 1) {
  result.estimatedHours = 1;
}

return result;
  } catch (error) {
    console.error(error);

    return {
      priority: "Medium",
      deadline: "Not Set",
      estimatedHours: 1,
    };
  }
}
export async function generateTaskBreakdown(taskTitle) {
  try {
    const prompt = `
Break down the following task into 5 short actionable steps.

Task:
"${taskTitle}"

Return ONLY a JSON array.

Example:

[
  "Step 1",
  "Step 2",
  "Step 3",
  "Step 4",
  "Step 5"
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    let text = response.text;

    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");
    text = text.trim();

    return JSON.parse(text);
  } catch (error) {
    console.error(error);

    return [
      "Plan task",
      "Start work",
      "Continue progress",
      "Review work",
      "Complete task",
    ];
  }
}

export async function generateAdvice(taskTitle) {
  try {
    const prompt = `
You are a productivity coach.

Task:
"${taskTitle}"

Give exactly 3 short productivity recommendations.

Return ONLY a JSON array.

Example:

[
  "Advice 1",
  "Advice 2",
  "Advice 3"
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    let text = response.text;

    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");
    text = text.trim();

    return JSON.parse(text);
  } catch (error) {
    console.error(error);

    return [
      "Start early",
      "Avoid distractions",
      "Review progress regularly",
    ];
  }
}
export async function generateSchedule(tasks, hours) {
  try {
    const taskText = tasks
      .map(
        (task) =>
          `${task.title} | Priority: ${task.priority} | Estimated Hours: ${task.estimatedHours}`
      )
      .join("\n");

    const prompt = `
You are an AI productivity planner.

Available Hours Today: ${hours}

Tasks:
${taskText}

Create the best schedule for today.

Return ONLY plain text.

Example:

6:00 PM - 7:00 PM Grocery Shopping
7:00 PM - 9:00 PM DBMS Test
9:00 PM - 10:00 PM Notes Revision
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error(error);
    return "Unable to generate schedule.";
  }
}
export async function generateReminder(task) {
  try {
    const prompt = `
You are an AI productivity coach.

Task:
Title: ${task.title}
Priority: ${task.priority}
Deadline: ${task.deadline}
Estimated Hours: ${task.estimatedHours}

Generate ONE proactive reminder.

Rules:
- Maximum 40 words.
- Tell the user WHAT ACTION to take.
- Never just repeat the deadline.
- Be motivational but concise.

Example:

Start studying today before 6 PM so you can comfortably finish your DBMS preparation before tomorrow's exam.

Return ONLY plain text.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    return response.text.trim();

  } catch (error) {
    console.error(error);

    return "Start working on this task today to stay ahead of the deadline.";
  }
}
export async function generateDashboardRecommendation(tasks) {
  try {
    const taskText = tasks
      .map(
        (task) =>
          `Task: ${task.title}
Priority: ${task.priority}
Deadline: ${task.deadline}
Status: ${task.status}
Estimated Hours: ${task.estimatedHours}`
      )
      .join("\n\n");

    const prompt = `
You are an AI productivity coach.

Here are the user's tasks:

${taskText}

Your job:

1. Identify the most important task.
2. Tell the user what to do today.
3. Mention which task can wait if necessary.
4. Keep the response under 80 words.
5. Sound like a helpful personal assistant.

Return ONLY plain text.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error(error);

    return "Focus on the highest-priority task today and complete it before starting less urgent work.";
  }
}