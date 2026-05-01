import React, { useState, useContext, useRef, useEffect } from "react";
import { emitCall, sendingOffer } from "../socket/socketFrontControllers.js";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { WebRtcContext } from "../webRTC/webRTCContext.jsx";
import { getSocket } from "../socket/socketConnect.js";

const Call = () => {
  const { user } = useContext(AuthContext);
  const {
    getLocalStream,
    createPeerConnection,
    addTracks,
    getPeerConnection,
    resetPeerConnection,
    remoteStream,        // ✅ get remote stream directly from context
  } = useContext(WebRtcContext);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [calling, setCalling] = useState(false);
  const [connected, setConnected] = useState(false);

  const { userId } = useParams();
  const navigate = useNavigate();

  // ── Local stream + PC setup ───────────────────────────────────────────────
  useEffect(() => {
    const start = async () => {
      const stream = await getLocalStream();
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Register ontrack — but we also rely on remoteStream from context
      // in case ontrack already fired before this component mounted (callee case)
      createPeerConnection(userId, (incomingStream) => {
        console.log("✅ ontrack fired in Call.jsx");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = incomingStream;
          setConnected(true);
        }
      });

      addTracks();
    };

    start();
  }, []);

  // ✅ KEY FIX: If remoteStream already exists in context when this component
  // mounts (callee case — ontrack fired before navigation), attach it directly
  // This solves the timing issue where ontrack fires before Call.jsx mounts
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      console.log("✅ Attaching already-available remote stream from context");
      remoteVideoRef.current.srcObject = remoteStream;
      setConnected(true);
    }
  }, [remoteStream]); // runs whenever remoteStream updates in context

  // ── Socket: answer + ICE ──────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();

    socket.on("answer", async (data) => {
      const pc = getPeerConnection();
      if (pc && pc.signalingState === "have-local-offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        console.log("✅ Answer set — call connected");
        setCalling(false);
        setConnected(true);
      }
    });

    socket.on("ice-condidate", async (data) => {
      const pc = getPeerConnection();
      if (pc && data.candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error("ICE error:", err);
        }
      }
    });

    return () => {
      socket.off("answer");
      socket.off("ice-condidate");
    };
  }, []);

  // ── Start call (caller only) ──────────────────────────────────────────────
  const handleCall = async () => {
    const pc = getPeerConnection();
    if (!pc) return;

    setCalling(true);
    emitCall(userId, user._id);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    sendingOffer(userId, user._id, offer);

    console.log("📞 Offer sent to:", userId);
  };

  // ── End call ──────────────────────────────────────────────────────────────
  const handleEndCall = () => {
    // Stop all local tracks so camera/mic turns off
    const pc = getPeerConnection();
    if (pc) {
      pc.getSenders().forEach((sender) => {
        if (sender.track) sender.track.stop();
      });
    }

    resetPeerConnection();
    navigate(-1); // go back to previous page
    console.log("🔴 Call ended");
  };

  return (
    <div className="h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 p-4 relative">

      {/* Status badge */}
      <div
        className={`text-xs px-3 py-1 rounded-full font-medium ${
          connected
            ? "bg-green-900 text-green-300"
            : "bg-gray-800 text-gray-400"
        }`}
      >
        {connected ? "🟢 Connected" : "⚪ Waiting for connection..."}
      </div>

      {/* Videos */}
      <div className="flex flex-col gap-3 w-full max-w-xl">

        {/* Remote video — the other person */}
        <div className="relative w-full">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-64 bg-gray-800 rounded-2xl object-cover"
          />
          {!connected && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
              Waiting for other person...
            </div>
          )}
          <span className="absolute bottom-2 left-3 text-xs text-white bg-black/50 px-2 py-0.5 rounded">
            Remote
          </span>
        </div>

        {/* Local video — you */}
        <div className="relative w-full">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-40 bg-gray-800 rounded-2xl object-cover"
          />
          <span className="absolute bottom-2 left-3 text-xs text-white bg-black/50 px-2 py-0.5 rounded">
            You
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-2">
        {/* Start call button — only for caller, hidden once connected */}
        {!connected && (
          <button
            onClick={handleCall}
            disabled={calling}
            className={`px-6 py-3 rounded-full text-white font-semibold transition
              ${
                calling
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500 active:scale-95"
              }`}
          >
            {calling ? "📞 Calling..." : "Start Call 📞"}
          </button>
        )}

        {/* ✅ End call button — always visible */}
        <button
          onClick={handleEndCall}
          className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold transition active:scale-95"
        >
          🔴 End Call
        </button>
      </div>
    </div>
  );
};

export default Call;