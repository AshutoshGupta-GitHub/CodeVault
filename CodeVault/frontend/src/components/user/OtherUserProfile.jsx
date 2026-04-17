//This whole file that is OtherUserProfile.jsx , it is the page that will show other users' profiles when we search for them in the navbar. It uses the same Profile component but fetches data based on username instead of current logged in user.

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./profile.css"; // Reuse your existing profile CSS

const OtherUserProfile = () => {
    const { username } = useParams(); // Gets 'abc' from /profile/abc
    const [userData, setUserData] = useState(null);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3000/username/${username.trim()}`);
                const data = await response.json();

                // The browser console will stay white/clean because status is 200
                if (data.user) {
                    setUserData(data.user);
                    setRepos(data.repos);
                } else {
                    setUserData(null); // This triggers your "User not found" UI
                }
            } catch (err) {
                console.warn("Actual network error occurred");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [username]);

   


    if (loading) return <div className="loading">Loading user profile...</div>;
    if (!userData) {
        return (
            <div className="dashboard-wrapper">
                <Navbar />
                <div className="error-container" style={{ textAlign: "center", marginTop: "100px", color: "white" }}>
                    <img
                        src="https://www.github.com/images/modules/search/no_results.png"
                        alt="Not Found"
                        style={{ width: "200px", opacity: "0.5" }}
                    />
                    <h2 style={{ fontSize: "2rem", marginTop: "20px" }}>User "{username}" not found</h2>
                    <p style={{ color: "#8b949e" }}>Check the spelling or try searching for another developer.</p>
                    <button
                        onClick={() => navigate("/")}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            backgroundColor: "#238636",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="dashboard-wrapper">
            <Navbar />
            <div className="dashboard-container" style={{ display: "block", padding: "40px" }}>

                {/* Profile Header Section */}
                <div className="profile-header-social" style={{ marginBottom: "30px", borderBottom: "1px solid #30363d", paddingBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div className="user-avatar-large" style={{ fontSize: "40px" }}>👤</div>
                        <div>
                            <h2 style={{ color: "white", margin: 0 }}>{userData.username}</h2>
                            <p style={{ color: "#8b949e", margin: "5px 0" }}>User Profile • {repos.length} Repositories</p>
                        </div>
                    </div>
                </div>

                {/* Repositories Feed */}
                <main className="main-feed" style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <div className="feed-header">
                        <h2 style={{ fontSize: "1.2rem" }}>Public Repositories</h2>
                    </div>

                    <div className="repo-list">
                        {repos.length > 0 ? (
                            repos.map((repo) => (
                                <div
                                    key={repo._id}
                                    className="pro-repo-card"
                                    onClick={() => navigate(`/repo/${repo.name}`)}
                                    style={{ cursor: "pointer", marginBottom: "15px" }}
                                >
                                    <div className="card-header-row">
                                        <h3 className="repo-title" style={{ color: "#58a6ff" }}>{repo.name}</h3>
                                        <span className="visibility-badge">Public</span>
                                    </div>
                                    <p className="repo-description" style={{ color: "#8b949e", margin: "10px 0" }}>
                                        {repo.description || "No description provided for this project."}
                                    </p>
                                    <div className="card-meta">
                                        <span className="lang"><span className="dot"></span> JavaScript</span>
                                        <span className="updated">Created {new Date(repo.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">This user has no public repositories yet.</div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OtherUserProfile;

