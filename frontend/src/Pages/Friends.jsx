// src/pages/Friends.jsx - NOW WORKS WITH YOUR AUTHCONTEXT!
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi, { baseUrl } from "../Common/SummaryApi";
import MainSidebar from "../Component/MainSidebar";
import { useAuth } from "../Provider/AuthContext"; // 👈 YOUR AUTH CONTEXT
import { signalingSocket } from "../Provider/CallProvider";
import "./friends.css";

const jsonHeaders = { "Content-Type": "application/json" };

const Friends = () => {
  const navigate = useNavigate();
  const { token, user, isAdmin } = useAuth(); // 🎯 USE YOUR AUTHCONTEXT!
  
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState("search");

  // 🎯 SIMPLIFIED USER CHECK - Uses YOUR AuthContext!
  const currentUser = user; // From your AuthContext
  const userId = user?._id || user?.userId;

  console.log("🔍 AuthContext user:", currentUser); // Debug log

  // Only load if user is logged in
  useEffect(() => {
    if (userId && token) {
      loadFriendsAndRequests();
    }
  }, [userId, token]);

  const loadFriendsAndRequests = async () => {
    if (!userId || !token) return;
    setLoading(true);
    try {
      console.log("📡 Loading friends for:", userId);
      
      const friendsRes = await fetch(
        `${baseUrl}${SummaryApi.listFriends.url}?userId=${encodeURIComponent(userId)}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const friendsData = await friendsRes.json();
      setFriends(friendsData.friends || []);

      const reqRes = await fetch(
        `${baseUrl}${SummaryApi.listFriendRequests.url}?userId=${encodeURIComponent(userId)}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const reqData = await reqRes.json();
      setIncoming(reqData.incoming || []);
      setOutgoing(reqData.outgoing || []);
    } catch (e) {
      console.error("❌ Friends API error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `${baseUrl}${SummaryApi.searchUsers.url}?q=${encodeURIComponent(search.trim())}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();
      setSearchResults((data.users || []).filter((u) => u._id !== userId));
      setActiveLeftTab("search");
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const sendFriendRequest = async (toUserId) => {
    if (!userId || !token) {
      alert("Please refresh page");
      return;
    }
    try {
      const res = await fetch(baseUrl + SummaryApi.sendFriendRequest.url, {
        method: SummaryApi.sendFriendRequest.method,
        headers: { 
          ...jsonHeaders,
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ fromUserId: userId, toUserId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to send request");
      } else {
        await loadFriendsAndRequests();
        alert("Friend request sent! 🎉");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to send request");
    }
  };

  const respond = async (requestId, action) => {
    if (!userId || !token) return;
    try {
      const res = await fetch(
        `${baseUrl}${SummaryApi.respondFriendRequest.url}/${requestId}/respond`,
        {
          method: SummaryApi.respondFriendRequest.method,
          headers: { 
            ...jsonHeaders,
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ userId, action }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed");
      } else {
        await loadFriendsAndRequests();
      }
    } catch (e) {
      console.error(e);
      alert("Failed");
    }
  };

  const buildRoomId = (userAId, userBId) => {
    const [a, b] = [String(userAId), String(userBId)].sort();
    return `room-${a}-${b}`;
  };

  const handleStartCall = (friend) => {
    if (!userId || !token) {
      alert("Please refresh the page");
      return;
    }
    const friendId = friend._id || friend.id || friend.userId;
    const roomId = buildRoomId(userId, friendId);

    signalingSocket.emit("call-user", {
      toUserId: friendId,
      fromUserId: userId,
      roomId,
    });

    navigate(`/call/${roomId}`);
  };

  // 🎯 PERFECT LOGIN CHECK - Uses YOUR AuthContext!
  if (!token || !user || !userId) {
    return (
      <div style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0f2fe, #fef9c3 40%, #fee2e2 80%)",
        padding: "20px"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.95)",
          padding: "40px",
          borderRadius: "24px",
          boxShadow: "0 20px 48px rgba(15,23,42,0.25)",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🤝</div>
          <h2 style={{ margin: "0 0 12px 0", color: "#1e293b" }}>Sign Language Friends</h2>
          <p style={{ margin: "0 0 24px 0", color: "#64748b" }}>
            Please log in to find sign language partners
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "14px 28px",
              background: "linear-gradient(135deg, #ec4899, #f472b6)",
              color: "white",
              border: "none",
              borderRadius: "14px",
              fontWeight: "700",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(236,72,153,0.4)"
            }}
          >
            Go to Login →
          </button>
          <details style={{ marginTop: "20px" }}>
            <summary>Debug AuthContext (click)</summary>
            <pre style={{ 
              fontSize: "12px", 
              background: "#f8f9fa", 
              padding: "12px", 
              borderRadius: "8px",
              maxHeight: "150px",
              overflow: "auto",
              marginTop: "12px"
            }}>
{JSON.stringify({
  token: token ? "PRESENT" : "MISSING",
  user: user,
  userId: userId,
  isAdmin: isAdmin
}, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  // 🎉 USER IS LOGGED IN! Show friends page
  return (
    <div className="ms-shell">
      <MainSidebar user={currentUser} />
      <div className="ms-shell-content friends-root">
        <div className="friends-layout">
          <div className="friends-header-row">
            <div>
              <div className="friends-pill">
                <span>🤝</span>
                <span>Find sign partners</span>
              </div>
              <h2 className="friends-title">Friends & Sign Partners</h2>
              <p className="friends-subtitle">
                Discover learners, send requests, and connect instantly with video calls.
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="friends-search-form">
            <div className="friends-search-wrap">
              <span className="friends-search-icon">🔍</span>
              <input
                className="friends-search-input"
                placeholder="Search users by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                disabled={searching}
                className={`friends-search-button ${searching ? "friends-search-button--loading" : ""}`}
              >
                {searching ? "Searching…" : "Search"}
              </button>
            </div>
          </form>

          <div className="friends-main">
            {/* LEFT PANEL - Search/Requests */}
            <div className="friends-left-card">
              <div className="friends-tabs">
                <button
                  className={`friends-tab ${activeLeftTab === "search" ? "friends-tab-active" : ""}`}
                  onClick={() => setActiveLeftTab("search")}
                >
                  Search Results
                </button>
                <button
                  className={`friends-tab ${activeLeftTab === "incoming" ? "friends-tab-active" : ""}`}
                  onClick={() => setActiveLeftTab("incoming")}
                >
                  Incoming ({incoming.length})
                </button>
                <button
                  className={`friends-tab ${activeLeftTab === "outgoing" ? "friends-tab-active" : ""}`}
                  onClick={() => setActiveLeftTab("outgoing")}
                >
                  Sent ({outgoing.length})
                </button>
              </div>

              <div className="friends-left-body">
                {/* SEARCH TAB */}
                {activeLeftTab === "search" && (
                  <>
                    {searchResults.length === 0 ? (
                      <div className="friends-empty">
                        <h4>Start connecting</h4>
                        <p>Search for users by name or email to add sign partners</p>
                      </div>
                    ) : (
                      <div className="friends-list-grid">
                        {searchResults.map((u) => {
                          const initials = (u.name || u.email || "?")
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();
                          return (
                            <div key={u._id} className="friend-card friend-card--hover">
                              <div className="friend-main">
                                <div className="friend-avatar">{initials}</div>
                                <div className="friend-main-info">
                                  <span className="friend-name">{u.name || u.email}</span>
                                  <span className="friend-email">{u.email}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => sendFriendRequest(u._id)}
                                className="btn btn--primary"
                              >
                                ➕ Add Friend
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {/* INCOMING REQUESTS */}
                {activeLeftTab === "incoming" && (
                  <>
                    {incoming.length === 0 ? (
                      <div className="friends-empty friends-empty--warm">
                        <h4>No new requests</h4>
                        <p>Share your profile to get friend requests!</p>
                      </div>
                    ) : (
                      <div className="friends-list-grid">
                        {incoming.map((req) => {
                          const name = req.fromUser?.name || req.fromUser?.email;
                          const initials = (name || "?")
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();
                          return (
                            <div key={req._id} className="friend-card friend-card--hover">
                              <div className="friend-main">
                                <div className="friend-avatar">{initials}</div>
                                <div className="friend-main-info">
                                  <span className="friend-name">{name}</span>
                                  <span className="friend-hint">wants to sign with you</span>
                                </div>
                              </div>
                              <div className="friend-actions-vertical">
                                <button
                                  onClick={() => respond(req._id, "accept")}
                                  className="btn btn--success-light"
                                >
                                  ✅ Accept
                                </button>
                                <button
                                  onClick={() => respond(req._id, "reject")}
                                  className="btn btn--danger-light"
                                >
                                  ❌ Reject
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {/* OUTGOING REQUESTS */}
                {activeLeftTab === "outgoing" && (
                  <>
                    {outgoing.length === 0 ? (
                      <div className="friends-empty friends-empty--cool">
                        <h4>No pending requests</h4>
                        <p>Send friend requests from search tab</p>
                      </div>
                    ) : (
                      <div className="friends-list-grid">
                        {outgoing.map((req) => {
                          const name = req.toUser?.name || req.toUser?.email;
                          const initials = (name || "?")
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();
                          return (
                            <div key={req._id} className="friend-card friend-card--hover">
                              <div className="friend-main">
                                <div className="friend-avatar">{initials}</div>
                                <div className="friend-main-info">
                                  <span className="friend-name">{name}</span>
                                  <span className="friend-hint">Request sent</span>
                                </div>
                              </div>
                              <span className="chip-pill chip-pill--pending">Pending</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* RIGHT PANEL - Friends List */}
            <div className="friends-right-card">
              <div className="friends-right-header">
                <span className="friends-right-title">Your Sign Partners</span>
                <span className="friends-right-count">{friends.length} friends</span>
              </div>

              <div className="friends-right-section-label">Active Friends</div>
              <div className="friends-right-list">
                {loading && <span className="friends-status-text">Loading friends…</span>}
                {!loading && friends.length === 0 && (
                  <span className="friends-status-text">
                    No friends yet. Search and add partners above!
                  </span>
                )}
                {!loading &&
                  friends.map((f) => {
                    const initials = (f.name || f.email || "?")
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <div key={f._id || f.id} className="friend-card">
                        <div className="friend-main">
                          <div className="friend-avatar">{initials}</div>
                          <div className="friend-main-info">
                            <span className="friend-name">{f.name || f.email}</span>
                            <span className="friend-email">{f.email}</span>
                          </div>
                        </div>
                        <div className="friend-actions-vertical">
                          <button 
                            className="btn btn--primary" 
                            onClick={() => handleStartCall(f)}
                          >
                            🎥 Video Call
                          </button>
                          <button className="btn btn--ghost" disabled>
                            👋 Sign Call (soon)
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="friends-right-section-label">Requests Summary</div>
              <div className="friends-overview-grid">
                <div className="friends-overview-card friends-overview-card--incoming">
                  <div className="friends-overview-label">📥 Incoming</div>
                  <div className="friends-overview-value">{incoming.length}</div>
                </div>
                <div className="friends-overview-card friends-overview-card--sent">
                  <div className="friends-overview-label">📤 Sent</div>
                  <div className="friends-overview-value">{outgoing.length}</div>
                </div>
                <div className="friends-overview-card friends-overview-card--total">
                  <div className="friends-overview-label">👥 Total</div>
                  <div className="friends-overview-value">
                    {friends.length + incoming.length + outgoing.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
