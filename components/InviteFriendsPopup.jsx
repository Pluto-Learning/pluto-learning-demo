"use client"
import { acceptedFriendListByMainId, addTableMember, FetchTableMembersDetailsById, GetAcceptedFriendListByCourseIdMainPersonId } from '@/app/api/crud'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function InviteFriendsPopup({ tableData = {}, tableMember, updateAllTableDetails }) {
    const {
        roomId,
        roomName,
        courseId,
    } = tableData;

    const { data: session } = useSession()
    const [friendsWithSimilarCourse, setFriendsWithSimilarCourse] = useState([])

    const getFriendsWithSimilarCourse = async () => {
        try {
            const data = await GetAcceptedFriendListByCourseIdMainPersonId(session?.user?.id, courseId, session?.user?.token)
            setFriendsWithSimilarCourse(data?.friends)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getFriendsWithSimilarCourse()
    }, [session])

    const [addMemberData, setAddMemberData] = useState({
        memberId: "",
        roomId: roomId,
        role: "student"
    });

    const handlesetAddMemberData = (memberId) => {
        setAddMemberData((prevData) => ({
            ...prevData,
            memberId: memberId,
        }));
    };

    const handleInvitePeople = async () => {
        try {
            if (!session || !session?.user?.token) {
                toast.error('User not authenticated.');
                return;
            }
            await addTableMember(addMemberData, session?.user?.token);
            toast.success("Successfully Invited");
            updateAllTableDetails();
        } catch (error) {
            toast.error("Invitation Failed");
            console.error("Error Join Table:", error);
        }
    };

    useEffect(() => {
        if (addMemberData.memberId) {
            handleInvitePeople();
            getTableMembersByTableId();
        }
    }, [addMemberData]);

    const [tableMembersByRoomId, setTableMembersByRoomId] = useState()

    const getTableMembersByTableId = async () => {
        try {
            const data = await FetchTableMembersDetailsById(roomId, session?.user?.token)
            setTableMembersByRoomId(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTableMembersByTableId();
    }, []);

    // Function to retrieve courses for each friend based on userID

    // const getUserCourses = (userID) => {
    //     const userCourses = tableMember.find(
    //         (member) => member.tableMemberDetails.userID === userID
    //     )?.courseSection;

    //     return userCourses ? userCourses.map(course => course.courseName) : [];
    // };

    // Function to retrieve unique courses for each friend based on userID
    const getUserCourses = (userID) => {
        const userCourses = tableMember.find(
            (member) => member.tableMemberDetails.userID === userID
        )?.courseSection;

        if (userCourses) {
            // Remove duplicates by creating a Set and then converting it back to an array
            const uniqueCourses = [...new Set(userCourses.map(course => course.courseName))];
            return uniqueCourses;
        }
        return [];
    };


    return (
        <>
            <div className="card friend-request-card suggest-people-card">
                <div className="card-body">
                    {friendsWithSimilarCourse && friendsWithSimilarCourse.length > 0 && (
                        <div className="card-top d-flex justify-content-between align-items-center">
                            <h6>Suggestion People</h6>
                        </div>
                    )}

                    <div className="friend-request-list">
                        <ul className="nav">
                            {friendsWithSimilarCourse && friendsWithSimilarCourse.length > 0 ? (
                                friendsWithSimilarCourse.map((item) => {
                                    const {
                                        userID,
                                        firstName,
                                        lastName,
                                        awsFileUrl
                                    } = item;

                                    // Check if the current friend exists in the tableMember list
                                    const isInvited = tableMember.some(
                                        member => member.tableMemberDetails.userID === userID
                                    );
                                    const courses = getUserCourses(userID);

                                    return (
                                        <li className="nav-item" key={userID}>
                                            <div className="friend-request">
                                                <div className="left">
                                                    <div className="friend-img">
                                                        <img src={awsFileUrl} alt="" className="img-fluid" />
                                                    </div>
                                                    <div className="friend-info">
                                                        <h6 className="friend-name text-capitalize">
                                                            <Link href="">{`${firstName} ${lastName}`}</Link>
                                                        </h6>
                                                        <div className="d-flex">
                                                            <p className="mutual-friends text-capitalize">
                                                                {courses.length > 0 ? courses.join(', ') : "No courses listed"}
                                                            </p>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="right">
                                                    <div className="d-flex justify-content-end">
                                                        {isInvited ? (
                                                            <button
                                                                className="btn friend-request-btn accept shadow-0"
                                                                type="button"
                                                                disabled
                                                            >
                                                                Invited
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn friend-request-btn accept shadow-0"
                                                                type="button"
                                                                onClick={() => handlesetAddMemberData(userID)}
                                                            >
                                                                Invite
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <div className="d-flex justify-content-center w-100">
                                    <div className="card no-friends-found-card">
                                        <div className="card-body">
                                            <div className="content">
                                                <h1>No Friends found for this course</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
