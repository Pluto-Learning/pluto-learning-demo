
"use client"
import MyCalendar from '@/components/MyCalendar'
import SimpleCalendar from '@/components/simpleCalendar/SimpleCalendar'
import ProfileLayout from '@/layouts/profileLayout/ProfileLayout'
import FullCalendarIo from '@/components/FullCalendarIo'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'
import { fetchStudentCourseSectionDetailsById, fetchTableDesilsByUserId } from '@/app/api/crud'
import HomeLayout from '@/layouts/homeLayout/HomeLayout'


export default function page() {

    const { data: session } = useSession()

    const [tableDesilsByUserId, setTableDesilsByUserId] = useState([])
    const [studentCourseSectionDetailsById, setstudentCourseSectionDetailsById] = useState([])


    const getTableDesilsByUserId = async () => {
        try {
            const data = await fetchTableDesilsByUserId(session?.user?.id, session?.user?.token);
            setTableDesilsByUserId(data);
        } catch (error) {
            console.log(error);
        }
    };

    const getStudentCourseSectionDetailsById = async () => {
        try {
            const data = await fetchStudentCourseSectionDetailsById(session?.user?.id, session?.user?.token);
            setstudentCourseSectionDetailsById(data);
        } catch (error) {
            console.log(error);
        }
    };

    const combinedData = tableDesilsByUserId.map(item => {
        // Loop through each member's course sections to match with course details
        const matchingCourseSections = item.tableMembers.flatMap(member =>
            member.courseSection.filter(section =>
                section.courseId === item.table.courseId
            )
        );

        // If course details are available, get the first match; otherwise, set default values
        const courseDetails = matchingCourseSections.length > 0 ? matchingCourseSections[0] : null;

        // Parse meetingTime and calculate start and end times
        const startTime = new Date(item.table.meetingTime);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Add 1 hour

        return {
            title: item.table.roomName + (courseDetails ? ` - ${courseDetails.courseName}` : ""),
            extendedProps: {
                attendees: item.tableMembers.map(member => ({
                    name: `${member.tableMemberDetails.firstName} ${member.tableMemberDetails.lastName}`,
                    imageUrl: member.tableMemberDetails.profilePicture || "https://via.placeholder.com/40",
                })),
                courseName: courseDetails ? courseDetails.courseName : "No Course Name",
                sectionName: courseDetails ? courseDetails.sectionName : "No Section Name"
            },
            start: startTime.toISOString(),
            end: endTime.toISOString(),
        };
    });





    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Example event data with an array of attendees
        const jsonData = [
            {
                title: "ECO Warriors",
                start: "2024-11-10T07:45:00",
                end: "2024-11-10T09:00:00",
                extendedProps: {
                    attendees: [
                        { name: "Person 1", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 2", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 3", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 4", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 5", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 6", imageUrl: "https://via.placeholder.com/40" },
                    ],
                },
            },
            {
                title: "ECO Warriors",
                start: "2024-11-10T07:45:00",
                end: "2024-11-10T09:00:00",
                extendedProps: {
                    attendees: [
                        { name: "Person 1", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 2", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 3", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 4", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 5", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 6", imageUrl: "https://via.placeholder.com/40" },
                    ],
                },
            },
            {
                title: "ECO Warriors",
                start: "2024-11-10T07:45:00",
                end: "2024-11-10T09:00:00",
                extendedProps: {
                    attendees: [
                        { name: "Person 1", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 2", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 3", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 4", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 5", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 6", imageUrl: "https://via.placeholder.com/40" },
                    ],
                },
            },
            {
                title: "ECO Warriors",
                start: "2024-11-10T07:45:00",
                end: "2024-11-10T09:00:00",
                extendedProps: {
                    attendees: [
                        { name: "Person 1", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 2", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 3", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 4", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 5", imageUrl: "https://via.placeholder.com/40" },
                        { name: "Person 6", imageUrl: "https://via.placeholder.com/40" },
                    ],
                },
            }
            // Additional events...
        ];

        setEvents(jsonData);
    }, []);

    useEffect(() => {
        getTableDesilsByUserId()
        getStudentCourseSectionDetailsById()
    }, [session])


    console.log('combinedData: ', combinedData)
    console.log('tableDesilsByUserId: ', tableDesilsByUserId)
    // console.log('studentCourseSectionDetailsById: ssss', studentCourseSectionDetailsById)

    return (
        <HomeLayout>
            <div className="container-fluid">
                <div className="">
                    <div className="calendar-schedule">
                        <div className="row g-3">
                            <div className="col-xl-2">
                                <div className="calendar-schedule-left">
                                    <SimpleCalendar />
                                    {/* <div class="accordion calendar-filter-accordion" id="calendar-filter-accordion">
                                        <div class="accordion-item">
                                            <h2 class="accordion-header">
                                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    My Calendars
                                                </button>
                                            </h2>
                                            <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#calendar-filter-accordion">
                                                <div class="accordion-body">
                                                    <form>
                                                        <div class="form-check mb-3">
                                                            <input class="form-check-input" type="checkbox" value="" id="calendar-filter-checkbox-1" />
                                                            <label class="form-check-label" for="calendar-filter-checkbox-1">
                                                                My Schedules
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-3">
                                                            <input class="form-check-input" type="checkbox" value="" id="calendar-filter-checkbox-2" />
                                                            <label class="form-check-label" for="calendar-filter-checkbox-2">
                                                                Task and Events
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-3">
                                                            <input class="form-check-input" type="checkbox" value="" id="calendar-filter-checkbox-3" />
                                                            <label class="form-check-label" for="calendar-filter-checkbox-3">
                                                                Projects
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-3">
                                                            <input class="form-check-input" type="checkbox" value="" id="calendar-filter-checkbox-4" />
                                                            <label class="form-check-label" for="calendar-filter-checkbox-4">
                                                                Holidays
                                                            </label>
                                                        </div>
                                                        <button className="btn">+ Add New</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="task-main">
                                        <div className="task-top">
                                            <h6 className="task-title">My Tasks</h6>
                                        </div>
                                        <form>
                                            <ul class="list-group list-group-flush task-list">
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-1" />
                                                    <label class="form-check-label" for="task-checkbox-1">Meeting With Juniors</label>
                                                    {/* <span class="checkmark"></span> */}
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-2" />
                                                    <label class="form-check-label" for="task-checkbox-2">Create an adaptive UI</label>
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-3" />
                                                    <label class="form-check-label" for="task-checkbox-3">Design & wireframe for iOS</label>
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-4" />
                                                    <label class="form-check-label" for="task-checkbox-4">Design & wireframe for iOS</label>
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-5" />
                                                    <label class="form-check-label" for="task-checkbox-5">Meeting with My Team</label>
                                                </li>
                                            </ul>

                                            <div className="btn-wrapper">
                                                <button className="btn rounded-pill add-task-btn">+ Add New</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-8">
                                {/* <MyCalendar /> */}
                                <FullCalendarIo data={combinedData} />
                            </div>
                            <div className="col-xl-2 ">
                                <div className="calendar-schedule-right">
                                    <h4>My Tasks</h4>
                                    <div className="task-main">
                                        <div className="task-top">
                                            <h6 className="task-title">Office</h6>
                                            <div className='task-count border rounded-pill'>
                                                <p>1/4</p>
                                            </div>
                                            <div class="dropdown ms-auto">
                                                <button class="btn btn-sm border rounded-pill" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i class="fa-solid fa-ellipsis"></i>
                                                </button>
                                                <ul class="dropdown-menu">
                                                    <li><a class="dropdown-item" href="#">Action</a></li>
                                                    <li><a class="dropdown-item" href="#">Another action</a></li>
                                                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <form>
                                            <ul class="list-group list-group-flush task-list">
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-1" />
                                                    <label class="form-check-label" for="task-checkbox-1">Meeting With Juniors</label>
                                                    {/* <span class="checkmark"></span> */}
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-2" />
                                                    <label class="form-check-label" for="task-checkbox-2">Create an adaptive UI</label>
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-3" />
                                                    <label class="form-check-label" for="task-checkbox-3">Design & wireframe for iOS</label>
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-4" />
                                                    <label class="form-check-label" for="task-checkbox-4">Design & wireframe for iOS</label>
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-5" />
                                                    <label class="form-check-label" for="task-checkbox-5">Meeting with My Team</label>
                                                </li>
                                            </ul>

                                            <div className="btn-wrapper">
                                                <button className="btn rounded-pill add-task-btn">+ Add Task</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="task-main">
                                        <div className="task-top">
                                            <h6 className="task-title">Office</h6>
                                            <div className='task-count border rounded-pill'>
                                                <p>1/4</p>
                                            </div>
                                            <div class="dropdown ms-auto">
                                                <button class="btn btn-sm border rounded-pill" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i class="fa-solid fa-ellipsis"></i>
                                                </button>
                                                <ul class="dropdown-menu">
                                                    <li><a class="dropdown-item" href="#">Action</a></li>
                                                    <li><a class="dropdown-item" href="#">Another action</a></li>
                                                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <form>
                                            <ul class="list-group list-group-flush task-list">
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-1" />
                                                    <label class="form-check-label" for="task-checkbox-1">Meeting With Juniors</label>
                                                    {/* <span class="checkmark"></span> */}
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-2" />
                                                    <label class="form-check-label" for="task-checkbox-2">Create an adaptive UI</label>
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-3" />
                                                    <label class="form-check-label" for="task-checkbox-3">Design & wireframe for iOS</label>
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-4" />
                                                    <label class="form-check-label" for="task-checkbox-4">Design & wireframe for iOS</label>
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-5" />
                                                    <label class="form-check-label" for="task-checkbox-5">Meeting with My Team</label>
                                                </li>
                                            </ul>

                                            <div className="btn-wrapper">
                                                <button className="btn rounded-pill add-task-btn">+ Add Task</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="task-main">
                                        <div className="task-top">
                                            <h6 className="task-title">Office</h6>
                                            <div className='task-count border rounded-pill'>
                                                <p>1/4</p>
                                            </div>
                                            <div class="dropdown ms-auto">
                                                <button class="btn btn-sm border rounded-pill" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i class="fa-solid fa-ellipsis"></i>
                                                </button>
                                                <ul class="dropdown-menu">
                                                    <li><a class="dropdown-item" href="#">Action</a></li>
                                                    <li><a class="dropdown-item" href="#">Another action</a></li>
                                                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <form>
                                            <ul class="list-group list-group-flush task-list">
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-1" />
                                                    <label class="form-check-label" for="task-checkbox-1">Meeting With Juniors</label>
                                                    {/* <span class="checkmark"></span> */}
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-2" />
                                                    <label class="form-check-label" for="task-checkbox-2">Create an adaptive UI</label>
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-3" />
                                                    <label class="form-check-label" for="task-checkbox-3">Design & wireframe for iOS</label>
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-4" />
                                                    <label class="form-check-label" for="task-checkbox-4">Design & wireframe for iOS</label>
                                                </li>
                                                <li class="list-group-item">
                                                    <input class="form-check-input me-1" type="checkbox" value="" id="task-checkbox-5" />
                                                    <label class="form-check-label" for="task-checkbox-5">Meeting with My Team</label>
                                                </li>
                                            </ul>

                                            <div className="btn-wrapper">
                                                <button className="btn rounded-pill add-task-btn">+ Add Task</button>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}
