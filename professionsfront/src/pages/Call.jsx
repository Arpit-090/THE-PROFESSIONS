import React, { useState, useContext } from "react";
import {emitCall} from "../socket/socketFrontControllers.js";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Call = () => {
  const [roomID, setroomID] = useState("");
  const [calling, setCalling] = useState(false); // 🔥 new state

  const { userId } = useParams();
  const { user } = useContext(AuthContext);

  const handleCall = (e) => {
    e.preventDefault();

    setCalling(true); // start loading

    const currentUser = user._id;
    const toCall = userId;

    emitCall(toCall, currentUser, roomID);

    //  replace later with real response
    setTimeout(() => {
      setCalling(false);
    }, 5000);
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col justify-between">

      {/* Video Section */}
      <div className="flex-1 flex items-center justify-center relative">
        
        <div className="w-[70%] h-[60%] bg-gray-700 rounded-xl flex items-center justify-center text-white text-lg">
          {calling ? "📞 Calling..." : "User Video"}
        </div>

        <div className="w-36 h-28 bg-gray-600 rounded-lg absolute bottom-5 right-5 flex items-center justify-center text-white text-sm">
          You
        </div>
      </div>

      {/* Controls */}
      <form onSubmit={handleCall}>
        <div className="flex gap-4 items-center justify-center pb-6">

          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomID}
            onChange={(e) => setroomID(e.target.value)}
            className="px-3 py-2 rounded bg-white text-black"
          />

          <button
            disabled={calling}
            className={`p-4 rounded-full text-xl text-white transition 
              ${calling ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"}`}
          >
            {calling ? "Calling..." : "Start Call 📞"}
          </button>

        </div>

        {/* Status */}
        {calling && (
          <p className="text-center text-gray-300 mb-4 animate-pulse">
            Connecting to user...
          </p>
        )}
      </form>
    </div>
  );
};

export default Call;