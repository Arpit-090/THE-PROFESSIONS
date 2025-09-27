import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SameInterestUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/users/same-interests", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(Array.isArray(data.message) ? data.message : []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, [accessToken]);

  // 🔹 Handle Profile Button
  const handleProfile = (userId) => {
    navigate(`/profile/${userId}`); // will load profile page
  };

  // 🔹 Handle Message Button
  const handleMessage = async (userId) => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/users/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        credentials:"include",
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Unable to create/get chat");
      const chat = await res.json();
      console.log("Chat created:", chat);
      console.log("Chat created:", chat.message.chat._id);
      
      // redirect to chat page with chat._id
      navigate(`/chat/${chat.message.chat._id}`);
    } catch (err) {
      console.error("Chat error:", err.message);
    }
  };

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Users With Same Interests
      </h2>
      {users.length === 0 ? (
        <p className="text-gray-500 text-center">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Cover Image */}
              <div className="h-28 w-full bg-gray-200">
                <img
                  src={user.coverImage || "https://via.placeholder.com/400x150"}
                  alt="cover"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Avatar */}
              <div className="flex justify-center -mt-12">
                <img
                  src={user.avatar || "https://via.placeholder.com/100"}
                  alt={user.username}
                  className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md"
                />
              </div>

              {/* User Info */}
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold">{user.fullname}</h3>
                <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                <p className="text-sm text-gray-600 mb-3">{user.bio}</p>

                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Interests: </span>
                  {user.interests?.flat().join(", ") || "N/A"}
                </p>
                <p className="text-sm text-blue-600">
                  <span className="font-semibold">Common: </span>
                  {user.commonInterests?.flat().join(", ") || "None"}
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-3 mt-4">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    onClick={() => handleProfile(user._id)}
                  >
                    Profile
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                    onClick={() => handleMessage(user._id)}
                  >
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SameInterestUsers;
