import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import socket from "../socket";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const getIceServers = async () => {
  try {
    const res = await fetch(`${BACKEND}/turn-credentials`);
    const data = await res.json();
    const iceServers = Array.isArray(data) ? data : [];
    if (!iceServers.length) throw new Error("empty");
    console.log("[ICE] Using TURN servers:", iceServers.length);
    return { iceServers };
  } catch {
    console.warn("[ICE] Falling back to STUN only");
    return { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
  }
};

const VideoCall = ({ roomId, onEnd }) => {
  const localRef = useRef();
  const remoteRef = useRef();
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const iceCandidateBuffer = useRef([]);
  // Use refs for roomId and onEnd to avoid re-running the effect
  const roomIdRef = useRef(roomId);
  const onEndRef = useRef(onEnd);
  useEffect(() => { roomIdRef.current = roomId; }, [roomId]);
  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);

  const [status, setStatus] = useState("Connecting...");
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [facingMode, setFacingMode] = useState("user"); // "user" = front, "environment" = rear
  const token = useSelector((state) => state.auth.accessToken);

  const handleEnd = () => {
    socket.emit("leave-room", roomIdRef.current);
    onEndRef.current?.();
  };

  const toggleCam = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCamOn(track.enabled);
  };

  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  const flipCamera = async () => {
    const newFacing = facingMode === "user" ? "environment" : "user";
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacing },
        audio: false,
      });
      const newVideoTrack = newStream.getVideoTracks()[0];

      // Replace track in peer connection
      const sender = pcRef.current?.getSenders().find((s) => s.track?.kind === "video");
      if (sender) await sender.replaceTrack(newVideoTrack);

      // Stop old video track and swap in stream
      streamRef.current?.getVideoTracks()[0]?.stop();
      streamRef.current?.removeTrack(streamRef.current.getVideoTracks()[0]);
      streamRef.current?.addTrack(newVideoTrack);

      if (localRef.current) localRef.current.srcObject = streamRef.current;
      setFacingMode(newFacing);
    } catch (err) {
      console.error("[flipCamera] failed:", err.message);
    }
  };

  const flushIceCandidates = async (pc) => {
    for (const c of iceCandidateBuffer.current) {
      await pc.addIceCandidate(new RTCIceCandidate(c)).catch(() => {});
    }
    iceCandidateBuffer.current = [];
  };

  useEffect(() => {
    let pc;
    let ended = false;

    const doEnd = () => {
      if (ended) return;
      ended = true;
      onEndRef.current?.();
    };

    const start = async () => {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true });
      } catch (err) {
        setStatus(err.name === "NotAllowedError" ? "Camera/mic permission denied" : "Camera/mic not available");
        return;
      }
      streamRef.current = stream;
      if (localRef.current) localRef.current.srcObject = stream;
      setCamOn(stream.getVideoTracks()[0]?.enabled ?? false);
      setMicOn(stream.getAudioTracks()[0]?.enabled ?? false);

      const iceConfig = await getIceServers();
      pc = new RTCPeerConnection(iceConfig);
      pcRef.current = pc;
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      pc.ontrack = (e) => {
        if (remoteRef.current) remoteRef.current.srcObject = e.streams[0];
        setStatus("Connected");
      };

      pc.onicecandidate = (e) => {
        if (e.candidate) socket.emit("ice-candidate", { roomId: roomIdRef.current, candidate: e.candidate });
      };

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        console.log("[WebRTC] connectionState:", state);
        if (state === "failed") {
          // Attempt ICE restart before giving up
          if (pc.signalingState === "stable") {
            console.log("[WebRTC] Attempting ICE restart...");
            pc.restartIce();
          } else {
            setStatus("Connection failed");
            setTimeout(doEnd, 2000);
          }
        }
        // NOTE: "disconnected" is transient — do NOT end the call here
      };

      pc.oniceconnectionstatechange = () => {
        console.log("[WebRTC] iceConnectionState:", pc.iceConnectionState);
      };

      socket.on("user-joined", async () => {
        console.log("[VideoCall] user-joined, creating offer");
        setStatus("Calling...");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { roomId: roomIdRef.current, offer });
      });

      socket.on("offer", async ({ offer }) => {
        setStatus("Answering...");
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        await flushIceCandidates(pc);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { roomId: roomIdRef.current, answer });
      });

      socket.on("answer", async (answer) => {
        if (pc.signalingState !== "have-local-offer") return;
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        await flushIceCandidates(pc);
      });

      socket.on("ice-candidate", (candidate) => {
        if (pc.remoteDescription) {
          pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
        } else {
          iceCandidateBuffer.current.push(candidate);
        }
      });

      socket.on("user-left", () => {
        setStatus("Call ended by other party");
        setTimeout(doEnd, 1500);
      });

      socket.emit("join-room", { roomId: roomIdRef.current, token }, (res) => {
        console.log("[VideoCall] join-room response:", JSON.stringify(res));
        if (res && !res.success) setStatus("Access denied: " + res.message);
      });
    };

    start();

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
      streamRef.current?.getTracks().forEach((t) => t.stop());
      pcRef.current?.close();
    };
  }, []);
  // Empty deps: roomId/onEnd accessed via refs to prevent re-registration of socket listeners

  const btnBase = { border: "none", borderRadius: 999, padding: "12px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0f172a", zIndex: 9999 }}>
      <video ref={remoteRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />

      {status !== "Connected" && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#fff", fontSize: 20, fontWeight: 600, background: "rgba(0,0,0,0.55)", padding: "12px 28px", borderRadius: 12 }}>
          {status}
        </div>
      )}

      <video ref={localRef} autoPlay playsInline muted style={{ position: "absolute", bottom: 90, right: 16, width: 180, height: 120, objectFit: "cover", borderRadius: 12, border: "2px solid rgba(255,255,255,0.25)", background: "#1e293b" }} />

      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 12 }}>
        <button onClick={toggleMic} style={{ ...btnBase, background: micOn ? "rgba(255,255,255,0.15)" : "#ef4444", color: "#fff" }}>
          {micOn ? "🎙️" : "🔇"} {micOn ? "Mute" : "Unmute"}
        </button>
        <button onClick={handleEnd} style={{ ...btnBase, background: "#ef4444", color: "#fff", padding: "12px 36px" }}>
          ✕ End Call
        </button>
        <button onClick={toggleCam} style={{ ...btnBase, background: camOn ? "rgba(255,255,255,0.15)" : "#ef4444", color: "#fff" }}>
          {camOn ? "📷" : "🚫"} {camOn ? "Cam Off" : "Cam On"}
        </button>
        <button onClick={flipCamera} style={{ ...btnBase, background: "rgba(255,255,255,0.15)", color: "#fff" }}>
          🔄 Flip
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
