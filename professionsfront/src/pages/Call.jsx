import React, { useState, useContext, useRef, useEffect } from "react";
import { emitCall,sendingOffer} from "../socket/socketFrontControllers.js";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { WebRtcContext } from "../webRTC/webRTCContext.jsx"
import { getSocket } from "../socket/socketConnect.js";


const Call = () => {
  const { user } = useContext(AuthContext);
  const { getLocalStream, createPeerConnection, addTracks,getPeerConnection } = useContext(WebRtcContext);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [roomID, setroomID] = useState("");
  const [calling, setCalling] = useState(false); // 🔥 new state
 const { userId } = useParams();
// creating local stream and make it alive
  useEffect(() => {
    const start = async () => {
      const stream = await getLocalStream()
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    }
    start();
  })
// get peer connection and manage remote stream keep track of response of remote user
  useEffect(() => {
    const pc=  createPeerConnection(user._id,(remoteStream)=>{
         if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
    });
    if(pc)
    addTracks()
  })

  // use effect for checking the offer has come and create a answer and start the video sharing

  useEffect(()=>{
    const socket = getSocket();
    socket.on('offer',async(data)=>{
      const pc = createPeerConnection();
      await pc.setRemoteDescription(data.offer);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      if(!answer) console.log("failed to create answer");
      

      socket.emit('answer',{answer,to:user._id})
      console.log("create answer and emitted to:",user._id);
    })

    socket.on('answer',async(data)=>{
      const pc =getPeerConnection();
      await pc.setRemoteDescription(data.answer);
      console.log("got the answer from user 1 also");
    })

    return ()=>{
      socket.off('offer');
      socket.off('answer');
    }
  })


  const handleCall = async(e) => {
    e.preventDefault();

    setCalling(true); // start loading

    const currentUser = user._id;
    const toCall = userId;
    emitCall(toCall, currentUser, roomID);
    
  const pc = getPeerConnection();
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
    sendingOffer(toCall,currentUser,offer);


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
          <video
            ref={localVideoRef}
            autoPlay
            muted
          ></video>
          {calling ? "📞 Calling..." : "User Video"}
        </div>

        <div className="w-36 h-28 bg-gray-600 rounded-lg absolute bottom-5 right-5 flex items-center justify-center text-white text-sm">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-full bg-black"
          />
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