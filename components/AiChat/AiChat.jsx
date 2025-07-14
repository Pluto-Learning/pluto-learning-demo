import { useState, useRef, useEffect } from 'react';
import {
  fetchAllmessagesByGroupIdForChatWithAi,
  postMessageForGroupAI
} from "@/app/api/crud";
import { AtSign, X, MessageSquare, Upload, FileText, Check, X as XMark, SendHorizontal } from 'lucide-react';
import { useStorage, useMutation } from '../../utils/liveblocks.config';
import { useSession } from "next-auth/react";
import { createShapeId, toRichText } from '@tldraw/tldraw';
import { Rnd } from 'react-rnd';
import mammoth from 'mammoth';
import { fetchTableById } from '@/app/api/crud';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.mjs';
import { Tooltip } from '@mui/material';

export default function AiChat({ editor, roomId }) {
  // const messages = useStorage((root) => root.messages ?? []);
   const { data: session, status } = useSession();
   const [messages, setMessages] = useState([]);
   const [message, setMessage] = useState({
     messageExternalId: "",
     roomId: roomId,
     senderId: "",
     receiverId: "",
     msgContent: "",
     fileLink: "",
     readStatus: ""
   });

  const [tableName, setTableName] = useState("");
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [pendingResponse, setPendingResponse] = useState(null);
  const [lastPosition, setLastPosition] = useState({ x: 100, y: 100 });
  const [rnd, setRnd] = useState({ width: 900, height: 900, x: 0, y: 0 });
  const [currentContext, setCurrentContext] = useState("");
  const [predefinedPrompts, setpredefinedPrompts] = useState([]);

  console.log("pendingResponse", pendingResponse);

  // PlutoAI System Instruction
  const PLUTO_AI_SYSTEM_INSTRUCTION = `You are PlutoAI-an AI-powered tutor assisting high school students enrolled in the Upward Bound Math & Science and Foreign Language program at The University of Texas at Arlington. You must help create supplementary course material like flashcards, quizzes, etc. Follow these guidelines strictly for every response:
Approach: Generally avoid providing direct answers for course problems EXCEPT foreign language questions, but help create lecture materials like examples and analogies for instructors. Instead, gently guide students toward discovering the answer themselves by:
  - Asking leading questions.
  - Providing hints or relevant concepts to explore.
  - Suggesting steps or resources that encourage critical thinking.
Tone:Friendly, concise, supportive and clear. Use simple language suitable for high school students.
Length:Keep responses brief, max 2 paras. Don't need to start with affirmation.`;

  // Auto-scroll function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
    } else if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!roomId || !session?.user?.token) {
      return; // Exit early if roomId or token is missing
    }
    handleGetMessageByGroupForAi(roomId);
  }, [roomId, session?.user?.token]);


  const handleGetMessageByGroupForAi = async () => {
    try {
      const data = await fetchAllmessagesByGroupIdForChatWithAi(
        roomId,
        session?.user?.token
      );
      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching group messages:", error);
    }
  };

  // Auto-scroll effect when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  // Auto-scroll when chat opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getTableDetails = async () => {
    try {
      const { roomName } = await fetchTableById(roomId, session?.user?.token);
      setTableName(roomName);
    } catch (error) {
      console.error("Error Update Table Last Active:", error);
    }
  };

  const getPredefinedPrompt = async (message = "") => {
    let content;
    if (message !== "" && message !== "Add More" && message !== "Summarize the following document:") {
      content = `Please give an array of three elements on questions related with "${message}" this question for the students who are completing their graduation`
    }
    else if (message == "Add More") {
      content = `Please give an array of three elements on questions related with "${currentContext}"`
    }
    else if (message == "Summarize the following document:") {
      content = `Please give an array of three elements on questions related with "${currentContext}"`
    }
    else {
      content = `Please give an array of three elements on fundamental questions on "${tableName}" for the students who are completing their graduation`
    }

    try {
      const requestBody = {
        messages: [
          { role: 'system', content: PLUTO_AI_SYSTEM_INSTRUCTION },
          { role: 'user', content: content }
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

      const questions = messageContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => /^\d+\.\s/.test(line))
        .map(line => line.replace(/^\d+\.\s*/, ''))
        .map(line => line.replace(/\*\*/g, ''));

      // questions.push("Summarize the following document:");

      // if (message !== "") {
      //   questions.unshift("Add More");
      // }

      setpredefinedPrompts(questions);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  }

  console.log("predefinedprompts", predefinedPrompts);

  useEffect(() => {
    if (tableName) {
      getPredefinedPrompt();
    }
  }, [tableName]);

  useEffect(() => {
    getTableDetails();
  }, []);

  const setPosition = (e, { x, y }) => {
    setRnd(prev => ({ ...prev, x, y }));
  };

  const setSize = (e, direction, ref, delta, position) => {
    setRnd(prev => ({
      ...prev,
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10) - 700,
      ...position,
    }));
  };

  // const addMessage = useMutation(({ storage }, message) => {
  //   const currentMessages = storage.get('messages') ?? [];
  //   storage.set('messages', [...currentMessages, message]);
  // }, []);


  const addMessage = async(message)=>{
    try {
      const data = await postMessageForGroupAI(message, session?.user?.token);
    } catch (error) {
      console.error("Error Update Table Last Active:", error);
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      let fileContent = '';

      // Determine file type and extract text content
      switch (file.type) {
        case 'application/pdf':
          fileContent = await extractPdfText(file);
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          fileContent = await extractDocxText(file);
          break;
        default:
          // For other file types, use the existing text extraction
          fileContent = await readFileAsText(file);
          break;
      }

      const userMessage = {
        messageExternalId: Date.now().toString(),
        roomId: roomId,
        senderId: session?.user?.id || "user",
        receiverId: "AI", // Assuming AI is the receiver for user messages
        msgContent: `Uploaded document: ${file.name}`,
        fileLink: "", // No file uploaded in this case
        readStatus: "unread",
      };

      // Add file upload message
      addMessage(userMessage);

      // Analyze document using Azure OpenAI with PlutoAI instruction
      const response = await fetch(process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: PLUTO_AI_SYSTEM_INSTRUCTION
            },
            {
              role: 'user',
              content: `Please analyze this document content: ${fileContent}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      const data = await response.json();
      const message = cleanTextContent(data.choices[0].message.content.trim());

      const aiMessage = {
        messageExternalId: Date.now().toString(), // Or use a UUID library
        roomId: roomId,
        senderId: "AI",
        receiverId: session?.user?.id || "user",
        msgContent: messageContent,
        fileLink: "",
        readStatus: "unread",
      };

      setCurrentContext(message);
      getPredefinedPrompt(message)

      // Add AI analysis response
      addMessage(aiMessage);

      // Reset to predefined prompt
      setSelectedPrompt('Summarize the following document:');
      setInput('');
      setShowPrompts(false);
      setPendingResponse(aiMessage);
      handleGetMessageByGroupForAi(roomId);

    } catch (error) {
      console.error('Error analyzing document:', error);
      const errorMessage = {
        messageExternalId: Date.now().toString(),
        roomId: roomId,
        senderId: "AI",
        receiverId: session?.user?.id || "user",
        msgContent: "Please Try Later. Facing Some Issue",
        fileLink: "",
        readStatus: "unread",
      };
      addMessage(errorMessage);
      setPendingResponse(false);
      setMessage((prev) => ({ ...prev, errorMessage }));
      handleGetMessageByGroupForAi(roomId);
    } finally {
      setIsUploading(false);
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const extractPdfText = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        try {
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const pageText = await page.getTextContent();
            text += pageText.items.map(item => item.str).join(' ');
          }
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const extractDocxText = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

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

  const handlePromptSelect = async (prompt) => {
    
    setSelectedPrompt(prompt);
    setInput("");
    setShowPrompts(false);
    getPredefinedPrompt(prompt);

    if (prompt !== "Summarize the following document:") {
      // Create user message
      const userMessage = {
        messageExternalId: Date.now().toString(),
        roomId: roomId,
        senderId: session?.user?.id || "user",
        receiverId: "AI",
        msgContent: prompt === "Add More" ? "Add More" : prompt, // Use appropriate message content
        fileLink: "",
        readStatus: "unread",
      };

      // Add user message
      addMessage(userMessage);
      setMessage((prev) => ({ ...prev, userMessage }));

      // Modify prompt for "Add More" case
      let processedPrompt = prompt;
      if (prompt === "Add More") {
        processedPrompt = `write something more maintaining the coherence with your previous response${currentContext} and don't repeat currentContext and write such a way that it is maintaining the flow`;
      }

      try {
        const requestBody = {
          messages: [
            { role: "system", content: PLUTO_AI_SYSTEM_INSTRUCTION },
            { role: "user", content: processedPrompt },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        };

        const headers = {
          "Content-Type": "application/json",
          "api-key": process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY,
        };

        const response = await fetch(
          process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT,
          {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.body) {
          throw new Error("No response body");
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
        const messageContent = cleanTextContent(
          parsedResponse.choices[0].message.content.trim()
        );

        setCurrentContext(messageContent);

        const aiMessage = {
          messageExternalId: Date.now().toString(), // Or use a UUID library
          roomId: roomId,
          senderId: "AI",
          receiverId: session?.user?.id || "user",
          msgContent: messageContent,
          fileLink: "",
          readStatus: "unread",
        };

        addMessage(aiMessage);
        setMessage((prev) => ({ ...prev, aiMessage }));
        setPendingResponse(aiMessage);
        handleGetMessageByGroupForAi(roomId);
      } catch (error) {
        console.error("Error fetching AI response:", error);
        const errorMessage = {
          messageExternalId: Date.now().toString(),
          roomId: roomId,
          senderId: "AI",
          receiverId: session?.user?.id || "user",
          msgContent: "Please Try Later. Facing Some Issue",
          fileLink: "",
          readStatus: "unread",
        };
        addMessage(errorMessage);
        setMessage((prev) => ({ ...prev, errorMessage }));
        handleGetMessageByGroupForAi(roomId);
        setPendingResponse(null);
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInput = input;

    if (userInput.trim()) {
      getPredefinedPrompt(userInput);
      const userMessage = {
        messageExternalId: Date.now().toString(),
        roomId: roomId,
        senderId: session?.user?.id || "user",
        receiverId: "AI", // Assuming AI is the receiver for user messages
        msgContent: userInput,
        fileLink: "", // No file uploaded in this case
        readStatus: "unread",
      };

      addMessage(userMessage);
      setMessage((prev) => ({ ...prev, userMessage })); 

      setInput('');
      setSelectedPrompt('');
      setShowPrompts(false);

      try {
        const requestBody = {
          messages: [
            { role: 'system', content: PLUTO_AI_SYSTEM_INSTRUCTION },
            { role: 'user', content: userInput }
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
        const messageContent = cleanTextContent(
          parsedResponse.choices[0].message.content.trim()
        );

        setCurrentContext(messageContent);

        const aiMessage = {
          messageExternalId: Date.now().toString(), // Or use a UUID library
          roomId: roomId,
          senderId: "AI",
          receiverId: session?.user?.id || "user",
          msgContent: messageContent,
          fileLink: "",
          readStatus: "unread",
        };

        addMessage(aiMessage);
        setMessage((prev) => ({ ...prev, aiMessage })); // Update local state for UI
        setPendingResponse(aiMessage);
        handleGetMessageByGroupForAi(roomId);

      } catch (error) {
        console.error('Error fetching AI response:', error);
        const errorMessage = {
          messageExternalId: Date.now().toString(),
          roomId: roomId,
          senderId: "AI",
          receiverId: session?.user?.id || "user",
          msgContent: "Please Try Later. Facing Some Issue",
          fileLink: "",
          readStatus: "unread",
        };
        addMessage(errorMessage);
        setMessage((prev) => ({ ...prev, errorMessage }));
        handleGetMessageByGroupForAi(roomId);
      }
    }
  };

  const addTextToCanvas = (text, appendToPrevious = false) => {
    if (!editor) return;
  
    // Get current viewport center
    const viewport = editor.getViewportPageBounds();
    const centerX = viewport.x + (viewport.width / 2);
    const centerY = viewport.y + (viewport.height / 2);
  
    const id = createShapeId();
    editor.createShape({
      id,
      type: 'text',
      x: centerX - 100, // Offset to center the text better
      y: centerY,
      props: {
        richText: toRichText(text),
        w: 600,
        size: 'm',
        autoSize: false,
      },
    });
  
    // Update offset for next text to avoid overlap
    setLastPosition(prev => ({
      ...prev,
      offsetY: (prev.offsetY || 0) + 100
    }));
  };

  const handleResponseAction = (accept) => {
    if (accept && pendingResponse) {
      addTextToCanvas(pendingResponse.msgContent, true);
    }
    setPendingResponse(null);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 ai-chat">
      {isOpen ? (
        <>
          <Rnd
            size={{ width: rnd.width, height: rnd.height }}
            position={{ x: rnd.x, y: rnd.y }}
            onDragStop={setPosition}
            onResizeStop={setSize}
          >
            <div
              className="bg-light rounded shadow w-100"
              style={{
                maxWidth: "800px",
                maxHeight: "800px",
                overflowY: "auto",
              }}
            >
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h2 className="h5 mb-0">Chat with PlutoAI</h2>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="btn btn-link text-dark p-0"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
  className="flex-grow-1 p-3"
  ref={messagesContainerRef}
  style={{
    overflowY: "auto",
    maxHeight: "300px",
    scrollBehavior: "smooth",
  }}
>
  {messages?.map((message, index) => (
    <div
      key={message.messageExternalId || index} // Use messageExternalId if available, fallback to index
      className={`d-flex mb-3 ${
        message.senderId !== "AI"
          ? "justify-content-end"
          : "justify-content-start"
      }`}
    >
      <div
        className={`p-2 rounded ${
          message.senderId !== "AI"
            ? "pluto__pink-bg text-white"
            : "bg-light"
        }`}
        style={{
          maxWidth: "100%",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {message.senderId === "AI" && (
          <div className="fw-bold mb-1 text-primary">PlutoAI</div>
        )}
        {message.msgContent}
        {pendingResponse &&
          pendingResponse.messageExternalId == message.messageExternalId && ( // Only show for matching messageExternalId
            <div className="mt-2 d-flex justify-content-end gap-2">
              <button
                onClick={() => handleResponseAction(true)}
                className="btn btn-success btn-sm"
                title="Accept and add to canvas"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => handleResponseAction(false)}
                className="btn btn-danger btn-sm"
                title="Reject"
              >
                <XMark size={16} />
              </button>
            </div>
          )}
      </div>
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>

              <div className="border-top p-3">
                {selectedPrompt === "Summarize the following document:" && (
                  <div className="mb-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                      disabled={isUploading}
                    >
                      <Upload className="me-2" size={16} />
                      {isUploading ? "Uploading..." : "Upload Document"}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".txt,.doc,.docx,.pdf"
                      className="d-none"
                    />
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      value={input}
                      onFocus={() => setShowPrompts(true)}
                      onBlur={() =>
                        setTimeout(() => setShowPrompts(false), 100)
                      }
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask PlutoAI anything"
                      className="form-control"
                      aria-label="Ask PlutoAI anything"
                    />
                    <button
                      type="submit"
                      className="btn btn-outline-secondary"
                      aria-label="Submit question"
                      disabled={isUploading}
                    >
                      <SendHorizontal className="w-6 h-6" />
                    </button>
                  </div>

                  {showPrompts && (
                    <div className="list-group">
                      {predefinedPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          type="button"
                          className="list-group-item list-group-item-action"
                          onMouseDown={() => handlePromptSelect(prompt)}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </Rnd>
        </>
      ) : (
        <>
          <Tooltip title={`PlutoAI Chat`} placement="top" arrow className="">
            <button
              onClick={() => setIsOpen(true)}
              className="btn ai_btn rounded-pill shadow"
              aria-label="Open PlutoAI chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 64 64"
              >
                <path d="M 26.222656 3.8691406 C 25.308656 3.8691406 24.394656 4.3789844 23.972656 5.3964844 L 21.697266 10.878906 C 19.732266 15.613906 16.068844 19.3935 11.464844 21.4375 L 5.4746094 24.097656 C 3.5086094 24.969656 3.5086094 27.828172 5.4746094 28.701172 L 11.658203 31.447266 C 16.146203 33.439266 19.745141 37.083109 21.744141 41.662109 L 23.990234 46.808594 C 24.530234 48.044844 25.802187 48.508281 26.890625 48.199219 C 27.543688 48.013781 28.131078 47.550344 28.455078 46.808594 L 30.701172 41.662109 C 32.700172 37.083109 36.298109 33.439266 40.787109 31.447266 L 46.970703 28.701172 C 47.462203 28.483172 47.830422 28.142672 48.076172 27.738281 C 48.199047 27.536086 48.292078 27.317299 48.353516 27.091797 C 48.414953 26.866295 48.445312 26.633672 48.445312 26.400391 C 48.445312 26.167109 48.414953 25.932564 48.353516 25.707031 C 48.169203 25.030432 47.707953 24.425031 46.970703 24.097656 L 40.980469 21.4375 C 36.376469 19.3935 32.713047 15.613906 30.748047 10.878906 L 28.472656 5.3964844 C 28.050656 4.3789844 27.136656 3.8691406 26.222656 3.8691406 z M 49.75 39.640625 C 49.26 39.640625 48.770922 39.913484 48.544922 40.458984 L 47.894531 42.023438 C 46.787531 44.693438 44.722953 46.825516 42.126953 47.978516 L 40.289062 48.794922 C 39.237062 49.261922 39.237063 50.791766 40.289062 51.259766 L 42.234375 52.125 C 44.765375 53.25 46.795875 55.304719 47.921875 57.886719 L 48.552734 59.335938 C 48.842109 59.998438 49.523857 60.245703 50.107422 60.080078 C 50.457561 59.980703 50.772062 59.733438 50.945312 59.335938 L 51.578125 57.886719 C 52.704125 55.304719 54.732672 53.25 57.263672 52.125 L 59.210938 51.259766 C 59.474187 51.143016 59.671109 50.960563 59.802734 50.744141 C 59.868547 50.63593 59.918266 50.519115 59.951172 50.398438 C 60.016984 50.157082 60.016984 49.899621 59.951172 49.658203 C 59.885359 49.416785 59.752125 49.190699 59.554688 49.015625 C 59.455969 48.928088 59.342562 48.853422 59.210938 48.794922 L 57.373047 47.978516 C 56.399547 47.545766 55.500857 46.975572 54.699219 46.291016 C 54.432006 46.06283 54.174469 45.823031 53.929688 45.570312 C 53.195344 44.812156 52.566889 43.945994 52.064453 42.998047 C 51.896975 42.682064 51.743844 42.357062 51.605469 42.023438 L 50.955078 40.458984 C 50.729078 39.913484 50.24 39.640625 49.75 39.640625 z"></path>
              </svg>
            </button>
          </Tooltip>
        </>
      )}
    </div>
  );
}

