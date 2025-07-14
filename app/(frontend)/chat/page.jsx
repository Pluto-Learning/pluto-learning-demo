"use client";

import {
  acceptedFriendListByMainId,
  fetchAllMessageBySenderIdReceiverId,
  postMessage,
  postMessageForGroup,
  fetchTableDesilsByUserId,
  fetchAllmessagesByGroupId,
} from "@/app/api/crud";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@liveblocks/client";
import { RoomProvider } from "@/utils/liveblocks.config";
import PersonalAiChat from "@/components/AiChat/PersonalAiChat";
import Loader from "@/components/Loader/Loader";
import HomeLayout from "@/layouts/homeLayout/HomeLayout";
import { timeAgo } from "@/utils/hepler";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
});

export default function ChatPage() {
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [chatWithAi, setChatWithAi] = useState(false);
  const [groupchat, setGroupChat] = useState(false);
  const [messageBySenderReceiver, setMessageBySenderReceiver] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [formData, setFormData] = useState({
    messageId: "",
    senderId: "",
    receiverId: "",
    msgContent: "",
    isAI: false,
  });
  const [formDataForGroup, setFormDataForGroup] = useState({
    groupId: "",
    messageId: "",
    senderId: "",
    msgContent: "",
    fileLink: "",
    isAI: false,
  });

  const PLUTO_AI_SYSTEM_INSTRUCTION = `You are PlutoAI-an AI-powered tutor assisting high school students enrolled in the Upward Bound Math & Science and Foreign Language program at The University of Texas at Arlington. You must help create supplementary course material like flashcards, quizzes, etc. Follow these guidelines strictly for every response:
Approach: Generally avoid providing direct answers for course problems EXCEPT foreign language questions, but help create lecture materials like examples and analogies for instructors. Instead, gently guide students toward discovering the answer themselves by:
  - Asking leading questions.
  - Providing hints or relevant concepts to explore.
  - Suggesting steps or resources that encourage critical thinking.
Tone:Friendly, concise, supportive and clear. Use simple language suitable for high school students.
Length:Keep responses brief, max 2 paras. Don't need to start with affirmation.`;

  console.log("formDataForGroup", formDataForGroup);

  const AI = {
    userID: "AI",
    firstName: "AI",
    lastName: "",
    userType: "AI",
    awsFileUrl: "/assets/images/avatar_ai.jpg",
  };

  // Handle session loading state
  useEffect(() => {
    setIsLoading(status === "loading");
  }, [status]);

  // Update senderId for forms when session is available
  useEffect(() => {
    if (session?.user?.id) {
      setFormData((prev) => ({
        ...prev,
        senderId: session.user.id,
      }));
      setFormDataForGroup((prev) => ({
        ...prev,
        senderId: session.user.id,
      }));
    }
  }, [session]);

  // Fetch accepted friends
  const getAcceptedFriends = async () => {
    try {
      if (!session?.user?.id) return;
      const data = await acceptedFriendListByMainId(
        session.user.id,
        session?.user?.token
      );
      const friendList = data?.friends ?? [];
      friendList.push(AI);
      setFriends(friendList);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  // Fetch groups
  const getGroups = async () => {
    try {
      if (!session?.user?.id) return;
      const data = await fetchTableDesilsByUserId(
        session.user.id,
        session?.user?.token
      );
      const uniqueGroups = [];
      const seenRoomIds = new Set();
      for (const group of data) {
        if (!seenRoomIds.has(group.table.roomId)) {
          seenRoomIds.add(group.table.roomId);
          uniqueGroups.push(group.table);
        }
      }
      setGroups(uniqueGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  console.log("shouldAutoScroll", shouldAutoScroll);

  // Fetch messages for direct chats
  const handleGetMessageBySenderReceiver = async (senderId, receiverId) => {
    if (!senderId || !receiverId) return;
    setChatWithAi(false);
    setGroupChat(false);
    try {
      const data = await fetchAllMessageBySenderIdReceiverId(
        senderId,
        receiverId,
        session?.user?.token
      );
      setMessageBySenderReceiver(data);
      setFormData((prev) => ({
        ...prev,
        receiverId,
        senderId,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Fetch messages for group chats
  const handleGetMessageByGroup = async (groupId) => {
    if (!groupId) return;
    setChatWithAi(false);
    setGroupChat(true);
    try {
      const data = await fetchAllmessagesByGroupId(
        groupId,
        session?.user?.token
      );
      setMessageBySenderReceiver(data);
      setFormDataForGroup((prev) => ({
        ...prev,
        groupId,
      }));
    } catch (error) {
      console.error("Error fetching group messages:", error);
    }
  };

  // Handle AI chat
  const handleGetMessageByAi = () => {
    setChatWithAi(true);
    setGroupChat(false);
    setMessageBySenderReceiver([]);
  };

  // Form handling for direct messages
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.msgContent.trim()) return;
    try {
      await postMessage(formData, session?.user?.token);
      await handleGetMessageBySenderReceiver(
        formData.senderId,
        formData.receiverId
      );
      setShouldAutoScroll(true);
      resetForm();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Form handling for group messages
  const handleChangeForGroupMsg = (e) => {
    const { name, value } = e.target;
    setFormDataForGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForGroup = async (e) => {
    e.preventDefault();
    if (!formDataForGroup?.msgContent.trim()) return;

    const input = formDataForGroup.msgContent.trim();
    const isAIQuery = input.startsWith('@');

    try {
      if (isAIQuery) {
        // Handle AI query
        const aiInput = input.slice(1).trim(); // Remove '@'
        if (!aiInput) return; // Ignore empty AI queries

        // Post user message to group chat
        const userMessage = {
          ...formDataForGroup,
          msgContent: input,
          isAI: false,
        };
        await postMessageForGroup(userMessage, session?.user?.token);
        await handleGetMessageByGroup(formDataForGroup.groupId);

        // Call AI API
        const requestBody = {
          messages: [
            { role: 'system', content: PLUTO_AI_SYSTEM_INSTRUCTION },
            { role: 'user', content: aiInput },
          ],
          max_tokens: 4000,
          temperature: 1,
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

        if (!response.ok) {
          throw new Error(`AI API request failed: ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let aiResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          aiResponse += decoder.decode(value, { stream: true });
        }

        aiResponse += decoder.decode();
        const parsedResponse = JSON.parse(aiResponse);
        const message = parsedResponse.choices[0].message.content.trim();

        const messageContent = cleanTextContent(message);


        // Post AI response to group chat
        const aiMessage = {
          ...formDataForGroup,
          msgContent: messageContent,
          isAI: true,
        };
        await postMessageForGroup(aiMessage, session?.user?.token);
        await handleGetMessageByGroup(formDataForGroup.groupId);
      } else {
        // Handle regular group message
        const regularMessage = {
          ...formDataForGroup,
          isAI: false,
        };
        await postMessageForGroup(regularMessage, session?.user?.token);
        await handleGetMessageByGroup(formDataForGroup.groupId);
      }
      setShouldAutoScroll(true);
      resetGroupForm();
    } catch (error) {
      console.error('Error sending group message:', error);
      // Post error message to group chat
      const errorMessage = {
        ...formDataForGroup,
        msgContent: `Error: ${error.message}`,
        isAI: false,
      };
      try {
        await postMessageForGroup(errorMessage, session?.user?.token);
        await handleGetMessageByGroup(formDataForGroup.groupId);
      } catch (postError) {
        console.error('Error posting error message:', postError);
      }
      setShouldAutoScroll(true);
      resetGroupForm();
    }
  };

  // Required cleanTextContent function for AI responses
  const cleanTextContent = (text) => {
    return text
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold markdown
      .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italic markdown
      .replace(/`{3}[\s\S]*?`{3}/g, '') // Remove code blocks
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/^\s*[-+*]\s+/gm, '') // Remove list markers
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
  };

  // Reset forms
  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      messageId: "",
      msgContent: "",
    }));
  };

  const resetGroupForm = () => {
    setFormDataForGroup((prev) => ({
      ...prev,
      messageId: "",
      msgContent: "",
      fileLink: "",
    }));
  };

  // Initialize data
  useEffect(() => {
    if (session?.user?.id) {
      getAcceptedFriends();
      getGroups();
    }
  }, [session]);

  // Poll for new messages
  useEffect(() => {
    if (session?.user?.id && receiver?.userID) {
      if (receiver.userType === "group") {
        handleGetMessageByGroup(receiver.userID);
        const intervalId = setInterval(() => {
          handleGetMessageByGroup(receiver.userID);
        }, 5000);
        return () => clearInterval(intervalId);
      } else if (receiver.userID !== "AI") {
        handleGetMessageBySenderReceiver(session.user.id, receiver.userID);
        const intervalId = setInterval(() => {
          handleGetMessageBySenderReceiver(session.user.id, receiver.userID);
        }, 5000);
        return () => clearInterval(intervalId);
      }
    }
  }, [session, receiver]);

  // Scroll to bottom of messages
  const lastMessageRef = useRef(null);
  const chatContainerRef = useRef(null);
  // useEffect(() => {
  //   if (!chatContainerRef.current || !lastMessageRef.current) return;
  //   const chatContainer = chatContainerRef.current;
  //   const isNearBottom =
  //     chatContainer.scrollHeight -
  //       chatContainer.scrollTop -
  //       chatContainer.clientHeight <
  //     300; // Threshold of 100 pixels

  //   if (shouldAutoScroll || isNearBottom) {
  //     lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  //     setShouldAutoScroll(false); // Reset after scrolling
  //     console.log("isNearBottom", isNearBottom);
  //   }
  // }, [messageBySenderReceiver, shouldAutoScroll]);

  if (isLoading || !session?.user?.id) return <Loader />;

  return (
    <HomeLayout>
      <RoomProvider client={client} id={session?.user?.id}>
        <main className="content chat-message">
          <div className="container-fluid">
            <div className="row g-3">
              <div className="col-12 col-lg-4 col-xl-3 col-xxl-3 border-right">
                <div className="card h-100 card-left">
                  <div className="card-header d-none">
                    <div className="px-4">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <input
                            type="text"
                            className="form-control my-3"
                            placeholder="Search..."
                          />
                        </div>
                        <button
                          className="btn d-none"
                          type="button"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvasExample"
                          aria-controls="offcanvasExample"
                        >
                          <i className="fa-solid fa-bars"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="card-body">
                    <div class="accordion" id="accordionExample">
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Tables
                          </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                          <div class="accordion-body">
                            <div className="people-list">
                              {groups?.map((group) => {
                                const { roomId, roomImg, roomName } = group;
                                return (
                                  <div
                                    className={`list-group-item list-group-item-action border-0 people ${receiver?.userID === roomId ? "active" : ""
                                      }`}
                                    key={roomId}
                                    onClick={() => {
                                      setGroupChat(true);
                                      setShouldAutoScroll(true);
                                      const newReceiver = {
                                        awsFileUrl: roomImg,
                                        firstName: roomName,
                                        lastName: "",
                                        userID: roomId,
                                        userType: "group",
                                      };
                                      setReceiver(newReceiver);
                                      handleGetMessageByGroup(roomId);
                                    }}
                                  >
                                    <div className="d-flex align-items-center">
                                      <div className="people-img position-relative">
                                        <img
                                          src={roomImg ? roomImg : "/assets/images/image-placeholder-1.png"}
                                          className="rounded-circle mr-1 border border-1 "
                                          // alt={roomName}
                                          width="40"
                                          height="40"
                                        />
                                        <div className="small d-lg-none">
                                          <span className="fas fa-circle chat-online"></span>
                                        </div>
                                      </div>
                                      <div className="flex-grow-1 ms-3 people-info">
                                        <h6 className="people-name mb-0 text-capitalize">
                                          {roomName}
                                        </h6>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Direct Message
                          </button>
                        </h2>
                        <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                          <div class="accordion-body">
                            <div className="people-list">
                              {friends?.map((friend) => {
                                const { userID, firstName, lastName, awsFileUrl } =
                                  friend;
                                return (
                                  <div
                                    className={`list-group-item list-group-item-action border-0 people ${receiver?.userID === userID ? "active" : ""
                                      }`}
                                    key={userID}
                                    onClick={() => {
                                      setGroupChat(false);
                                      setShouldAutoScroll(true);
                                      setReceiver(friend);
                                      if (friend.userID === "AI") {
                                        handleGetMessageByAi();
                                      } else {
                                        handleGetMessageBySenderReceiver(
                                          session?.user?.id,
                                          userID
                                        );
                                      }
                                    }}
                                  >
                                    <div className="d-flex align-items-center">
                                      <div className="people-img position-relative">
                                        <img
                                          src={awsFileUrl ? awsFileUrl : "/assets/images/profile.png"}
                                          className="rounded-circle mr-1"
                                          alt={`${firstName} ${lastName}`}
                                          width="40"
                                          height="40"
                                        />
                                        <div className="small d-lg-none">
                                          <span className="fas fa-circle chat-online"></span>
                                        </div>
                                      </div>
                                      <div className="flex-grow-1 ms-3 people-info">
                                        <h6 className="people-name mb-0 text-capitalize">
                                          {firstName} {lastName}
                                        </h6>
                                        <div className="small">
                                          <span className="fas fa-circle chat-online"></span>{" "}
                                          Online
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-8 col-xl-9 col-xxl-9">
                <div className="card h-100 card-center">
                  {messageBySenderReceiver && receiver && (
                    <div className="card-header">
                      <div className="py-2 px-4">
                        <div className="d-flex align-items-center py-1">
                          <div className="position-relative">
                            <img
                              src={receiver.awsFileUrl}
                              className="rounded-circle mr-1"
                              alt={receiver.firstName}
                              width="40"
                              height="40"
                            />
                          </div>
                          <div className="flex-grow-1 ps-3 text-capitalize">
                            <strong>
                              {receiver.userType === "group"
                                ? receiver.firstName
                                : `${receiver.firstName} ${receiver.lastName}`}
                            </strong>
                            {!groupchat && (
                              <div className="small">
                                <span className="fas fa-circle chat-online"></span>{" "}
                                Online
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {chatWithAi ? (
                    <PersonalAiChat
                      roomId={session?.user?.id}
                      userImage={session?.user?.profilePictureAWSlink}
                    />
                  ) : (
                    <div className="card-body">
                      <div className="position-relative chat-messages-wrapper">
                        <div className="chat-messages p-4" ref={chatContainerRef}>
                          {messageBySenderReceiver ? (
                            messageBySenderReceiver.map((message, index) => {
                              const {
                                messageId,
                                senderId,
                                msgContent,
                                awsFileUrl, // Sender or group avatar
                                isAI,
                                createDate,
                              } = message;
                              const isSender = senderId === session?.user?.id;
                              const chatPosition = isAI ? "chat-message-left" : isSender ? "chat-message-right" : "chat-message-left";
                              return (
                                <div
                                  key={messageId}
                                  ref={
                                    index === messageBySenderReceiver.length - 1
                                      ? lastMessageRef
                                      : null
                                  }
                                  className={`${chatPosition} pb-4`}
                                >
                                  <div>
                                    <img
                                      src={
                                        isAI
                                          ? AI.awsFileUrl // AI avatar for AI messages
                                          : groupchat
                                            ? awsFileUrl || receiver?.awsFileUrl // Sender or group avatar
                                            : isSender
                                              ? awsFileUrl ||
                                              session?.user?.profilePictureAWSlink // Current user
                                              : awsFileUrl || receiver?.awsFileUrl // Other user
                                      }
                                      className="rounded-circle mr-1"
                                      alt="Profile"
                                      width="40"
                                      height="40"
                                    />
                                    <div className="text-muted small text-nowrap mt-2">
                                      {timeAgo(createDate)}
                                    </div>
                                  </div>
                                  <div className="flex-shrink-1 ms-2 me-3 message">
                                    <div className="fw-bold mb-1">
                                      {isAI
                                        ? "AI Assistant"
                                        : isSender
                                          ? "You"
                                          : senderId}
                                    </div>
                                    <p className="text-muted">
                                    </p>
                                      {msgContent}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="start-chatting text-center">
                              <div className="content">
                                <img
                                  src="/assets/images/pluto-profile-logo.svg"
                                  alt=""
                                  className="img-fluid"
                                />
                                <h5 className="text-muted">
                                  Click Left to start chatting
                                </h5>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {messageBySenderReceiver && (
                        <div className="flex-grow-0 py-3 px-4">
                          <form
                            onSubmit={
                              groupchat ? handleSubmitForGroup : handleSubmit
                            }
                          >
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder={groupchat ? "Use @ to ask AI" : "Type your message"}
                                name="msgContent"
                                onChange={
                                  groupchat
                                    ? handleChangeForGroupMsg
                                    : handleChange
                                }
                                value={
                                  groupchat
                                    ? formDataForGroup.msgContent || ""
                                    : formData.msgContent || ""
                                }
                              />
                              <button className="btn btn-primary" type="submit">
                                Send
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </RoomProvider>
    </HomeLayout>
  );
}
