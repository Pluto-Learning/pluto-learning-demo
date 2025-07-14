'use client'
import { fetchCourseInstructorSectionByInstructorId } from '@/app/api/crud';
import HomeLayout from '@/layouts/homeLayout/HomeLayout'
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton';

const page = () => {

    const { data: session } = useSession();
    const [scheduleData, setScheduleData] = useState([]);

    const getCourseInstructorSectionByInstructorId = async () => {
        try {
            const data = await fetchCourseInstructorSectionByInstructorId(session?.user?.id, session?.user?.token);
            setScheduleData(data);
        } catch (error) {
            console.error('Error fetching universities:', error);
        }
    }

    useEffect(() => {
        getCourseInstructorSectionByInstructorId();
    }, [session])


    console.log('data: ', scheduleData)

    return (
        <HomeLayout>
            <div className='schedule-page'>
                <div className="container">
                    <div className="schedule-content">
                        <div className="table-responsive">
                            <table className="table schedule-table">
                                <thead>
                                    <tr>
                                        <th>Instructor Name</th>
                                        <th>Course Name</th>
                                        <th>Section Name</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        scheduleData?.length < 1 ? (
                                            // Show 3 skeleton rows
                                            Array.from({ length: 4 }).map((_, i) => (
                                                <tr key={i}>
                                                    <td><Skeleton /></td>
                                                    <td><Skeleton /></td>
                                                    <td><Skeleton /></td>
                                                    <td><Skeleton /></td>
                                                    <td><Skeleton /></td>
                                                </tr>
                                            ))
                                        ) : (
                                            scheduleData.map((item, index) => (
                                                <tr key={index}>
                                                    <td className='text-capitalize'>{item.firstName} {item.lastName}</td>
                                                    <td className='text-capitalize'>{item.courseName}</td>
                                                    <td className='text-capitalize'>{item.sectionName}</td>
                                                    <td>{new Date(item.sectionStartTime).toLocaleString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    })}</td>
                                                    <td>{new Date(item.sectionEndTime).toLocaleString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    })}</td>
                                                </tr>
                                            ))
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default page