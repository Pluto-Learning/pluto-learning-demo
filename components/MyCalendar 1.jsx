'use-client'
import React, { useState, useCallback, useMemo } from "react";
import { render } from "react-dom";
// import events from "./events";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import * as dates from 'date-arithmetic'
export default function MyCalendar() {

  const events =  [
    {
      'title': 'All Day Event very long title',
      'allDay': true,
      'start': new Date(2015, 3, 0),
      'end': new Date(2015, 3, 1)
    },
    {
      'title': 'Long Event',
      'start': new Date(2015, 3, 7),
      'end': new Date(2015, 3, 10)
    },
  
    {
      'title': 'DTS STARTS',
      'start': new Date(2016, 2, 13, 0, 0, 0),
      'end': new Date(2016, 2, 20, 0, 0, 0)
    },
  
    {
      'title': 'DTS ENDS',
      'start': new Date(2016, 10, 6, 0, 0, 0),
      'end': new Date(2016, 10, 13, 0, 0, 0)
    },
  
    {
      'title': 'Some Event',
      'start': new Date(2015, 3, 9, 0, 0, 0),
      'end': new Date(2015, 3, 9, 0, 0, 0)
    },
    {
      'title': 'Conference',
      'start': new Date(2015, 3, 11),
      'end': new Date(2015, 3, 13),
      desc: 'Big conference for important people'
    },
    {
      'title': 'Meeting',
      'start': new Date(2015, 3, 12, 10, 30, 0, 0),
      'end': new Date(2015, 3, 12, 12, 30, 0, 0),
      desc: 'Pre-meeting meeting, to prepare for the meeting'
    },
    {
      'title': 'Lunch',
      'start': new Date(2015, 3, 12, 12, 0, 0, 0),
      'end': new Date(2015, 3, 12, 13, 0, 0, 0),
      desc: 'Power lunch'
    },
    {
      'title': 'Meeting',
      'start': new Date(2015, 3, 12, 14, 0, 0, 0),
      'end': new Date(2015, 3, 12, 15, 0, 0, 0)
    },
    {
      'title': 'Happy Hour',
      'start': new Date(2015, 3, 12, 17, 0, 0, 0),
      'end': new Date(2015, 3, 12, 17, 30, 0, 0),
      desc: 'Most important meal of the day'
    },
    {
      'title': 'Dinner',
      'start': new Date(2015, 3, 12, 20, 0, 0, 0),
      'end': new Date(2015, 3, 12, 21, 0, 0, 0)
    },
    {
      'title': 'Birthday Party',
      'start': new Date(2015, 3, 13, 7, 0, 0),
      'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
      'title': 'Birthday Party 2',
      'start': new Date(2015, 3, 13, 7, 0, 0),
      'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
      'title': 'Birthday Party 3',
      'start': new Date(2015, 3, 13, 7, 0, 0),
      'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
      'title': 'Late Night Event',
      'start': new Date(2015, 3, 17, 19, 30, 0),
      'end': new Date(2015, 3, 18, 2, 0, 0)
    },
    {
      'title': 'Multi-day Event',
      'start': new Date(2015, 3, 20, 19, 30, 0),
      'end': new Date(2015, 3, 22, 2, 0, 0)
    }
  ]
  

  const DragAndDropCalendar = withDragAndDrop(Calendar);
  moment.locale("en-GB");
  const localizer = momentLocalizer(moment);

  const [eventList, setEventList] = useState(events);

  const moveEvent = useCallback(({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const idx = eventList.indexOf(event);
    let allDay = event.allDay;

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }

    const updatedEvent = { ...event, start, end, allDay };

    const nextEvents = [...eventList];
    nextEvents.splice(idx, 1, updatedEvent);

    setEventList(nextEvents);

    // alert(`${event.title} was dropped onto ${updatedEvent.start}`);
  }, [eventList]);

  const resizeEvent = useCallback(({ event, start, end }) => {
    const nextEvents = eventList.map(existingEvent => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    setEventList(nextEvents);

    // alert(`${event.title} was resized to ${start}-${end}`);
  }, [eventList]);

  const newEvent = useCallback((event) => {
    // let idList = eventList.map(a => a.id);
    // let newId = Math.max(...idList) + 1;
    // let hour = {
    //   id: newId,
    //   title: 'New Event',
    //   allDay: event.slots.length === 1,
    //   start: event.start,
    //   end: event.end,
    // };
    // setEventList([...eventList, hour]);
  }, [eventList]);
  const { defaultDate, max } = useMemo(
    () => ({
      defaultDate: new Date(2015, 3, 13),
      max: dates.add(dates.endOf(new Date(2015, 17, 1), 'day'), -1, 'hours'),
    }),
    []
  )


  /* eslint no-fallthrough: off */

const MILLI = {
  seconds: 1000,
  minutes: 1000 * 60,
  hours: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
}

const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

 function monthsInYear(year) {
  let date = new Date(year, 0, 1)

  return MONTHS.map((i) => dates.month(date, i))
}

 function firstVisibleDay(date, localizer) {
  let firstOfMonth = dates.startOf(date, 'month')

  return dates.startOf(firstOfMonth, 'week', localizer.startOfWeek())
}

 function lastVisibleDay(date, localizer) {
  let endOfMonth = dates.endOf(date, 'month')

  return dates.endOf(endOfMonth, 'week', localizer.startOfWeek())
}

 function visibleDays(date, localizer) {
  let current = firstVisibleDay(date, localizer),
    last = lastVisibleDay(date, localizer),
    days = []

  while (dates.lte(current, last, 'day')) {
    days.push(current)
    current = dates.add(current, 1, 'day')
  }

  return days
}

 function ceil(date, unit) {
  let floor = dates.startOf(date, unit)

  return dates.eq(floor, date) ? floor : dates.add(floor, 1, unit)
}

 function range(start, end, unit = 'day') {
  let current = start,
    days = []

  while (dates.lte(current, end, unit)) {
    days.push(current)
    current = dates.add(current, 1, unit)
  }

  return days
}

 function merge(date, time) {
  if (time == null && date == null) return null

  if (time == null) time = new Date()
  if (date == null) date = new Date()

  date = dates.startOf(date, 'day')
  date = dates.hours(date, dates.hours(time))
  date = dates.minutes(date, dates.minutes(time))
  date = dates.seconds(date, dates.seconds(time))
  return dates.milliseconds(date, dates.milliseconds(time))
}

 function eqTime(dateA, dateB) {
  return (
    dates.hours(dateA) === dates.hours(dateB) &&
    dates.minutes(dateA) === dates.minutes(dateB) &&
    dates.seconds(dateA) === dates.seconds(dateB)
  )
}

 function isJustDate(date) {
  return (
    dates.hours(date) === 0 &&
    dates.minutes(date) === 0 &&
    dates.seconds(date) === 0 &&
    dates.milliseconds(date) === 0
  )
}

 function duration(start, end, unit, firstOfWeek) {
  if (unit === 'day') unit = 'date'
  return Math.abs(
    // eslint-disable-next-line import/namespace
    dates[unit](start, undefined, firstOfWeek) -
      // eslint-disable-next-line import/namespace
      dates[unit](end, undefined, firstOfWeek)
  )
}

 function diff(dateA, dateB, unit) {
  if (!unit || unit === 'milliseconds') return Math.abs(+dateA - +dateB)

  // the .round() handles an edge case
  // with DST where the total won't be exact
  // since one day in the range may be shorter/longer by an hour
  return Math.round(
    Math.abs(
      +dates.startOf(dateA, unit) / MILLI[unit] -
        +dates.startOf(dateB, unit) / MILLI[unit]
    )
  )
}

 function total(date, unit) {
  let ms = date.getTime(),
    div = 1

  switch (unit) {
    case 'week':
      div *= 7
    case 'day':
      div *= 24
    case 'hours':
      div *= 60
    case 'minutes':
      div *= 60
    case 'seconds':
      div *= 1000
  }

  return ms / div
}

 function week(date) {
  var d = new Date(date)
  d.setHours(0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7)
}

 function today() {
  return dates.startOf(new Date(), 'day')
}

 function yesterday() {
  return dates.add(dates.startOf(new Date(), 'day'), -1, 'day')
}

 function tomorrow() {
  return dates.add(dates.startOf(new Date(), 'day'), 1, 'day')
}
  return (
    // <DragAndDropCalendar
    //   style={{ height: 700 }}
    //   selectable
    //   popup
    //   localizer={localizer}
    //   events={eventList}
    //   onEventDrop={moveEvent}
    //   resizable
    //   onEventResize={resizeEvent}
    //   onSelectSlot={newEvent}
    //   onDragStart={console.log}
    //   defaultView={Views.MONTH}
    //   defaultDate={new Date(2015, 3, 12)}

    //   dayLayoutAlgorithm="no-overlap"
    //   max={max}
    //   showMultiDayTimes
    //   step={60}
    // />

    <Calendar
            views={["month"]}
            selectable
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={eventList}
            onSelectEvent={(event) => toast.success(event.title)}
          />
  );
}
