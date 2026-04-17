//Nw code with help section user Guide by Gemini

// New cod efor Dashboard component with styling with fetching data from backend and showing it on frontend.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showHelp, setShowHelp] = useState(false); // Added state for help toggle
  
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
        const data = await response.json();
        setRepositories(data.repositories);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data);
      } catch (err) {
        console.error("Error while fetching suggested repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  // Function to handle double click on a repository
  const handleRepoClick = (repoName) => {
    navigate(`/repo/${repoName}`);
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-container">
        
        {/* New Left SIDEBAR Suggested Repository code by Gemini */}
        {/* LEFT SIDEBAR: Suggested */}
        <aside className="left-aside">
          <div className="section-header">
            <h4>Suggested Repositories</h4>
          </div>
          <div className="suggested-list">
            {suggestedRepositories
              .slice(0,10) // Create a shallow copy
              .reverse() // FLIP the order: Newest will now be at the TOP
              .filter(repo => repo.owner?._id !== localStorage.getItem("userId")) // Filter out logged-in user
              .map((repo) => (
                <div 
                  key={repo._id} 
                  className="suggestion-item"
                  onClick={() => handleRepoClick(repo.name)} 
                >
                  <div className="suggestion-content">
                    <span className="repo-icon">📁</span>
                    <div className="repo-details">
                      <p className="suggested-name">{repo.name}</p>
                      <span className="suggested-owner">by {repo.owner?.username || "User"}</span>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </aside>

        {/* MIDDLE: User Repositories */}
        <main className="main-feed">
          <div className="feed-header">
            <h2>Your Repositories</h2>
            <div className="search-container">
              <input
                type="text"
                value={searchQuery}
                placeholder="Find a repository..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dashboard-search-input"
              />
            </div>
          </div>

          <div className="repo-list">
            {searchResults.length > 0 ? (
                searchResults.map((repo) => (
                <div 
                  key={repo._id} 
                  className="pro-repo-card"
                  onDoubleClick={() => handleRepoClick(repo.name)} // Added Double Click trigger
                  style={{ cursor: "pointer" }} // Visual hint that it is clickable
                >
                    <div className="card-header-row">
                        <h3 className="repo-title">{repo.name}</h3>
                        <span className="visibility-badge">Public</span>
                    </div>
                    <p className="repo-description">
                        {repo.description || "No description provided for this project."}
                    </p>
                    <div className="card-meta">
                        <span className="lang"><span className="dot"></span> JavaScript</span>
                        <span className="updated">Updated recently</span>
                    </div>
                </div>
                ))
            ) : (
                <div className="empty-state">No repositories match your search.</div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR: Events & Help */}
        <aside className="right-aside">
          <div className="section-header">
            <h4>Upcoming Events</h4>
          </div>
          <div className="events-stack">
            <div className="event-pill">
              <span className="date">DEC 15</span>
              <p>Tech Conference</p>
            </div>
            <div className="event-pill">
              <span className="date">JAN 05</span>
              <p>React Summit</p>
            </div>
          </div>
          <div className="promo-box">
              <h5>Pro Tip</h5>
              <p>Use the search bar to quickly filter your projects by name.</p>
          </div>

          {/* ADDED: Help Section for Non-IT and IT Users */}
          <div className="help-section-card" style={{ marginTop: "20px" }}>
            <div className="card-header" onClick={() => setShowHelp(!showHelp)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
                <h4 style={{ fontSize: "0.9rem", margin: 0, color: "#e6edf3" }}>📖 User Guide</h4>
                <span style={{ fontSize: "0.8rem", color: "#8b949e" }}>{showHelp ? "Close ▲" : "Help ▼"}</span>
            </div>
            
            {showHelp && (
                <div className="help-content" style={{ marginTop: "10px", padding: "0 10px 10px" }}>
                    <div className="help-step">
                        <div className="step-badge">1</div>
                        <div className="step-text">
                            <strong>Create:</strong> Click "Create Repository" in Navbar.
                        </div>
                    </div>
                    <div className="help-step">
                        <div className="step-badge">2</div>
                        <div className="step-text">
                            <strong>Terminal:</strong> Open folder in your CMD/Terminal.
                        </div>
                    </div>
                    <div className="help-step">
                        <div className="step-badge">3</div>
                        <div className="step-text">
                            <strong>Prepare:</strong> Run <code>cv init</code>
                        </div>
                    </div>
                    <div className="help-step">
                        <div className="step-badge">4</div>
                        <div className="step-text">
                            <strong>Stage:</strong> Run <code>cv add .</code>
                        </div>
                    </div>
                    <div className="help-step">
                        <div className="step-badge">5</div>
                        <div className="step-text">
                            <strong>Save:</strong> Run <code>cv commit "Initial"</code>
                        </div>
                    </div>
                    <div className="help-step">
                        <div className="step-badge">6</div>
                        <div className="step-text">
                            <strong>Push:</strong> Run <code>cv push</code>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Dashboard;



