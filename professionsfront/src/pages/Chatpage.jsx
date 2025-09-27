// src/pages/ChatPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ChatPage = () => {
  const { chatId } = useParams(); // /chat/:chatId
  const { accessToken, user } = useContext(AuthContext); // assuming user has _id

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch all messages in this chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/v1/users/getMsg/${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to load messages");
        const data = await res.json();

        setMessages(data.message?.messages || []);
        console.log("Fetched messages:", data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchMessages();
  }, [chatId, accessToken]);

  // Send new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch("http://localhost:3000/api/v1/users/sendMsg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ content: newMessage, chatId }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      const data = await res.json();
      setMessages((prev) => [...prev, data.data]); // append new msg
      setNewMessage("");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 h-screen flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-center">Chat</h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 bg-gray-100 p-4 rounded-lg">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet.</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender?._id === user?._id;

            return (
              <div
                key={msg._id}
                className={`flex items-start gap-2 max-w-md ${
                  isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <img
                  src={msg.sender?.avatar}
                  alt={msg.sender?.username}
                  className="w-8 h-8 rounded-full object-cover"
                />

                {/* Message bubble */}
                <div
                  className={`p-3 rounded-lg ${
                    isMe ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                  }`}
                >
                  {!isMe && (
                    <p className="text-xs font-semibold mb-1">
                      {msg.sender?.username}
                    </p>
                  )}
                  <p  key={msg._id}>{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
