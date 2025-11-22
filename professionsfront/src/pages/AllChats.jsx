// src/pages/AllChats.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // to get current user

const AllChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // assuming you store current user in context

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/users/all-chats", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch chats");

        const data = await res.json();
        setChats(data?.message?.chats || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading chats...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">All Chats</h2>
      <div className="space-y-4">
        {chats.map((chat) => {
          // find the "other user" (not me)
          const otherUser = chat.users.find((u) => u._id !== user._id);

          return (
            <div
              key={chat._id}
              onClick={() => navigate(`/chat/${chat._id}`)}
              className="flex items-center p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <img
                src={otherUser?.avatar}
                alt={otherUser?.fullname}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <p className="text-lg font-medium">{otherUser?.fullname}</p>
                {chat.latestMessage && (
                  <p className="text-sm text-gray-500 truncate w-40">
                    {chat.latestMessage.content}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllChats;
