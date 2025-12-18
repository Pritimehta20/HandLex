// src/pages/VideoCall.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const signalingUrl = "http://localhost:9000";
const socket = io(signalingUrl, { autoConnect: false });

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    socket.connect();

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        socket.emit("join-room", roomId);

        let isInitiator = false;

        socket.on("user-joined", () => {
          isInitiator = true;
          startPeer(true, stream);
        });

        socket.on("signal", ({ data }) => {
          if (!peerRef.current) {
            startPeer(false, stream, data);
          } else {
            peerRef.current.signal(data);
          }
        });

        const startPeer = (initiator, localStream, initialSignal) => {
          const peer = new Peer({
            initiator,
            trickle: false,
            stream: localStream,
          });

          peer.on("signal", (sdp) => {
            socket.emit("signal", { roomId, data: sdp });
          });

          peer.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              setConnecting(false);
            }
          });

          if (initialSignal) {
            peer.signal(initialSignal);
          }

          peerRef.current = peer;
        };
      })
      .catch((err) => {
        console.error("Media error", err);

        // device already in use -> just stay in call without local media
        if (err.name === "NotReadableError") {
          // optional: you could try audio-only here
          return;
        }

        // user or browser blocked permissions
        if (err.name === "NotAllowedError" || err.name === "SecurityError") {
          alert("Please allow camera and microphone access in your browser settings.");
          navigate("/dashboard");
          return;
        }

        // other unexpected errors
        alert("Unexpected error while accessing camera/mic.");
        navigate("/dashboard");
      });

    return () => {
      socket.off("user-joined");
      socket.off("signal");
      socket.disconnect();

      if (peerRef.current) peerRef.current.destroy();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [roomId, navigate]);

  const handleLeave = () => {
    if (peerRef.current) peerRef.current.destroy();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    socket.disconnect();
    navigate("/dashboard");
  };

  return (
    <div className="vc-root">
      <style>{`
        .vc-root {
          min-height: 100vh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:16px;
          background: radial-gradient(circle at top left,#e0f2fe,#f8fafc 40%,#e5e7eb 80%);
          padding:16px;
        }
        .vc-videos {
          display:flex;
          flex-wrap:wrap;
          gap:16px;
          justify-content:center;
        }
        .vc-video {
          background:#020617;
          border-radius:18px;
          max-width:420px;
          width:100%;
          aspect-ratio:16/9;
          object-fit:cover;
          box-shadow:0 18px 40px rgba(15,23,42,0.7);
        }
        .vc-local {
          border:2px solid #bfdbfe;
        }
        .vc-remote {
          border:2px solid #bbf7d0;
        }
        .vc-toolbar {
          display:flex;
          gap:12px;
          margin-top:8px;
        }
        .vc-btn {
          padding:8px 14px;
          border-radius:999px;
          border:none;
          cursor:pointer;
          font-size:0.9rem;
          font-weight:600;
        }
        .vc-leave {
          background:#fee2e2;
          color:#b91c1c;
        }
        .vc-status {
          font-size:0.9rem;
          color:#4b5563;
        }
      `}</style>

      <div className="vc-videos">
        <video ref={myVideoRef} autoPlay muted className="vc-video vc-local" />
        <video ref={remoteVideoRef} autoPlay className="vc-video vc-remote" />
      </div>

      <div className="vc-toolbar">
        <button className="vc-btn vc-leave" onClick={handleLeave}>
          🚪 Leave call
        </button>
        <span className="vc-status">
          {connecting ? "Connecting..." : "Connected"}
        </span>
      </div>
    </div>
  );
};

export default VideoCall;
