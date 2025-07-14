"use client";

import {
  fetchAllmessagesByGroupId,
  postMessageForGroup,
  fetchTableDesilsByUserId,
} from "@/app/api/crud";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@liveblocks/client";
import { RoomProvider } from "@/utils/liveblocks.config";
import Loader from "@/components/Loader/Loader";
import HomeLayout from "@/layouts/homeLayout/HomeLayout";
import { timeAgo } from "@/utils/hepler";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
});

export default function GroupChat({ roomId, setShowGroupChat, showGroupChat }) {
  console.log("roomId:", roomId);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const [group, setGroup] = useState(null);
  const [groupchat, setGroupChat] = useState(true);
  const [messageBySenderReceiver, setMessageBySenderReceiver] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [formDataForGroup, setFormDataForGroup] = useState({
    groupId: roomId,
    messageId: "",
    senderId: "",
    msgContent: "",
    fileLink: "",
    isAI: false,
  });

  const AI = {
    userID: "AI",
    firstName: "AI",
    lastName: "",
    userType: "AI",
    awsFileUrl: "/assets/images/avatar_ai.jpg",
  };

  // PlutoAI System Instruction
  const PLUTO_AI_SYSTEM_INSTRUCTION = `You are PlutoAI-an AI-powered tutor assisting high school students enrolled in the Upward Bound Math & Science and Foreign Language program at The University of Texas at Arlington. You must help create supplementary course material like flashcards, quizzes, etc. Follow these guidelines strictly for every response:
Approach: Generally avoid providing direct answers for course problems EXCEPT foreign language questions, but help create lecture materials like examples and analogies for instructors. Instead, gently guide students toward discovering the answer themselves by:
  - Asking leading questions.
  - Providing hints or relevant concepts to explore.
  - Suggesting steps or resources that encourage critical thinking.
Tone:Friendly, concise, supportive and clear. Use simple language suitable for high school students.
Length:Keep responses brief, max 2 paras. Don't need to start with affirmation.`;

  // Scroll to bottom of messages
  const lastMessageRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    } else if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Auto-scroll effect when showGroupChat changes or new messages arrive
  useEffect(() => {
    if (showGroupChat && shouldAutoScroll) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showGroupChat, messageBySenderReceiver]);




  // Handle session loading state
  useEffect(() => {
    setIsLoading(status === "loading");
  }, [status]);

  // Update senderId for form when session is available
  useEffect(() => {
    if (session?.user?.id) {
      setFormDataForGroup((prev) => ({
        ...prev,
        senderId: session.user.id,
      }));
    }
  }, [session]);

  // Fetch the specific group by roomId
  const getGroup = async () => {
    try {
      if (!session?.user?.id || !roomId) return;
      const data = await fetchTableDesilsByUserId(
        session.user.id,
        session?.user?.token
      );
      // Find the group with the matching roomId
      const selectedGroup = data.find(
        (group) => group.table.roomId === roomId
      )?.table;
      if (selectedGroup) {
        setGroup(selectedGroup);
        setReceiver({
          awsFileUrl: selectedGroup.roomImg,
          firstName: selectedGroup.roomName,
          lastName: "",
          userID: selectedGroup.roomId,
          userType: "group",
        });
        handleGetMessageByGroup(selectedGroup.roomId);
      }
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  };

  // Fetch messages for group chat
  const handleGetMessageByGroup = async (groupId) => {
    if (!groupId) return;
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
    const isAIQuery = input.startsWith("@");

    try {
      if (isAIQuery) {
        // Handle AI query
        const aiInput = input.slice(1).trim();
        if (!aiInput) return;

        const userMessage = {
          ...formDataForGroup,
          msgContent: input,
          isAI: false,
        };
        await postMessageForGroup(userMessage, session?.user?.token);
        await handleGetMessageByGroup(formDataForGroup.groupId);

        const requestBody = {
          messages: [
            { role: "system", content: PLUTO_AI_SYSTEM_INSTRUCTION },
            { role: "user", content: aiInput },
          ],
          max_tokens: 4000,
          temperature: 1,
        };
        const headers = {
          "Content-Type": "application/json",
          "api-key": process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY,
        };

        const response = await fetch(
          process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT, // Fixed typo: was incorrectly using API_KEY as endpoint
          {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody),
          }
        );

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

        const aiMessage = {
          ...formDataForGroup,
          msgContent: messageContent,
          isAI: true,
        };
        await postMessageForGroup(aiMessage, session?.user?.token);
        await handleGetMessageByGroup(formDataForGroup.groupId);
      } else {
        const regularMessage = {
          ...formDataForGroup,
          isAI: false,
        };
        await postMessageForGroup(regularMessage, session?.user?.token);
        await handleGetMessageByGroup(formDataForGroup.groupId);
      }

      resetGroupForm();
    } catch (error) {
      console.error("Error sending group message:", error);
      const errorMessage = {
        ...formDataForGroup,
        msgContent: `Error: ${error.message}`,
        isAI: false,
      };
      try {
        await postMessageForGroup(errorMessage, session?.user?.token);
        await handleGetMessageByGroup(formDataForGroup.groupId);
      } catch (postError) {
        console.error("Error posting error message:", postError);
      }

      resetGroupForm();
    }
  };

  const cleanTextContent = (text) => {
    return text
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      .replace(/(\*|_)(.*?)\1/g, "$2")
      .replace(/`{3}[\s\S]*?`{3}/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/^\s*[-+*]\s+/gm, "")
      .replace(/\n+/g, " ")
      .trim();
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
      getGroup();
    }
  }, [session, roomId]);

  // Poll for new messages
  useEffect(() => {
    if (session?.user?.id && receiver?.userID) {
      handleGetMessageByGroup(receiver.userID);
      const intervalId = setInterval(() => {
        handleGetMessageByGroup(receiver.userID);
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [session, receiver]);

  if (isLoading || !session?.user?.id) return <Loader />;

  return (
    <RoomProvider client={client} id={session?.user?.id}>
      <main className="whiteboard-chat-message">
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
                    <strong>{receiver.firstName}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card-body">
            <div className="position-relative chat-messages-wrapper">
              <div
                className="chat-messages p-4"
                ref={chatContainerRef}
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  scrollBehavior: "smooth",
                }}
              >
                {messageBySenderReceiver ? (
                  messageBySenderReceiver.map((message, index) => {
                    const {
                      messageId,
                      senderId,
                      msgContent,
                      awsFileUrl,
                      isAI,
                      createDate,
                    } = message;
                    const isSender = senderId === session?.user?.id;
                    const chatPosition = isAI
                      ? "chat-message-left"
                      : isSender
                      ? "chat-message-right"
                      : "chat-message-left";
                    return (
                      <div key={messageId} className={`${chatPosition} pb-4`}>
                        <div>
                          <img
                            src={
                              isAI
                                ? AI.awsFileUrl
                                : awsFileUrl || receiver?.awsFileUrl
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
                            {isAI ? "PlutoAI" : isSender ? "You" : senderId}
                          </div>
                          <p className="text-muted"></p>
                          {cleanTextContent(msgContent)}
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
                      <h5 className="text-muted">Start chatting</h5>
                    </div>
                  </div>
                )}
                <div ref={lastMessageRef} /> {/* Empty div for scrolling */}
              </div>
            </div>
            {messageBySenderReceiver && (
              <div className="flex-grow-0 py-3 px-4 message-input-wrapper">
                <form onSubmit={handleSubmitForGroup}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Use @ to ask PlutoAI"
                      name="msgContent"
                      onChange={handleChangeForGroupMsg}
                      value={formDataForGroup.msgContent || ""}
                    />
                    <button className="btn submit-btn" type="submit">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </RoomProvider>
  );
}
