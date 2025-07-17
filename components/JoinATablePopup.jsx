'use state'
import { addTableMember, updateTableLastTime } from '@/app/api/crud';
import { Rating } from '@mui/material'
import { useSession } from 'next-auth/react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
// import parse from 'html-react-parser';

export default function JoinATablePopup({ tableData = {} }) {

    const router = useRouter()
    const { data: session } = useSession();
    console.log('join table session', session)

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
        // status,
        courseId,
        courseName,
        courseNumber,
        college,
        yearOfCourse,
        description1,
        description2,
        description3,
        description4
    } = tableData;

    console.log('tableData: ', tableData)

    const [formData, setFormData] = useState({
        memberId: '',
        roomId: '',
        role: "student"
    });

    console.log('setFormDatasetFormData:', formData)

    useEffect(() => {
        setFormData({
            memberId: session?.user?.id,
            roomId: roomId,
            role: "student"
        })
    }, [tableData, session])

    const updateTableLastActive = async () => {
        try {
            await updateTableLastTime(roomId, session?.user?.token);
        } catch (error) {
            console.error("Error Update Table Last Active:", error);
        }
    }

    const handleJoinMember = async (e) => {
        try {
            if (!session || !session?.user?.token) {
                toast.error('User not authenticated.');
                return; // Prevent submission if not authenticated
            }
            await addTableMember(formData, session?.user?.token);
            toast.success("Successfully joined");
            // Navigate to the virtual table
            router.push(`/virtual-table/${roomId}`);
            updateTableLastActive()
        } catch (error) {
            console.error("Error Join Table:", error);
        }
    };


    return (
        <div className='join-table-popup-content'>
            <div className="card">
                <div className="card-body">
                    <div className="course-details">

                        <h5>{roomName}</h5>
                        <p>{shortDescription}</p>
                        {/* <div className="rating d-flex align-items-center">
                            <div>
                                <span>4.0</span>
                                <Rating name="size-small" defaultValue={2} size="small" />
                            </div>
                            <p className='mb-0'>1325 rating</p>
                        </div> */}
                        {/* <div className="course-info-wrapper ">
                            <div className="course-info-course-author">
                                <div className="course-info-course-author-img">
                                    <img src="" alt="" />
                                </div>
                                <p className="course-info-course-author-name">Nadia Mumtahena</p>
                            </div>
                            <div className="course-info-course-number">

                            </div>
                            <div className="course-info-course-duration"></div>
                        </div> */}

                        <div className="what-you-learn">
                            <div className="card">
                                <div className="card-body">
                                    <h5>Description</h5>
                                    {/* <h5>what you'll learn</h5> */}
{/* 
                                    <ul className=''>
                                        <li className='what-you-learn-text mb-2'>Solve Complex Problems: Learn how to analyze, design, and implement efficient solutions to real-world problems using computational approaches.</li>
                                        <li className='what-you-learn-text mb-2'>Understand Computer Systems: Gain deep knowledge of both software and hardware systems, including how they interact and are developed.</li>
                                        <li className='what-you-learn-text mb-2'>Artificial Intelligence & Machine Learning: Gain knowledge of AI principles, neural networks, and machine learning algorithms.</li>
                                    </ul> */}

                                    { longDescription ? <p className='what-you-learn-text'>{longDescription}</p> : <p className='what-you-learn-text'>No description found</p>}

                                    {/* <div className="row">
                                        <div className="col-md-6">
                                            <p className='what-you-learn-text'>Learn how to motivate and engage anyone by learning the psychology that underpins human behavior.</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className='what-you-learn-text'>Learn how to motivate and engage anyone by learning the psychology that underpins human behavior.</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className='what-you-learn-text'>Learn how to motivate and engage anyone by learning the psychology that underpins </p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className='what-you-learn-text'>Learn how to motivate and engage anyone by learning the psychology that underpins </p>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        <div className="btn-wrapper text-center">
                            {/* <a
                                href={`/virtual-table/${roomId}`}
                                target='_blank'
                                type='button'
                                className="btn pluto-deep-blue-btn"
                            >
                                Join
                            </a> */}
                            <button className="btn pluto-deep-blue-btn" onClick={handleJoinMember} data-bs-dismiss="modal" aria-label="Close">Join</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
