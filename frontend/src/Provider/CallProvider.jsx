// src/Context/CallProvider.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export const signalingSocket = io("http://localhost:9000", {
  autoConnect: false,
});

const CallProvider = ({ user, children }) => {
  const navigate = useNavigate();
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    if (!user) return;

    const uid = user.userId || user._id;
    if (!uid) return;

    signalingSocket.connect();
    signalingSocket.emit("register-user", uid);

    signalingSocket.on("incoming-call", ({ fromUserId, roomId }) => {
      setIncomingCall({ fromUserId, roomId });
    });

    return () => {
      signalingSocket.off("incoming-call");
      signalingSocket.disconnect();
    };
  }, [user]);

  const handleAccept = () => {
    if (!incomingCall) return;
    navigate(`/call/${incomingCall.roomId}`);
    setIncomingCall(null);
  };

  const handleReject = () => {
    setIncomingCall(null);
  };

  return (
    <>
      {children}
      {incomingCall && (
        <div
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: 9999,
            background: "white",
            boxShadow: "0 10px 25px rgba(15,23,42,0.35)",
            borderRadius: 16,
            padding: "12px 16px",
            minWidth: 260,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
            Incoming call
          </div>
          <div style={{ fontSize: 13, color: "#4b5563", marginBottom: 8 }}>
            From: {incomingCall.fromUserId}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              onClick={handleReject}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: "none",
                fontSize: 12,
                background: "#fee2e2",
                color: "#b91c1c",
                cursor: "pointer",
              }}
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: "none",
                fontSize: 12,
                background: "#22c55e",
                color: "white",
                cursor: "pointer",
              }}
            >
              Receive
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CallProvider;
