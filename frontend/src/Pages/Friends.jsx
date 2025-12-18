// src/pages/Friends.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi, { baseUrl } from "../Common/SummaryApi";
import MainSidebar from "../Component/MainSidebar";
import { signalingSocket } from "../Provider/CallProvider";
import "./friends.css";

const jsonHeaders = { "Content-Type": "application/json" };

const Friends = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState("search");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch (e) {
      console.error("Invalid user JSON", e);
    }
  }, []);

  const userId = currentUser?.userId || currentUser?._id;

  const loadFriendsAndRequests = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const friendsRes = await fetch(
        `${baseUrl}${SummaryApi.listFriends.url}?userId=${encodeURIComponent(
          userId
        )}`
      );
      const friendsData = await friendsRes.json();
      setFriends(friendsData.friends || []);

      const reqRes = await fetch(
        `${baseUrl}${
          SummaryApi.listFriendRequests.url
        }?userId=${encodeURIComponent(userId)}`
      );
      const reqData = await reqRes.json();
      setIncoming(reqData.incoming || []);
      setOutgoing(reqData.outgoing || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadFriendsAndRequests();
  }, [userId]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setSearching(true);
      const res = await fetch(
        `${baseUrl}${SummaryApi.searchUsers.url}?q=${encodeURIComponent(
          search.trim()
        )}`
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
    if (!userId) return;
    try {
      const res = await fetch(baseUrl + SummaryApi.sendFriendRequest.url, {
        method: SummaryApi.sendFriendRequest.method,
        headers: jsonHeaders,
        body: JSON.stringify({ fromUserId: userId, toUserId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to send request");
      } else {
        await loadFriendsAndRequests();
        alert("Friend request sent");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to send request");
    }
  };

  const respond = async (requestId, action) => {
    if (!userId) return;
    try {
      const res = await fetch(
        `${baseUrl}${
          SummaryApi.respondFriendRequest.url
        }/${requestId}/respond`,
        {
          method: SummaryApi.respondFriendRequest.method,
          headers: jsonHeaders,
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
    if (!userId || (!friend._id && !friend.id)) {
      alert("Missing user information for call.");
      return;
    }
    const friendId = friend._id || friend.id;
    const roomId = buildRoomId(userId, friendId);

    signalingSocket.emit("call-user", {
      toUserId: friendId,
      fromUserId: userId,
      roomId,
    });

    navigate(`/call/${roomId}`);
  };

  if (!currentUser) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top left, #e0f2fe, #fef9c3 40%, #fee2e2 80%)",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.96)",
            padding: "20px 26px",
            borderRadius: 20,
            boxShadow: "0 18px 40px rgba(15,23,42,0.25)",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Friends</h2>
          <p>Please log in to use friends.</p>
        </div>
      </div>
    );
  }

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
                Discover learners, send requests, and connect instantly with a big video call button.
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="friends-search-form">
            <div className="friends-search-wrap">
              <span className="friends-search-icon">🔍</span>
              <input
                className="friends-search-input"
                placeholder="Search users or friends by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                disabled={searching}
                className={
                  "friends-search-button " +
                  (searching ? "friends-search-button--loading" : "")
                }
              >
                {searching ? "Searching…" : "Search"}
              </button>
            </div>
          </form>

          <div className="friends-main">
            <div className="friends-left-card">
              <div className="friends-tabs">
                <button
                  type="button"
                  className={
                    "friends-tab " +
                    (activeLeftTab === "search" ? "friends-tab-active" : "")
                  }
                  onClick={() => setActiveLeftTab("search")}
                >
                  Search Results
                </button>
                <button
                  type="button"
                  className={
                    "friends-tab " +
                    (activeLeftTab === "incoming"
                      ? "friends-tab-active"
                      : "")
                  }
                  onClick={() => setActiveLeftTab("incoming")}
                >
                  Incoming Requests
                </button>
                <button
                  type="button"
                  className={
                    "friends-tab " +
                    (activeLeftTab === "outgoing"
                      ? "friends-tab-active"
                      : "")
                  }
                  onClick={() => setActiveLeftTab("outgoing")}
                >
                  Sent Requests
                </button>
              </div>

              <div className="friends-left-body">
                {activeLeftTab === "search" && (
                  <>
                    {searchResults.length === 0 && (
                      <div className="friends-empty">
                        <h4>Start connecting</h4>
                        <p>Type a name or email above to discover new friends.</p>
                      </div>
                    )}
                    {searchResults.length > 0 && (
                      <div className="friends-list-grid">
                        {searchResults.map((u) => {
                          const initials = (u.name || u.email || "?")
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();
                          return (
                            <div
                              key={u._id}
                              className="friend-card friend-card--hover"
                            >
                              <div className="friend-main">
                                <div className="friend-avatar">{initials}</div>
                                <div className="friend-main-info">
                                  <span className="friend-name">
                                    {u.name || u.email}
                                  </span>
                                  <span className="friend-email">{u.email}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => sendFriendRequest(u._id)}
                                className="btn btn--primary"
                              >
                                ➕ Add friend
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {activeLeftTab === "incoming" && (
                  <>
                    {incoming.length === 0 && (
                      <div className="friends-empty friends-empty--warm">
                        <h4>No new requests</h4>
                        <p>You have no new friend requests right now.</p>
                      </div>
                    )}
                    {incoming.length > 0 && (
                      <div className="friends-list-grid">
                        {incoming.map((req) => {
                          const name =
                            req.fromUser?.name || req.fromUser?.email;
                          const initials = (name || "?")
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();
                          return (
                            <div
                              key={req._id}
                              className="friend-card friend-card--hover"
                            >
                              <div className="friend-main">
                                <div className="friend-avatar">{initials}</div>
                                <div className="friend-main-info">
                                  <span className="friend-name">{name}</span>
                                  <span className="friend-hint">
                                    wants to be your friend
                                  </span>
                                </div>
                              </div>
                              <div className="friend-actions-vertical">
                                <button
                                  onClick={() => respond(req._id, "accept")}
                                  className="btn btn--success-light"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => respond(req._id, "reject")}
                                  className="btn btn--danger-light"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {activeLeftTab === "outgoing" && (
                  <>
                    {outgoing.length === 0 && (
                      <div className="friends-empty friends-empty--cool">
                        <h4>No pending requests</h4>
                        <p>You have no pending sent requests.</p>
                      </div>
                    )}
                    {outgoing.length > 0 && (
                      <div className="friends-list-grid">
                        {outgoing.map((req) => {
                          const name =
                            req.toUser?.name || req.toUser?.email;
                          const initials = (name || "?")
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();
                          return (
                            <div
                              key={req._id}
                              className="friend-card friend-card--hover"
                            >
                              <div className="friend-main">
                                <div className="friend-avatar">{initials}</div>
                                <div className="friend-main-info">
                                  <span className="friend-name">{name}</span>
                                  <span className="friend-hint">
                                    Request pending
                                  </span>
                                </div>
                              </div>
                              <span className="chip-pill">Pending</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="friends-right-card">
              <div className="friends-right-header">
                <span className="friends-right-title">Friends overview</span>
                <span className="friends-right-count">
                  {friends.length} total
                </span>
              </div>

              <div className="friends-right-section-label">Friends</div>
              <div className="friends-right-list">
                {loading && (
                  <span className="friends-status-text">
                    Loading friends…
                  </span>
                )}
                {!loading && friends.length === 0 && (
                  <span className="friends-status-text">
                    No friends yet. Add someone from the search tab.
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
                      <div key={f.id || f._id} className="friend-card">
                        <div className="friend-main">
                          <div className="friend-avatar">{initials}</div>
                          <div className="friend-main-info">
                            <span className="friend-name">
                              {f.name || f.email}
                            </span>
                            <span className="friend-email">{f.email}</span>
                          </div>
                        </div>
                        <div className="friend-actions-vertical">
                          <button
                            className="btn btn--primary"
                            onClick={() => handleStartCall(f)}
                          >
                            🎥 Connect now
                          </button>
                          <button className="btn btn--ghost" disabled>
                            Sign call (coming soon)
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="friends-right-section-label">
                Requests overview
              </div>
              <div className="friends-overview-grid">
                <div className="friends-overview-card friends-overview-card--incoming">
                  <div className="friends-overview-label">Incoming</div>
                  <div className="friends-overview-value">
                    {incoming.length}
                  </div>
                </div>
                <div className="friends-overview-card friends-overview-card--sent">
                  <div className="friends-overview-label">Sent</div>
                  <div className="friends-overview-value">
                    {outgoing.length}
                  </div>
                </div>
                <div className="friends-overview-card friends-overview-card--total">
                  <div className="friends-overview-label">Total</div>
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
