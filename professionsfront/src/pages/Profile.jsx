// src/pages/ProfilePage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { id } = useParams(); // userId from /profile/:id
  const { accessToken } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/v1/users/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUser(data.data || data.message || null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [id, accessToken]);

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!user) return <p className="text-gray-500 text-center">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Cover */}
      <div className="h-40 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={user.coverImage}
          alt="cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Avatar */}
      <div className="-mt-12 flex justify-center">
        <img
          src={user.avatar}
          alt={user.username}
          className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
        />
      </div>

      {/* Info */}
      <div className="text-center mt-4">
        <h2 className="text-2xl font-semibold">{user.fullname}</h2>
        <p className="text-gray-500">{user.username}</p>
        <p className="text-gray-600 mt-2">{user.bio}</p>
      </div>

      {/* Interests */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {user.interests?.flat().map((interest, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
