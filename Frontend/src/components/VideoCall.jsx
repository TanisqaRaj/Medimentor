import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import socket from "../socket";

const VideoCall = ({ roomId, onEnd }) => {
  const localRef = useRef();
  const remoteRef = useRef();
  const pcRef = useRef();
  const streamRef = useRef();
  const [status, setStatus] = useState("Connecting...");
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const token = useSelector((state) => state.auth.accessToken);

  // End call — emit leave-room so the other side updates too
  const handleEnd = useCallback(() => {
    socket.emit("leave-room", roomId);
    onEnd();
  }, [roomId, onEnd]);

  const toggleCam = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) { track.enabled = !track.enabled; setCamOn(track.enabled); }
  };

  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) { track.enabled = !track.enabled; setMicOn(track.enabled); }
  };

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });
    pcRef.current = pc;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        localRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      })
      .catch(() => setStatus("Camera/mic access denied"));

    pc.ontrack = (e) => {
      remoteRef.current.srcObject = e.streams[0];
      setStatus("Connected");
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("ice-candidate", { roomId, candidate: e.candidate });
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        handleEnd();
      }
    };

    socket.emit("join-room", { roomId, token }, (res) => {
      if (res && !res.success) setStatus("Access denied: " + res.message);
    });

    socket.on("user-joined", async () => {
      setStatus("Calling...");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { roomId, offer });
    });

    socket.on("offer", async ({ offer }) => {
      setStatus("Answering...");
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", (answer) => pc.setRemoteDescription(new RTCSessionDescription(answer)));
    socket.on("ice-candidate", (candidate) => pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {}));

    // Other side ended the call — update this side immediately
    socket.on("user-left", () => {
      setStatus("Call ended by other party");
      setTimeout(onEnd, 1500);
    });

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
      streamRef.current?.getTracks().forEach((t) => t.stop());
      pc.close();
    };
  }, [roomId]);

  const btnBase = { border: "none", borderRadius: 999, padding: "12px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0f172a", zIndex: 9999 }}>
      {/* Remote video */}
      <video ref={remoteRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />

      {/* Status */}
      {status !== "Connected" && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#fff", fontSize: 20, fontWeight: 600, background: "rgba(0,0,0,0.55)", padding: "12px 28px", borderRadius: 12 }}>
          {status}
        </div>
      )}

      {/* Local video PiP */}
      <video ref={localRef} autoPlay playsInline muted style={{ position: "absolute", bottom: 90, right: 16, width: 180, height: 120, objectFit: "cover", borderRadius: 12, border: "2px solid rgba(255,255,255,0.25)", background: "#1e293b" }} />

      {/* Controls */}
      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 12 }}>
        {/* Mic toggle */}
        <button onClick={toggleMic} style={{ ...btnBase, background: micOn ? "rgba(255,255,255,0.15)" : "#ef4444", color: "#fff" }}>
          {micOn ? "🎙️" : "🔇"} {micOn ? "Mute" : "Unmute"}
        </button>

        {/* End call */}
        <button onClick={handleEnd} style={{ ...btnBase, background: "#ef4444", color: "#fff", padding: "12px 36px" }}>
          ✕ End Call
        </button>

        {/* Camera toggle */}
        <button onClick={toggleCam} style={{ ...btnBase, background: camOn ? "rgba(255,255,255,0.15)" : "#ef4444", color: "#fff" }}>
          {camOn ? "📷" : "🚫"} {camOn ? "Cam Off" : "Cam On"}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
