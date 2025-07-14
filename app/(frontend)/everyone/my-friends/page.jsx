"use client"
import { acceptedFriendListByMainId, addFriend, fetchNotifications, pendingFriendListByMainId, suggestedPersonListByMainId, updateFriendRequest } from '@/app/api/crud'
import InviteFriendsPopup from '@/components/InviteFriendsPopup'
import HomeLayout from '@/layouts/homeLayout/HomeLayout'
import ProfileLayout from '@/layouts/profileLayout/ProfileLayout'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function page() {

    const { data: session } = useSession()
    const [userData, setUserData] = useState({})
    const [pendingFriendList, setPendingFriendList] = useState([])
    const [acceptedFriendList, setAcceptedFriendList] = useState([])
    const [suggestedPersonList, setSuggestedPersonList] = useState([])
    const [sendRequet, setSendRequet] = useState(false)
    const [notification, setNotification] = useState([])

    const handlePendingFriendData = async () => {
        try {
            const data = await pendingFriendListByMainId(session?.user?.id, session?.user?.token)
            setPendingFriendList(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSuggestedPersonData = async () => {
        try {
            const data = await suggestedPersonListByMainId(session?.user?.id, session?.user?.token)
            setSuggestedPersonList(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdateFriendRequest = async (mainPersonId, friendId, status) => {
        // console.log(mainPersonId, friendId, status)
        try {
            await updateFriendRequest(mainPersonId, friendId, status, session?.user?.token)
            handlePendingFriendData()
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddFriend = async (data) => {
        // console.log(data)
        try {
            const a = await addFriend(data, session?.user?.token)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAcceptFriend = async () => {
        try {
            const data = await acceptedFriendListByMainId(session?.user?.id, session?.user?.token)
            setAcceptedFriendList(data)
        } catch (error) {
            console.log(error)
        }
    }

    const getNotifications = async () => {
        try {
            const data = await fetchNotifications(session?.user?.id, session?.user?.token)
            setNotification(data)
        } catch (error) {
            console.log('Error get notification ', error)
        }
    }

    useEffect(() => {
        handlePendingFriendData()
        handleSuggestedPersonData()
        handleAcceptFriend()
        getNotifications()
    }, [session])

    console.log("pendingFriendList: ", pendingFriendList)
    console.log("acceptedFriendList: ", acceptedFriendList)

    return (
        <HomeLayout>
            <div className='profile-content'>
                <div className="container">
                    <div className="invite-friends">
                        <div className="row g-4">
                            <div className="col-lg-9">
                                <div className="row g-4">
                                    <div className="col-12">
                                        <div className="friend-suggestion-top">
                                            <div className="left">
                                                <div className="user-info">
                                                    <h4 className="user-name text-capitalize">{acceptedFriendList?.mainPerson?.firstName} {acceptedFriendList?.mainPerson?.lastName}</h4>
                                                    <p className='user-follower'>{acceptedFriendList?.friends?.length} Following</p>
                                                </div>
                                            </div>
                                            <div className="right">
                                                <div className="serach-msg">
                                                    <div className="position-relative me-3 search">
                                                        <input type="text" className='form-control' placeholder='Search' />
                                                        {/* <i class="ri-search-2-line "></i> */}
                                                    </div>
                                                    <div className='message'>
                                                        <div className="notification-count">{notification?.unreadMessage}</div>
                                                        <Link type='button' href="/chat" className='msg-btn btn'>
                                                            <i class="ri-message-2-fill"></i>
                                                        </Link>
                                                    </div>
                                                    <div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    {
                                        acceptedFriendList?.friends?.length > 0 && <div className="col-12">
                                            <div className="card friend-request-card">
                                                <div className="card-body">
                                                    <div className="card-top d-flex justify-content-between align-items-center">
                                                        <h6>My Friends List</h6>
                                                        {/* <h6>
                                                            <Link href='everyone/sent-request'>View sent request</Link>
                                                        </h6> */}
                                                    </div>
                                                    <div className="friend-request-list">
                                                        <ul class="nav">
                                                            {
                                                                acceptedFriendList?.friends?.length > 0 && acceptedFriendList?.friends?.map((friends) => {
                                                                    const {
                                                                        userID,
                                                                        firstName,
                                                                        lastName,
                                                                        email,
                                                                        userType,
                                                                        gender,
                                                                        mobile,
                                                                        dateOfBirth,
                                                                        studentYear,
                                                                        status,
                                                                        profilePictureName,
                                                                        awsFileUrl,
                                                                        college
                                                                    } = friends;
                                                                    return (
                                                                        <li class="nav-item">
                                                                            <div className="friend-request">
                                                                                <div className="left">
                                                                                    <div className="friend-img">
                                                                                        <img src={awsFileUrl} alt="" className='img-fluid' />
                                                                                    </div>
                                                                                    <div className="friend-info">
                                                                                        <h6 className="friend-name text-capitalize">
                                                                                            <Link href=''>{firstName}{' '}{lastName}</Link>
                                                                                        </h6>
                                                                                        <div className='d-flex'>
                                                                                            <p className='mutual-friends'>163 mutual friends</p>
                                                                                            <p className='time'>25m ago</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {/* <div className="right">
                                                                                    <div class="d-flex justify-content-end btn-wrapper">
                                                                                        <button class="btn friend-request-btn dismiss shadow-0" type="button" onClick={() => handleUpdateFriendRequest(session?.user?.id, userID, 'Rejected')}>Dismiss</button>
                                                                                        <button class="btn friend-request-btn accept shadow-0" type="button" onClick={() => handleUpdateFriendRequest(session?.user?.id, userID, 'Accepted')}>Accept</button>

                                                                                    </div>
                                                                                </div> */}
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {
                                        suggestedPersonList?.friends?.length > 0 &&
                                        <div className="col-12 d-none">
                                            <div className="card friend-request-card suggest-people-card">
                                                <div className="card-body">
                                                    <div className="card-top d-flex justify-content-between align-items-center">
                                                        <h6>Suggestion People</h6>
                                                        {/* <h6>
                                                <Link to=''>View sent request</Link>
                                                </h6> */}
                                                    </div>
                                                    <div className="friend-request-list">
                                                        <ul class="nav">
                                                            {
                                                                suggestedPersonList?.friends?.length > 0 && suggestedPersonList?.friends?.map((person) => {
                                                                    const {
                                                                        userID,
                                                                        firstName,
                                                                        lastName,
                                                                        email,
                                                                        userType,
                                                                        gender,
                                                                        mobile,
                                                                        dateOfBirth,
                                                                        studentYear,
                                                                        status,
                                                                        profilePictureName,
                                                                        awsFileUrl,
                                                                        college
                                                                    } = person;
                                                                    return (
                                                                        <li class="nav-item">
                                                                            <div className="friend-request">
                                                                                <div className="left">
                                                                                    <div className="friend-img">
                                                                                        <img src={awsFileUrl} alt="" className='img-fluid' />
                                                                                    </div>
                                                                                    <div className="friend-info">
                                                                                        <h6 className="friend-name text-capitalize">
                                                                                            <Link href=''>{firstName} {lastName}</Link>
                                                                                        </h6>
                                                                                        <div className='d-flex'>
                                                                                            <p className='mutual-friends'>163 mutual friends</p>
                                                                                            <p className='time'>25m ago</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="right">
                                                                                    <div class="d-flex justify-content-end btn-wrapper">
                                                                                        {/* <button class="btn friend-request-btn dismiss shadow-0" type="button">Dismiss</button> */}
                                                                                        <button
                                                                                            class="btn friend-request-btn accept shadow-0"
                                                                                            type="button"
                                                                                            onClick={() => handleAddFriend({
                                                                                                mainPersonId: session?.user.id,
                                                                                                friendId: userID,
                                                                                                status: "Pending"
                                                                                            })}>Follow</button>


                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                })
                                                            }

                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }


                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="card friend-request-card suggest-people-card">
                                    <div className="card-body">
                                        <div className="search-group">
                                            <input type="text" className='form-control' placeholder='Search' />
                                        </div>
                                        <div className="group-join">
                                            <div className='group-join-lists'>
                                                <h6 className="group-join-title">Group Join</h6>
                                                <ul className="nav">
                                                    <li className="nav-item">
                                                        <div className="group">
                                                            <div className="group-img">
                                                                <img src={'/assets/images/friends-request.png'} alt="" className='img-fluid' />
                                                            </div>
                                                            <div className="group-text">
                                                                <h6 className="group-text-name">English Club</h6>
                                                                <div className="group-text-info">
                                                                    <p>398,098K members</p>
                                                                    <div className='dot'></div>
                                                                    <p>102,987K posts</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="nav-item">
                                                        <div className="group">
                                                            <div className="group-img">
                                                                <img src={'/assets/images/friends-request.png'} alt="" className='img-fluid' />
                                                            </div>
                                                            <div className="group-text">
                                                                <h6 className="group-text-name">English Club</h6>
                                                                <div className="group-text-info">
                                                                    <p>398,098K members</p>
                                                                    <div className='dot'></div>
                                                                    <p>102,987K posts</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="nav-item">
                                                        <div className="group">
                                                            <div className="group-img">
                                                                <img src={'/assets/images/friends-request.png'} alt="" className='img-fluid' />
                                                            </div>
                                                            <div className="group-text">
                                                                <h6 className="group-text-name">English Club</h6>
                                                                <div className="group-text-info">
                                                                    <p>398,098K members</p>
                                                                    <div className='dot'></div>
                                                                    <p>102,987K posts</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="nav-item">
                                                        <div className="group">
                                                            <div className="group-img">
                                                                <img src={'/assets/images/friends-request.png'} alt="" className='img-fluid' />
                                                            </div>
                                                            <div className="group-text">
                                                                <h6 className="group-text-name">English Club</h6>
                                                                <div className="group-text-info">
                                                                    <p>398,098K members</p>
                                                                    <div className='dot'></div>
                                                                    <p>102,987K posts</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className='popular-tables'>
                                                <h6 className="group-join-title">Popular Table</h6>
                                                <ul className="nav">
                                                    <li className="nav-item">
                                                        <div className="popular-table-single">
                                                            <div className="popular-table-single-text">
                                                                <h6 className="popular-table-single-text-name">English Club</h6>
                                                                <div className="popular-table-single-text-info">
                                                                    <p>398,098K members</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <button className="btn friend-request-btn dismiss shadow-0">Follow</button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="nav-item">
                                                        <div className="popular-table-single">
                                                            <div className="popular-table-single-text">
                                                                <h6 className="popular-table-single-text-name">English Club</h6>
                                                                <div className="popular-table-single-text-info">
                                                                    <p>398,098K members</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <button className="btn friend-request-btn dismiss shadow-0">Follow</button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="nav-item">
                                                        <div className="popular-table-single">
                                                            <div className="popular-table-single-text">
                                                                <h6 className="popular-table-single-text-name">English Club</h6>
                                                                <div className="popular-table-single-text-info">
                                                                    <p>398,098K members</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <button className="btn friend-request-btn dismiss shadow-0">Follow</button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
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
