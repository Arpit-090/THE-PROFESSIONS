import { createContext, useRef, useState } from "react";
import { connectICE } from "../socket/socketFrontControllers.js";

const WebRtcContext = createContext();

export const WebRtcProvider = ({ children }) => {
  const Pc = useRef(null);
  const localStream = useRef(null);

  // ✅ KEY FIX: Store remote stream in state so any component can grab it
  // even if ontrack already fired before the component mounted
  const [remoteStream, setRemoteStream] = useState(null);

  const createPeerConnection = (to, onTrackCallback) => {
    if (Pc.current) {
      // PC already exists — just update ontrack to new callback
      if (onTrackCallback) {
        Pc.current.ontrack = (event) => {
          const stream = event.streams[0];
          setRemoteStream(stream); // ✅ always store in context
          onTrackCallback(stream);
        };
      }
      return Pc.current;
    }

    // First time — create fresh PC
    Pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    Pc.current.ontrack = (event) => {
      const stream = event.streams[0];
      console.log("🎥 ontrack fired — remote stream received");
      setRemoteStream(stream); // ✅ store it regardless of who is listening
      if (onTrackCallback) onTrackCallback(stream);
    };

    Pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("🧊 ICE candidate → sending to:", to);
        connectICE(to, event.candidate);
      }
    };

    Pc.current.onconnectionstatechange = () => {
      console.log("🔗 Connection state:", Pc.current?.connectionState);
    };
    Pc.current.oniceconnectionstatechange = () => {
      console.log("🧊 ICE state:", Pc.current?.iceConnectionState);
    };
    Pc.current.onsignalingstatechange = () => {
      console.log("📡 Signaling state:", Pc.current?.signalingState);
    };

    return Pc.current;
  };

  const getPeerConnection = () => Pc.current;

  const resetPeerConnection = () => {
    if (Pc.current) {
      Pc.current.close();
      Pc.current = null;
    }
    setRemoteStream(null);
    localStream.current = null;
    console.log("🔴 Peer connection reset");
  };

  const getLocalStream = async () => {
    if (localStream.current) return localStream.current;
    localStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    return localStream.current;
  };

  const addTracks = () => {
    if (!Pc.current || !localStream.current) {
      console.warn("⚠️ addTracks: PC or stream not ready");
      return;
    }
    const senders = Pc.current.getSenders();
    localStream.current.getTracks().forEach((track) => {
      const alreadyAdded = senders.find((s) => s.track === track);
      if (!alreadyAdded) {
        Pc.current.addTrack(track, localStream.current);
        console.log("✅ Track added:", track.kind);
      }
    });
  };

  return (
    <WebRtcContext.Provider
      value={{
        createPeerConnection,
        getPeerConnection,
        getLocalStream,
        addTracks,
        resetPeerConnection,
        remoteStream, // ✅ exposed so Call.jsx can use it directly
      }}
    >
      {children}
    </WebRtcContext.Provider>
  );
};

export { WebRtcContext };