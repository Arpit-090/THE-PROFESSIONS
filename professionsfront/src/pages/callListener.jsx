import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { incommingCall } from "../socket/socketFrontControllers.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { WebRtcContext } from "../webRTC/webRTCContext.jsx";
import { getSocket } from "../socket/socketConnect.js";

const CALL_TIMEOUT_MS = 5000;

const CallListener = () => {
  const { user } = useContext(AuthContext);
  const { getLocalStream, createPeerConnection, addTracks, getPeerConnection } =
    useContext(WebRtcContext);

  const navigate = useNavigate();

  const [caller, setCaller] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // ✅ Use refs for offer and caller so handleAccept always has latest values
  // (state updates are async — refs are synchronous)
  const offerRef = useRef(null);
  const callerRef = useRef(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const clearTimers = () => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
  };

  const resetCall = () => {
    clearTimers();
    setCaller(null);
    setTimeLeft(null);
    offerRef.current = null;
    callerRef.current = null;
  };

  const startCountdown = () => {
    setTimeLeft(CALL_TIMEOUT_MS / 1000);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(intervalRef.current); return 0; }
        return prev - 1;
      });
    }, 2000);
    timeoutRef.current = setTimeout(() => {
      console.log("⏰ Auto-rejected");
      resetCall();
    }, CALL_TIMEOUT_MS);
  };

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();

    // Step 1 — who is calling
    incommingCall((from) => {
      console.log("📞 Incoming call from:", from);
      callerRef.current = from;
      setCaller(from);
      startCountdown();
    }, () => {});

    // Step 2 — store offer when it arrives
    socket.on("offer", (data) => {
      console.log("📨 Offer received from:", data.from);
      offerRef.current = data.offer;
    });

    // ICE — add if PC exists (may arrive after accept)
    socket.on("ice-condidate", async (data) => {
      const pc = getPeerConnection();
      if (pc && data.candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          console.log("✅ ICE added in CallListener");
        } catch (err) {
          console.error("ICE error:", err);
        }
      }
    });

    return () => {
      socket.off("offer");
      socket.off("ice-condidate");
      clearTimers();
    };
  }, [user]);

  const handleAccept = async () => {
    const currentOffer = offerRef.current;
    const currentCaller = callerRef.current;

    if (!currentOffer) {
      console.error("❌ Offer not received yet");
      return;
    }

    clearTimers();
    const socket = getSocket();

    try {
      // 1. Get local stream
      await getLocalStream();

      // 2. Create/update PC
      createPeerConnection(currentCaller, (remoteStream) => {
        // remoteStream is also stored in context — Call.jsx will pick it up
        console.log("✅ ontrack fired in CallListener accept");
      });

      // 3. Add local tracks so caller gets callee's video/audio
      addTracks();

      // 4. Set remote offer
      const pc = getPeerConnection();
      await pc.setRemoteDescription(new RTCSessionDescription(currentOffer));

      // 5. Create and send answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { answer, to: currentCaller });
      console.log("✅ Answer sent to:", currentCaller);

      resetCall();

      // ✅ Navigate to call page — Call.jsx mounts and reads remoteStream from context
      navigate(`/call/${currentCaller}`);

    } catch (err) {
      console.error("❌ Accept error:", err);
    }
  };

  const handleReject = () => {
    console.log("❌ Rejected");
    resetCall();
  };

  if (!caller) return null;

  return (
    <div className="fixed top-5 right-5 z-50 bg-gray-900 border border-gray-700 text-white p-4 rounded-xl shadow-2xl w-72">
      <p className="text-lg font-semibold mb-1">📞 Incoming Call</p>
      <p className="text-sm text-gray-400 mb-3">
        From: <span className="text-white font-medium">{caller}</span>
      </p>

      {/* Countdown */}
      {timeLeft !== null && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Auto-rejecting in</span>
            <span className={timeLeft <= 2 ? "text-red-400 font-bold" : ""}>{timeLeft}s</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / (CALL_TIMEOUT_MS / 1000)) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-medium transition cursor-pointer"
        >
          ✅ Accept
        </button>
        <button
          onClick={handleReject}
          className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-medium transition cursor-pointer"
        >
          ❌ Reject
        </button>
      </div>
    </div>
  );
};

export default CallListener;