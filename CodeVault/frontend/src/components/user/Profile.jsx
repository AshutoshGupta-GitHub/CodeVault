// new code for Profile page with better UI
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import HeatMap from "./HeatMap";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || userId === "null" || !token) {
      navigate("/auth"); 
      return; 
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/userProfile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` } 
        });
        setUserDetails(response.data.user);
      } catch (err) {
        console.error("Session expired or error: ", err);
        localStorage.clear();
        navigate("/auth");
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.clear(); // Clears userId and token
    navigate("/auth");    // Sends user back to login
  };

  if (!userDetails) return <div className="loading-screen">Loading Profile...</div>;

  return (
    <div className="profile-page-wrapper">
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-tabs">
          <div className="tab active">Overview</div>
          <div className="tab">Repositories</div>
          <div className="tab">Projects</div>
          <div className="tab">Packages</div>
          <div className="tab">Stars</div>
        </div>

        <div className="profile-layout-grid">
          <aside className="profile-sidebar">
            <div className="avatar-container">
              <img 
                src="https://via.placeholder.com/250" 
                alt="Profile" 
                className="profile-avatar"
              />
            </div>
            <div className="user-meta">
              <h1 className="full-name">{userDetails.username}</h1>
              <p className="username-handle">@{userDetails.username.toLowerCase().replace(/\s/g, '')}</p>
              
              <button className="edit-profile-btn">Edit Profile</button>
              
              {/* NEW LOGOUT BUTTON */}
              <button className="logout-btn" onClick={handleLogout}>
                <span className="logout-icon">🚪</span> Logout
              </button>
              
              <div className="social-stats">
                <span><strong>12</strong> followers</span>
                <span><strong>5</strong> following</span>
              </div>
            </div>
          </aside>

          <main className="profile-main-content">
            <div className="profile-section-card">
              <h4 className="section-title">Pinned Repositories</h4>
              <div className="pinned-grid">
                <div className="mini-repo-card">
                  <div className="mini-card-header">
                    <span className="repo-icon">📁</span>
                    <span className="mini-repo-name">My-Awesome-Project</span>
                  </div>
                  <p className="mini-repo-desc">A professional project created with React and Node.</p>
                </div>
              </div>
            </div>

            <div className="profile-section-card">
              <h4 className="section-title">Contribution Activity</h4>
              <div className="heatmap-container">
                <HeatMap />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;



