"use client"
import { fetchCourse, updateTable } from '@/app/api/crud';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';

export default function EditTableInfo({tableData, updateAllTableDetails}) {

    const { data: session } = useSession();

    const {
        roomId,
        roomName,
        meetingTime,
        meetingDay,
        privacyStatus,
        tableType,
        shortDescription,
        longDescription,
        roomImg,
        courseId, // courseId from tableData
    } = tableData;

    
    // Function to format the date to the required format for 'datetime-local'
    const formatDateForInput = (date) => {
        const d = new Date(date);
        return d.toISOString().slice(0, 16); // Slice to get "YYYY-MM-DDTHH:MM"
    };

    // Function to get the day of the week from a meeting time
    const getDayFromMeetingTime = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { weekday: 'long' });
    };

    const [formData, setFormData] = useState({
        roomId: roomId || '',
        roomName: roomName || '',
        courseId: courseId || '', // Set courseId from tableData
        meetingTime: meetingTime ? formatDateForInput(meetingTime) : '',
        meetingDay: meetingTime ? getDayFromMeetingTime(meetingTime) : '',
        privacyStatus: privacyStatus || 'string',
        tableType: tableType || '',
        shortDescription: shortDescription || '',
        longDescription: longDescription || '',
        roomImg: roomImg || 'string',
        lastActive: new Date().toISOString(),
        status: 'active',
    });

    const [courses, setCourses] = useState([]); // For storing courses from the API
    const tableTypes = ['Study Group', 'Organization Event', 'Professor Specific'];


    // Fetch course options from external API
    useEffect(() => {
        const getAllCourse = async () => {
            try {
                const response = await fetchCourse(session?.user?.token); // Fetch courses from API
                setCourses(response);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        getAllCourse();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'meetingTime') {
            const formattedMeetingTime = formatDateForInput(value);
            const meetingDay = getDayFromMeetingTime(value);

            setFormData({
                ...formData,
                meetingTime: formattedMeetingTime,
                meetingDay: meetingDay,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // Handle Create Table
    const handleUpdateTable = async () => {
        try {
            await updateTable(roomId, formData, session?.user?.token);
            updateAllTableDetails()
            // window.location.reload();
        } catch (error) {
            console.error("Error creating Table:", error);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        handleUpdateTable();
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="">
                <div className="mb-3">
                    <label htmlFor="roomName" className="form-label">Room Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="roomName"
                        name="roomName"
                        value={formData.roomName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="courseId" className="form-label">Course</label>
                    <select
                        className="form-select"
                        id="courseId"
                        name="courseId"
                        value={formData.courseId} // Ensure courseId is set correctly
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select Course</option>
                        {courses.map(course => (
                            <option key={course.courseId} value={course.courseId}>
                                {course.courseName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="meetingTime" className="form-label">Meeting Time</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        id="meetingTime"
                        name="meetingTime"
                        value={formData.meetingTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="meetingDay" className="form-label">Meeting Day (Auto-set)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="meetingDay"
                        name="meetingDay"
                        value={formData.meetingDay}
                        readOnly
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="tableType" className="form-label">Table Type</label>
                    <select
                        className="form-select"
                        id="tableType"
                        name="tableType"
                        value={formData.tableType}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select Table Type</option>
                        {tableTypes.map(type => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="shortDescription" className="form-label">Short Description</label>
                    <textarea
                        className="form-control"
                        id="shortDescription"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="longDescription" className="form-label">Long Description</label>
                    <textarea
                        className="form-control"
                        id="longDescription"
                        name="longDescription"
                        value={formData.longDescription}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn pluto-pink-btn" data-bs-dismiss="modal" aria-label="Close">Update</button>
            </form>
        </div>
    );
}
