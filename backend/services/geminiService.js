const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeTaskAI(taskTitle) {
  try {
    const prompt = `
You are an AI Productivity Assistant.

Analyze the following task:

"${taskTitle}"

Rules:
- priority must be High, Medium, or Low
- estimatedHours must be at least 1
- infer deadline whenever possible
- generate exactly 5 actionable steps
- generate exactly 3 productivity tips
- generate one short motivational reminder

Return ONLY valid JSON.

{
  "priority": "High",
  "deadline": "Tomorrow",
  "estimatedHours": 3,
  "breakdown": [
    "Step 1",
    "Step 2",
    "Step 3",
    "Step 4",
    "Step 5"
  ],
  "advice": [
    "Advice 1",
    "Advice 2",
    "Advice 3"
  ],
  "reminder": "Your reminder here"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    let text = response.text;

    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");
    text = text.trim();

    const result = JSON.parse(text);

    if (!result.priority) result.priority = "Medium";
    if (!result.deadline) result.deadline = "Not Set";
    if (!result.estimatedHours || result.estimatedHours < 1) {
      result.estimatedHours = 1;
    }

    if (!Array.isArray(result.breakdown) || result.breakdown.length === 0) {
      result.breakdown = [
        "Plan task",
        "Start work",
        "Continue progress",
        "Review work",
        "Complete task",
      ];
    }

    if (!Array.isArray(result.advice) || result.advice.length === 0) {
      result.advice = [
        "Start early",
        "Avoid distractions",
        "Review progress regularly",
      ];
    }

    if (!result.reminder) {
      result.reminder = "";
    }

    return result;
  } catch (error) {
    console.error(error);

    return {
      priority: "Medium",
      deadline: "Not Set",
      estimatedHours: 1,
      breakdown: [
        "Plan task",
        "Start work",
        "Continue progress",
        "Review work",
        "Complete task",
      ],
      advice: [
        "Start early",
        "Avoid distractions",
        "Review progress regularly",
      ],
      reminder: "",
    };
  }
}
async function generateRiskAnalysis(tasks) {
  try {
    const taskList = tasks
      .map(
        (task) =>
          `Title: ${task.title}
Priority: ${task.priority}
Deadline: ${task.deadline}
Estimated Hours: ${task.estimatedHours}`
      )
      .join("\n\n");

    const prompt = `
You are an AI productivity coach.

Analyze the user's pending tasks.

Tasks:
${taskList}

Your goal is to help the user avoid missing deadlines.

Consider:
- Priority
- Deadlines
- Total workload
- Which tasks should be postponed
- Which task should be completed first

Return ONLY valid JSON.

{
  "risk":"Low | Medium | High",
  "summary":"Short explanation",
  "recommendations":[
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ]
}
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

    return {
      risk: "Medium",
      summary:
        "You have multiple pending tasks. Focus on high-priority work first.",
      recommendations: [
        "Complete urgent tasks first.",
        "Avoid multitasking.",
        "Reserve uninterrupted focus time."
      ]
    };
  }
}

module.exports = {
  analyzeTaskAI,
  generateRiskAnalysis,
};