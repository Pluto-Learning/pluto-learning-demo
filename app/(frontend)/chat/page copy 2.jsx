"use client"
import { acceptedFriendListByMainId, fetchAllMessageBySenderIdReceiverId, postMessage } from '@/app/api/crud'; 
import HomeLayout from '@/layouts/homeLayout/HomeLayout'; 
import ProfileLayout from '@/layouts/profileLayout/ProfileLayout'; 
import { timeAgo } from '@/utils/hepler'; 
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { createClient } from "@liveblocks/client";
import { RoomProvider } from '@/utils/liveblocks.config'; 
import PersonalAiChat from '@/components/AiChat/PersonalAiChat'; 
import Loader from '@/components/Loader/Loader';
const client = createClient({
    publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY
});

export default function page() {
    const { data: session } = useSession()
    const [friends, setFriends] = useState([]);
    const [chatWithAi, setChatWithAi] = useState(false);
    const AI = {
        userID: "AI",
        firstName: "AI",
        lastName: "",
        userType: "AI",
        awsFileUrl: "/assets/images/avatar_ai.jpg",
    };
    const [messageBySenderReceiver, setMessageBySenderReceiver] = useState(null);
    const [receiver, setReceiver] = useState(null)
    const [showAiSuggestion, setShowAiSuggestion] = useState(false);
    const [formData, setFormData] = useState({
        messageId: "",
        senderId: "",
        receiverId: "",
        msgContent: "",
        isAI: false,
    })

    console.log('receiver: ', receiver)
    console.log("session",session);

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

    console.log("formData", formData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        handlePostMessage()
        resetForm()
    };

    const getAcceptedFriends = async () => {
        try {
            const data = await acceptedFriendListByMainId(session?.user?.id, session?.user?.token);
            const friendList = data?.friends ?? [];
            friendList.push(AI);
            setFriends(data?.friends)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetAllMessage = async (mainPersonId, receiverId) => {
        console.log('ssss mainPersonId: ', mainPersonId)
        console.log('ssss receiverId: ', receiverId)
        setReceiver(receiverId)
    }

    const handleGetMessageBySenderReceiver = async (senderId, receiverId) => {
        setChatWithAi(false);
        try {
            const data = await fetchAllMessageBySenderIdReceiverId(senderId, receiverId, session?.user?.token);
            setMessageBySenderReceiver(data)
            setFormData((prev) => ({
                ...prev,
                receiverId: receiverId,
                senderId: senderId
            }));
            // setReceiver(receiverId)
        } catch (error) {
            console.log('Error Getting Message Sender and Receiver: ', error)
        }
    }

    const processMessageByAi = async (message) => {
        try {
            const requestBody = {
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: message }
                ],
                max_tokens: 1000,
                temperature: 0.7,
            };
            const headers = {
                'Content-Type': 'application/json',
                'api-key': process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY,
            };

            const response = await fetch(process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT, {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody),
            });

            if (!response.body) {
                throw new Error('No response body');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let aiResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                aiResponse += decoder.decode(value, { stream: true });
            }

            aiResponse += decoder.decode();
            const parsedResponse = JSON.parse(aiResponse);
            const messageContent = parsedResponse.choices[0].message.content.trim();
            const processedMessage = cleanTextContent(messageContent);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            const errorMessage = { text: `Error fetching AI response: ${error.message}`, sender: 'ai' };
        }
    }

    function cleanTextContent(text) {
        return text
            // Split into lines
            .split('\n')
            // Remove whitespace
            .map(line => line.trim())
            // Filter for numbered lines
            // .filter(line => /^\d+\./.test(line))
            // Clean up each line
            .map(line => {
                return line
                    .replace(/\*\*/g, '')
                    .replace(/\#\#/g, '')
                    .replace(/\#\#\#/g, '')
                    .replace(/\/+/g, '')
                    .replace(/\\+/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
            })
            // Join the array back into a string with line breaks
            .join('\n');
    }

    const handlePostMessage = async () => {

        try {
            await postMessage(formData, session?.user?.token)
            handleGetMessageBySenderReceiver(formData?.senderId, formData?.receiverId)
        } catch (error) {
            console.log('Error Sending Message: ', error)
        }

        // if (formData.msgContent.startsWith("@")) {
        //     let message = formData.msgContent.substring(1).trim();
        //     processMessageByAi(message);
        // }
        // else {
        //     try {
        //         await postMessage(formData, session?.user?.token)
        //         handleGetMessageBySenderReceiver(formData?.senderId, formData?.receiverId)
        //     } catch (error) {
        //         console.log('Error Sending Message: ', error)
        //     }
        // }

    }

    const resetForm = () => {
        setFormData({
            messageId: "",
            senderId: "",
            receiverId: "",
            msgContent: ""
        })
    }

    useEffect(() => {
        getAcceptedFriends()
        // handleGetMessageBySenderReceiver();
    }, [session]);

    useEffect(() => {
        if (session?.user?.id && receiver?.userID && receiver.userID !== "AI") {
            console.log("RRRR",receiver);
            handleGetMessageBySenderReceiver(session.user.id, receiver.userID);
            const intervalId = setInterval(() => {
                handleGetMessageBySenderReceiver(session.user.id, receiver.userID);
            }, 5000);
    
            return () => clearInterval(intervalId);
        }
    }, [session, receiver]);

    // useEffect(() => {
    //     // Define the interval ID
    //     const intervalId = setInterval(() => {
    //         handleGetMessageBySenderReceiver();
    //     }, 3000); // 3000ms = 3 seconds

    //     // Clear the interval on component unmount or session change
    //     return () => clearInterval(intervalId);
    // }, [session]); // Dependency array

    console.log('messageBySenderReceiver: ', messageBySenderReceiver)

    const lastMessageRef = useRef(null);

    const handleGetMessageByAi = () => {
        setChatWithAi(true);
        setMessageBySenderReceiver([]);

    }

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messageBySenderReceiver]);

    return session?.user?.id ? (
        <HomeLayout>
            <RoomProvider client={client} id={session?.user?.id}>
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

                                                                    {showAiSuggestion && (
                                                                        <div className="position-absolute bottom-100 start-0 bg-white border rounded p-2 mb-1 shadow-sm"
                                                                            style={{ zIndex: 1000, width: '200px' }}>
                                                                            <div className="suggestion-item d-flex align-items-center p-2 cursor-pointer hover-bg-light">
                                                                                <i className="fas fa-robot me-2"></i>
                                                                                <span>Ask AI</span>
                                                                            </div>
                                                                        </div>
                                                                    )}

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
            </RoomProvider>
        </HomeLayout>
    )
        :
        (
            <>
                <Loader />
            </>
        )
}
