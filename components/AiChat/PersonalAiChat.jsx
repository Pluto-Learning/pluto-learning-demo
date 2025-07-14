import { useState, useRef, useEffect } from 'react';
import { AtSign, X, MessageSquare, Upload, FileText, Check, X as XMark, SendHorizontal } from 'lucide-react';
import { useStorage, useMutation } from '../../utils/liveblocks.config';
import mammoth from 'mammoth';
import { timeAgo } from '../../utils/hepler';
import { useSession } from 'next-auth/react'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.mjs';
export default function PersonalAiChat({ roomId, userImage }) {
  const { data: session } = useSession();
  const messages = useStorage((root) => root.messages ?? []);
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [pendingResponse, setPendingResponse] = useState(null);
  const [predefinedPrompts, setPredefinedPrompts] = useState([]);
  const [currentContext, setCurrentContext] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);

  const PLUTO_AI_SYSTEM_INSTRUCTION = `You are PlutoAI-an AI-powered tutor assisting high school students enrolled in the Upward Bound Math & Science and Foreign Language program at The University of Texas at Arlington. You must help create supplementary course material like flashcards, quizzes, etc. Follow these guidelines strictly for every response:
Approach: Generally avoid providing direct answers for course problems EXCEPT foreign language questions, but help create lecture materials like examples and analogies for instructors. Instead, gently guide students toward discovering the answer themselves by:
  - Asking leading questions.
  - Providing hints or relevant concepts to explore.
  - Suggesting steps or resources that encourage critical thinking.
Tone:Friendly, concise, supportive and clear. Use simple language suitable for high school students.
Length:Keep responses brief, max 2 paras. Don't need to start with affirmation.`;

  const addMessage = useMutation(({ storage }, message) => {
    const currentMessages = storage.get('messages') ?? [];
    storage.set('messages', [...currentMessages, message]);
  }, []);

  // File reading utilities
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
      .split('\n')
      .map(line => line.trim())
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
      .join('\n');
  }
  console.log("currentContext", currentContext);

  const handlePromptSelect = async (prompt) => {
    setSelectedPrompt(prompt);
    setInput("");
    setShowPrompts(false);

    let Message;
    switch (prompt) {
      case "Add More":
        Message = `write something more maintaining the coherence with your previous response${currentContext} and don't repeat currentContext and write such a way that it is maintaining the flow`;
        break;
      case "Summarize":
        Message = `Please provide a concise summary of: ${currentContext}`;
        break;
      case "Rephrase":
        Message = `Please rephrase this in a different way: ${currentContext}`;
        break;
      case "Bullet Points":
        Message = `Please convert this into bullet points highlighting the key information: ${currentContext}`;
        break;
      case "Explain simply":
        Message = `Please explain this in simple, easy-to-understand terms: ${currentContext}`;
        break;
      default:
        Message = `write a brief summary on the course: ${prompt}`;
        setCurrentContext("");
    }

    const userMessage = { text: prompt, sender: 'user' };
    addMessage(userMessage);

    try {
      const requestBody = {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: Message }
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
      const message = parsedResponse.choices[0].message.content.trim();

      const messageContent = cleanTextContent(message);
      setCurrentContext(messageContent);

      // Add "Add More" to the beginning of prompts if it's not already there
      setPredefinedPrompts((prev) => {
        const defaultPrompts = ["Add More", "Summarize", "Rephrase", "Bullet Points", "Explain simply"];

        // Filter out any default prompts that already exist in prev
        const newDefaultPrompts = defaultPrompts.filter(prompt => !prev.includes(prompt));

        // If there are any new default prompts to add, add them at the beginning
        if (newDefaultPrompts.length > 0) {
          return [...newDefaultPrompts, ...prev];
        }

        return prev;
      });

      const aiMessage = { text: messageContent, sender: 'ai' };
      addMessage(aiMessage);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage = { text: 'Please Try Later. Facing Some Issue', sender: 'ai' };
      addMessage(errorMessage);
    }
  };

  // File upload handler
  const handleFileUpload = async (event) => {
    debugger;
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Add upload started message

      let fileContent = '';

      // Extract text based on file type
      switch (file.type) {
        case 'application/pdf':
          fileContent = await extractPdfText(file);
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          fileContent = await extractDocxText(file);
          break;
        default:
          fileContent = await readFileAsText(file);
          break;
      }

      // Add file upload success message
      addMessage({
        text: `Successfully uploaded: ${file.name}`,
        sender: 'user',
        timestamp: new Date().toISOString(),
        fileType: file.type
      });

      // Process with Azure OpenAI
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
              content: 'You are a helpful assistant that analyzes documents. Please analyze the following document and provide a summary of its key points.'
            },
            {
              role: 'user',
              content: `Please analyze this document content: ${fileContent}`
            }
          ],
          max_tokens: 4000,
          temperature: 1
        })
      });

      const data = await response.json();
      const message = cleanTextContent(data.choices[0].message.content.trim());

      // Add AI analysis response
      const aiMessage = {
        text: message,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setPredefinedPrompts((prev) => {
        const defaultPrompts = ["Add More", "Summarize", "Rephrase", "Bullet Points", "Explain simply"];

        // Filter out any default prompts that already exist in prev
        const newDefaultPrompts = defaultPrompts.filter(prompt => !prev.includes(prompt));

        // If there are any new default prompts to add, add them at the beginning
        if (newDefaultPrompts.length > 0) {
          return [...newDefaultPrompts, ...prev];
        }

        return prev;
      });
      setCurrentContext(message);
      addMessage(aiMessage);
      setPendingResponse(aiMessage);

    } catch (error) {
      console.error('Error processing file:', error);
      addMessage({
        text: `Please Try Later.Facing Some Issue`, sender: 'ai',
        sender: 'system',
        timestamp: new Date().toISOString(),
        error: true
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, pendingResponse]);

  const handleSubmit = async (e) => {
    setShowPrompts(false);
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    addMessage(userMessage);
    setInput('');

    try {
      const requestBody = {
        messages: [
          { role: 'system', content: PLUTO_AI_SYSTEM_INSTRUCTION },
          { role: 'user', content: input }
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

      const data = await response.json();
      const message = cleanTextContent(data.choices[0].message.content.trim());
      setPredefinedPrompts((prev) => {
        const defaultPrompts = ["Add More", "Summarize", "Rephrase", "Bullet Points", "Explain simply"];

        // Filter out any default prompts that already exist in prev
        const newDefaultPrompts = defaultPrompts.filter(prompt => !prev.includes(prompt));

        // If there are any new default prompts to add, add them at the beginning
        if (newDefaultPrompts.length > 0) {
          return [...newDefaultPrompts, ...prev];
        }

        return prev;
      });
      setCurrentContext(message);
      const aiMessage = {
        text: message,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      addMessage(aiMessage);
      setPendingResponse(aiMessage);
    } catch (error) {
      console.error('Error:', error);
      addMessage({
        text: `Error: ${error.message}`,
        sender: 'system',
        timestamp: new Date().toISOString(),
        error: true
      });
    }
  };

  console.log("messages", messages);

  return (
    <div className="card-body">
      <div className="position-relative chat-messages-wrapper">
        <div className="chat-messages p-4">
          {messages?.map((message, index) => {
            const isUserMessage = message.sender === 'user';
            const isSystemMessage = message.sender === 'system';

            return (
              <div
                key={index}
                className={`chat-message-${isUserMessage ? 'right' : 'left'} pb-4`}
                ref={index === messages.length - 1 ? messagesEndRef : null}
              >
                <div>
                  <img
                    src={
                      isUserMessage
                        ? userImage
                        : isSystemMessage
                          ? "/assets/images/system-avatar.jpg"
                          : "/assets/images/avatar_ai.jpg"
                    }
                    className="rounded-circle mr-1"
                    alt={isUserMessage ? "You" : isSystemMessage ? "System" : "AI"}
                    width="40"
                    height="40"
                  />
                  <div className="text-muted small text-nowrap mt-2">
                    {message.timestamp ? timeAgo(message.timestamp) : 'Just now'}
                  </div>
                </div>
                <div className={`flex-shrink-1 bg-light me-3 message ${message.error ? 'text-danger' : ''}`} style={{
                  Width: '100%',
                  whiteSpace: 'pre-wrap',
                }}>
                  <div className="font-weight-bold mb-1"
                  >
                    {isUserMessage ? 'You' : isSystemMessage ? 'System' : 'Pluto AI Assistant'}
                  </div>
                  {message.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-grow-0 py-3 px-4 position-relative">
        {showPrompts && (
          <div className="list-group sgt__chat">
            {predefinedPrompts.map((prompt, index) => (
              <button
                key={index}
                type="button"
                className="list-group-item  list-group-item-action"
                onMouseDown={() => handlePromptSelect(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message"
              value={input}
              onFocus={() => setShowPrompts(true)}
              onBlur={() => setTimeout(() => setShowPrompts(false), 100)}
              onChange={(e) => {
                setInput(e.target.value);
                setShowPrompts(false);
              }}
            />
            <button
              className="btn btn-primary"
              type="submit"

            >
              Send
            </button>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              accept=".txt,.pdf,.doc,.docx"
            />
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : <Upload size={20} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
