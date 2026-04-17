//New Navbar code, with search bar to search others user profiles,

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import logo from "../assets/CodeVault-logo.png"; // Make sure the extension (.png/.jpg) matches your file exactly!

const Navbar = () => {
  const [searchUser, setSearchUser] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchUser.trim() !== "") {
      // Navigate to the dynamic profile route
      navigate(`/profile/${searchUser.trim()}`);
      setSearchUser(""); // Clear input after search
    }
  };

  return (
    <nav className="navbar-container">
      <Link to="/" className="nav-logo">
        <div>
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            // src={logo}
            alt="CodeVault Logo"
          />
          <h3>CodeVault</h3>
        </div>
      </Link>

      <div className="nav-links">
        {/* NEW: Global User Search Bar */}
        <div className="nav-search-wrapper">
          <input
            type="text"
            placeholder="Search users..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            onKeyDown={handleSearch}
            className="nav-search-input"
          />
        </div>

        <Link to="/create">
          <p>Create a Repository</p>
        </Link>
        <Link to="/profile">
          <p>Profile</p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;


