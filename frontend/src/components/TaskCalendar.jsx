import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function TaskCalendar({ tasks }) {
  const events = tasks.map((task) => ({
    title: task.title,
    start: new Date(task.deadline),
    end: new Date(task.deadline),
    allDay: true,
  }));

  return (
    <div
      style={{
        height: "600px",
        marginTop: "30px",
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <h2>📅 Task Calendar</h2>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month"]}
        defaultView="month"
      />
    </div>
  );
}

export default TaskCalendar;