"use client"
import { acceptedFriendListByMainId, fetchAllMessageBySenderIdReceiverId, postMessage } from '../../api/crud'
import HomeLayout from '../../../layouts/homeLayout/HomeLayout'
import ProfileLayout from '../../../layouts/profileLayout/ProfileLayout'
import { timeAgo } from '../../../utils/hepler'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { createClient } from "@liveblocks/client";
import { RoomProvider } from '../../../utils/liveblocks.config'
import PersonalAiChat from '../../../components/AiChat/PersonalAiChat'
import Loader from '../../../components/Loader/Loader'

const client = createClient({
    publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY
});

export default function page() {
    const [isLoading, setIsLoading] = useState(true)
    const { data: session, status } = useSession()
    const [friends, setFriends] = useState([])
    const [chatWithAi, setChatWithAi] = useState(false)
    
    // Initialize states
    const [messageBySenderReceiver, setMessageBySenderReceiver] = useState(null)
    const [receiver, setReceiver] = useState(null)
    const [formData, setFormData] = useState({
        messageId: "",
        senderId: "",
        receiverId: "", 
        msgContent: "",
        isAI: false
    })

    const AI = {
        userID: "AI",
        firstName: "AI",
        lastName: "",
        userType: "AI", 
        awsFileUrl: "/assets/images/avatar_ai.jpg"
    }

    // Handle session loading state
    useEffect(() => {
        if (status === 'loading') {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [status])

    const handleGetMessageByAi = () => {
        setChatWithAi(true);
        setMessageBySenderReceiver([]);

    }

    // Data fetching with error handling
    const getAcceptedFriends = async () => {
        try {
            if (!session?.user?.id) return
            
            const data = await acceptedFriendListByMainId(session.user.id, session?.user?.token)
            const friendList = data?.friends ?? []
            // friendList.push(AI)
            setFriends(friendList)
        } catch (error) {
            console.error('Error fetching friends:', error)
        }
    }

    // Message handling
    const handleGetMessageBySenderReceiver = async (senderId, receiverId) => {
        if (!senderId || !receiverId) return
        
        setChatWithAi(false)
        try {
            const data = await fetchAllMessageBySenderIdReceiverId(senderId, receiverId, session?.user?.token)
            setMessageBySenderReceiver(data)
            setFormData(prev => ({
                ...prev,
                receiverId,
                senderId
            }))
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }

    // Form handling
    const handleSubmit = async (e) => {
        e.preventDefault()
        await handlePostMessage()
        resetForm()
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // if (value.startsWith('@')) {
        //     setShowAiSuggestion(true);
        // } else {
        //     setShowAiSuggestion(false);
        // }
    };

    const handlePostMessage = async () => {
        if (!formData.msgContent.trim()) return
        
        try {
            await postMessage(formData, session?.user?.token)
            await handleGetMessageBySenderReceiver(formData.senderId, formData.receiverId)
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    // Reset form
    const resetForm = () => {
        setFormData({
            messageId: "",
            senderId: "",
            receiverId: "",
            msgContent: ""
        })
    }

    // Initialize data
    useEffect(() => {
        if (session?.user?.id) {
            getAcceptedFriends()
        }
    }, [session])

    // Poll for new messages
    useEffect(() => {
        if (session?.user?.id && receiver?.userID && receiver.userID !== "AI") {
            handleGetMessageBySenderReceiver(session.user.id, receiver.userID)
            
            const intervalId = setInterval(() => {
                handleGetMessageBySenderReceiver(session.user.id, receiver.userID)
            }, 5000)

            return () => clearInterval(intervalId)
        }
    }, [session, receiver])

    // Scroll to bottom of messages
    const lastMessageRef = useRef(null)
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messageBySenderReceiver])

    // Loading state
    if (isLoading) return <Loader />

    // Auth check
    if (!session?.user?.id) return <Loader />

    return  (
        <HomeLayout>
            {/* <RoomProvider client={client} id={session?.user?.id}> */}
                <main class="content chat-message">
                    <div class="container-fluid">
                        <div class="row g-3">
                            <div class="col-12 col-lg-5 col-xl-2 border-right">
                                <div className="card h-100 card-left">
                                    <div className="card-header">
                                        <div class="px-4">
                                            <div class="d-flex align-items-center">
                                                <div class="flex-grow-1">
                                                    <input type="text" class="form-control my-3" placeholder="Search..." />
                                                </div>
                                                <button class="btn d-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                                                    <i class="fa-solid fa-bars"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div class="people-list">
                                            {
                                                friends?.map((friend) => {
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
                                                    } = friend;
                                                    return (
                                                        <div
                                                            className={`list-group-item list-group-item-action border-0 people ${receiver?.userID === userID ? 'active' : ''}`}
                                                            key={userID}
                                                            onClick={() => {
                                                                setReceiver(friend);
                                                                if (friend.userID === "AI") {
                                                                    handleGetMessageByAi();
                                                                } else {
                                                                    handleGetMessageBySenderReceiver(session?.user?.id, userID);
                                                                }
                                                            }}
                                                        >
                                                            <div class="d-flex align-items-start ">
                                                                <div className="people-img position-relative">
                                                                    <img src={awsFileUrl} class="rounded-circle mr-1" alt={firstName + lastName} width="40" height="40" />
                                                                    <div class="small d-lg-none">
                                                                        <span class="fas fa-circle chat-online"></span>
                                                                    </div>
                                                                </div>
                                                                <div class="flex-grow-1 ms-3 people-info">
                                                                    <h6 className="people-name mb-0 text-capitalize">
                                                                        {firstName + ' ' + lastName}
                                                                    </h6>
                                                                    <div class="small">
                                                                        <span class="fas fa-circle chat-online"></span> Online
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-lg-7 col-xl-10">
                                <div className="card h-100 card-center">
                                    {
                                        messageBySenderReceiver &&
                                        <div className="card-header">
                                            <div class="py-2 px-4 ">
                                                <div class="d-flex align-items-center py-1">
                                                    <div class="position-relative">
                                                        <img src={receiver?.awsFileUrl}
                                                            class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40" />
                                                    </div>
                                                    <div class="flex-grow-1 ps-3 text-capitalize">
                                                        <strong>{receiver?.firstName + ' ' + receiver?.lastName}</strong>
                                                        <div class="small">
                                                            <span class="fas fa-circle chat-online"></span> Online
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {
                                        chatWithAi ? (
                                            <PersonalAiChat  roomId={session?.user?.id} userImage={session?.user?.profilePictureAWSlink} />
                                        )
                                            :
                                            (
                                                <div className="card-body">
                                                    <div class="position-relative chat-messages-wrapper">
                                                        <div class="chat-messages p-4">

                                                            {messageBySenderReceiver ?
                                                                messageBySenderReceiver.map((message, index) => {
                                                                    const {
                                                                        messageId,
                                                                        senderId,
                                                                        msgContent,
                                                                        awsFileUrlSender,
                                                                        receiverAwsFileUrl,
                                                                        createDate
                                                                    } = message;

                                                                    const isSender = senderId === session?.user?.id;
                                                                    const chatPosition = isSender ? "chat-message-right" : "chat-message-left";

                                                                    return (
                                                                        <div
                                                                            key={messageId}
                                                                            ref={index === messageBySenderReceiver.length - 1 ? lastMessageRef : null}
                                                                            className={`${chatPosition} pb-4`}
                                                                        >
                                                                            <div>
                                                                                <img
                                                                                    // src={isSender ? awsFileUrlSender : receiverAwsFileUrl}
                                                                                    src={senderId === !session?.user?.id ? receiverAwsFileUrl : awsFileUrlSender}
                                                                                    className="rounded-circle mr-1"
                                                                                    alt="Profile"
                                                                                    width="40"
                                                                                    height="40"
                                                                                />
                                                                                <div className="text-muted small text-nowrap mt-2">
                                                                                    {timeAgo(createDate)}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex-shrink-1 bg-light me-3 message">
                                                                                <div className="font-weight-bold mb-1">
                                                                                    {isSender ? "You" : senderId}
                                                                                </div>
                                                                                {msgContent}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }) :
                                                                <>
                                                                    <div className='start-chatting text-center'>
                                                                        <div className="content">
                                                                            <img src="/assets/images/pluto-profile-logo.svg" alt="" className='img-fluid' />
                                                                            <h5 className='text-muted'>Click Left to start chatting</h5>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            }

                                                        </div>
                                                    </div>
                                                    {
                                                        messageBySenderReceiver && <div class="flex-grow-0 py-3 px-4">
                                                            <form onSubmit={handleSubmit}>
                                                                <div class="input-group">
                                                                    <input type="text" class="form-control" placeholder="Type your message" name='msgContent' onChange={handleChange} value={formData?.msgContent} />
                                                                    <button class="btn btn-primary" type='submit'>Send</button>

                                                                </div>
                                                            </form>
                                                        </div>
                                                    }

                                                </div>
                                            )
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            {/* </RoomProvider> */}
        </HomeLayout>
    )
}