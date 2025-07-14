"use client"
import React, { useState } from 'react'
// import './sharedCalendar.css'
// import { Datepicker, DatepickerEvent } from "@meinefinsternis/react-horizontal-date-picker";
import { enUS } from "date-fns/locale";
import { addDays, subDays } from "date-fns";
import DatePicker from 'react-horizontal-datepicker';
import Link from 'next/link';

export default function SharedCalendar() {

    const [date, setDate] = useState({
        startValue: subDays(new Date(), 1), // Day before today
        endValue: addDays(new Date(), 3),   // Three days after today
        rangeDates: null,
    });

    const handleChange = (d) => {
        const [startValue, endValue, rangeDates] = d;
        setDate({ startValue, endValue, rangeDates });
    };

    const tasks = [
        { date: subDays(new Date(), 1), taskName: "Task 1" },
        { date: new Date(), taskName: "Task 2" },
        { date: addDays(new Date(), 1), taskName: "Task 3" },
        { date: addDays(new Date(), 2), taskName: "Task 4" },
        { date: addDays(new Date(), 3), taskName: "Task 5" },
    ];


    return (
        <>
            <div className="shared-calender mb-4">
                <div className='d-flex justify-content-between'>
                    <h3 className='fw-bold'>Shared Calendar</h3>
                    <Link href='/calendar-schedule' className='text-muted'>
                        View All
                    </Link>
                </div>
                <div className="card shared-card">
                    <div className="card-body">
                        <div className="shared-dates d-flex justify-content-center d-none">
                            <a href="#">
                                <div className="single-date text-center ">
                                    <p className="day fw-bold m-0">Mon</p>
                                    <h2 className='date fw-bold'>10</h2>
                                    <p className="task-name fw-bold m-0">Class Revision</p>
                                </div>
                            </a>

                            <a href="#">
                                <div className="single-date text-center active">
                                    <p className="day fw-bold m-0">Tue</p>
                                    <h2 className='date fw-bold'>11</h2>
                                    <p className="task-name fw-bold m-0">Test Prep</p>
                                </div>
                            </a>

                            <a href="#">
                                <div className="single-date text-center ">
                                    <p className="day fw-bold m-0">Wed</p>
                                    <h2 className='date fw-bold'>12</h2>
                                    <p className="task-name fw-bold m-0">Test #1 & Prep</p>
                                </div>
                            </a>

                            <a href="#">
                                <div className="single-date text-center ">
                                    <p className="day fw-bold m-0">Thu</p>
                                    <h2 className='date fw-bold'>13</h2>
                                    <p className="task-name fw-bold m-0">Nothing Schedule</p>
                                </div>
                            </a>

                            <a href="#">
                                <div className="single-date text-center ">
                                    <p className="day fw-bold m-0">Fri</p>
                                    <h2 className='date fw-bold'>14</h2>
                                    <p className="task-name fw-bold m-0">Class Hangout</p>
                                </div>
                            </a>
                        </div>

                        <div className="">
                            <DatePicker
                                onChange={handleChange}
                                locale={enUS}
                                startValue={date.startValue}
                                endValue={date.endValue}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
