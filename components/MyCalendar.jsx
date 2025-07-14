"use client";
import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Configure moment localizer
const localizer = momentLocalizer(moment);

export default function MyCalendar({ studentCourseSection }) {


  // const formattedEvents = studentCourseSection.map(item => ({
  //   title: item.courseName || item.courseNumber,
  //   allDay: false,
  //   start: new Date(item.sectionStartTime),
  //   end: new Date(item.sectionEndTime),
  // }));

  // console.log('studentCourseSection: ', formattedEvents)

  const [events, setEvents] = useState([
    {
      title: "CSE 1310",
      allDay: false,
      start: new Date(2024, 8, 19, 10, 0),
      end: new Date(2024, 8, 19, 13, 0),
    },
    {
      title: "MATH 2425",
      allDay: false,
      start: new Date(2024, 8, 23, 13, 0),
      end: new Date(2024, 8, 23, 14, 0),
    },
  ]);

  console.log(moment(new Date(2024, 8, 19, 10, 0)).format());


  return (
    <div className="my-calendar">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
        defaultView="month"
        toolbar={true}
        style={{ height: 600 }}
        step={60} // Set the time slot steps to 60 mins
        showMultiDayTimes={true} // Show multi-day events
        selectable={true} // Optional: Enables selection
      />
    </div>
  );
}
