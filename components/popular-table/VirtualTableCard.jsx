"use client"
import { addTableMember, fetchTableById, fetchTableDesilsByUserId, FetchTableMembersDetailsById, removeTableMember, updateTableLastTime } from '@/app/api/crud'
import { Avatar, AvatarGroup, Tooltip } from '@mui/material'
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import JoinATablePopup from '../JoinATablePopup';

export default function VirtualTableCard({ tableData = {}, tableMember = [], updateAllTableDetails }) {

    console.log('tableMembervirtual: ', tableMember)
    const { data: session, status } = useSession();
    const [tableMembersDetailsById, setTableMembersDetailsById] = useState(null);
    const [isTableMember, setIsTableMember] = useState(false);
    const [isTableActive, setIsTableActive] = useState(false);

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
        courseId,
        courseName,
        courseNumber,
        college,
        yearOfCourse,
        description1,
        description2,
        description3,
        description4,
        lastActive
    } = tableData;

    const getTableMembersDetailsById = async () => {
        try {
            const data = await FetchTableMembersDetailsById(roomId, session?.user?.token);
            setTableMembersDetailsById(data);
        } catch (error) {
            console.error("Error TableMembers Details:", error);
        }
    };

    const checkTableStatus = () => {
        if (!lastActive) return false;

        const lastActiveTime = new Date(lastActive).getTime();
        const currentTime = Date.now();
        const timeDifference = currentTime - lastActiveTime;

        // Set table as active if last activity was within 5 minutes
        const ACTIVE_THRESHOLD = 0.01 * 60 * 1000; // 5 minutes in milliseconds
        setIsTableActive(timeDifference <= ACTIVE_THRESHOLD);
    };

    // Effect for polling table status
    useEffect(() => {
        // Initial check
        checkTableStatus();

        // Set up polling interval
        const statusInterval = setInterval(() => {
            checkTableStatus();
        }, 30000); // Check every 30 seconds

        // Cleanup
        return () => clearInterval(statusInterval);
    }, [lastActive]); // Re-run when lastActive changes

    // Effect for member details
    useEffect(() => {
        getTableMembersDetailsById();
    }, [roomId]);

    // Effect for checking if current user is a member
    useEffect(() => {
        const member = tableMember?.find(
            (member) => member?.userID === session?.user?.id
        );
        setIsTableMember(Boolean(member));
    }, [tableMember, session?.user?.id]);

    const handleLeftTable = async (memberId, roomId) => {
        try {
            await removeTableMember(memberId, roomId, session?.user?.token);
            await getTableMembersDetailsById();
            updateAllTableDetails();
        } catch (error) {
            console.error("Error Leave From Table:", error);
        }
    };

    const GetTableDetailsByUserId = async () => {
        try {
            const data = await fetchTableById(roomId, session?.user?.token);
            const { lastActive } = data;
            console.log('data virtual:::::::', data);
        } catch (error) {
            console.error("Error fetching Table Details By ID:", error);
        }
    };


    useEffect(() => {
        // Map over tableMember to extract only the tableMemberDetails
        const details = tableMember.map(member => member.tableMemberDetails);
        setTableMembersDetailsById(details);
    }, [tableMember]);

    console.log('tableMembersDetailsById: ', tableMembersDetailsById)




    return (
        <>
            <div class="popular-table-card card h-100">
                <div class="card-body">
                    <div className="status">
                        <span className={`status-light ${isTableActive ? 'available ' : 'unavailable'} `}></span>
                        <span className='status-title text-capitalize'>{isTableActive ? 'Online ' : 'Offline'}</span>
                    </div>
                    <div className="card-img">
                        <button className="btn edit-btn picture" data-bs-toggle="modal" data-bs-target={`#editTableImage-${roomId}`} >
                            <i class="fa-solid fa-camera"></i>
                        </button>
                        <button className="btn edit-btn info" data-bs-toggle="modal" data-bs-target={`#editTable-${roomId}`} >
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>

                        <img src={!roomImg ? "/assets/images/table-default-img.png" : roomImg} alt="" className='img-fluid card-img-top' />
                        {/* <img src={"/assets/images/image-placeholder.jpg"} alt="" className='img-fluid card-img-top' /> */}
                    </div>
                    <div className="card-info">
                        <div className="title-wrapper ">
                            <h4 className="card-title table-name">{roomName}</h4>
                            {
                                session?.user?.token && <button className="btn btn-sm pluto-pink-btn join" data-bs-toggle="modal" data-bs-target={`#joinTable-${roomId}`}>Join +</button>
                            }

                        </div>
                        <p className="college-name">{college}</p>
                        <p className="description">{shortDescription}</p>
                    </div>
                    {
                        isTableMember && <div class="dropdown settings-dropdown">
                            <button class="btn settings" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa-solid fa-gear"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="javascript:void(0)" onClick={() => handleLeftTable(session?.user?.id, roomId)}>Leave</a></li>
                            </ul>
                        </div>
                    }

                </div>
                <div className="card-footer border-0">
                    <div className="avatar">
                        {/* <AvatarGroup max={4}>
                            {
                                tableMembersDetailsById && tableMembersDetailsById?.length > 0 && tableMembersDetailsById?.map((item) => {
                                    return (
                                        <Tooltip title={item?.firstName} placement="top-start" arrow>
                                            <Avatar alt={item?.firstName} src={item?.profilePicture} />
                                        </Tooltip>
                                    )
                                })
                            }                            
                        </AvatarGroup> */}


                        <AvatarGroup max={4}>
                            {tableMember && tableMember.length > 0 && tableMember.map((item) => {
                                // Access tableMemberDetails and courseSection for each item
                                const memberDetails = item?.tableMemberDetails;

                                // Create a Set to ensure unique course names
                                const uniqueCourses = new Set(item?.courseSection?.map(course => course.courseName));

                                // Join the unique course names
                                const courseInfo = Array.from(uniqueCourses).join(', ') || 'No courses available';

                                console.log('courseInfocourseInfo: ', courseInfo)

                                return (
                                    <Tooltip
                                        title={
                                            <>
                                                <strong>{memberDetails?.firstName} {memberDetails?.lastName}</strong><br />
                                                <span className='text-capitalize'>
                                                    {courseInfo}
                                                </span>
                                            </>
                                        }
                                        placement="top-start"
                                        arrow
                                    >
                                        <Avatar alt={memberDetails?.firstName} src={memberDetails?.profilePicture} />
                                    </Tooltip>
                                );
                            })}
                        </AvatarGroup>



                    </div>
                    <button className="btn invite-btn" data-bs-toggle="modal" data-bs-target={`#inviteFriendsModal-${roomId}`}>
                        + Invite Friends
                    </button>
                </div>
            </div>

            {/* <div class="modal fade join-table-modal" id="joinTable" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div>
                                    <h5 class="modal-title" id="exampleModalLabel">Welcome Back, {session?.user?.name}</h5>
                                    <p>Take a look your learning progress for today September 22, 2024</p>
                                </div>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <JoinATablePopup session={session} />
                            </div>
                        </div>
                    </div>
                </div> */}
        </>
    )
}
