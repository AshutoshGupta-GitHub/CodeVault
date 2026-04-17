import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import "./repoView.css";

const RepoView = () => {
  const { repoName } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchingContent, setFetchingContent] = useState(false);


  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // PERMANENT FIX: Decode the URL name before using it in the fetch
        const decodedName = decodeURIComponent(repoName);
        
        const response = await fetch(`http://localhost:3000/repo/files/${decodedName}`);
        const data = await response.json();
        
        if (data.files) {
          const processedFiles = data.files.map(file => {
            // Use the fullPath or Key provided by the backend
            const pathParts = file.fullPath ? file.fullPath.split("/") : [];
            const displayPath = pathParts.length > 3 ? pathParts.slice(3).join("/") : file.name;
            
            return {
              ...file,
              displayPath: displayPath || file.name
            };
          });
          setFiles(processedFiles);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching files:", err);
        setLoading(false);
      }
    };
    fetchFiles();
  }, [repoName]);

  
  const handleFileClick = async (fileName) => {
      setFetchingContent(true);
      setSelectedFileName(fileName);
      setSelectedFileContent(""); 
      try {
        const response = await fetch(`http://localhost:3000/repo/file-content/${repoName}/${fileName}`);
        const data = await response.json();
        
        if (response.ok) {
          setSelectedFileContent(data.content);
          setIsModalOpen(true);
        } else {
          alert("Backend Error: " + (data.error || "Unknown error"));
        }
      } catch (err) {
        console.error("Network Error:", err);
        alert("Could not connect to the server.");
      } finally {
        setFetchingContent(false);
      }
  };

  // --- NEW FUNCTION FOR FETCHING FILE CONTENT WHEN A FILE IS CLICKED ---
  // --- NEW FUNCTION FOR UPLOADING FILES FROM THE BROWSER ---

  const [isUploading, setIsUploading] = useState(false);

  const handleBrowserUpload = async (fileList) => {
      if (!fileList || fileList.length === 0) return;

      const formData = new FormData();
      // Use "files" as the key to match your router's upload.array("files")
      for (let i = 0; i < fileList.length; i++) {
        formData.append("files", fileList[i]);
      }

      try {
        setIsUploading(true);
        // We use the route you just added to repo.router.js
        // Change this line in RepoView.jsx
        const response = await fetch(`http://localhost:3000/upload-files/${repoName}`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ " + data.message);
            window.location.reload(); // Refresh to show new files from S3
        } else {
            alert("❌ Upload failed: " + data.error);
        }
      } catch (err) {
        console.error("Upload Error:", err);
        alert("Server error during upload.");
      } finally {
        setIsUploading(false);
      }
    };


  return (
    <div className="repo-view-wrapper">
      <Navbar />
      <div className="repo-container">
        <div className="repo-view-header">
          <div className="repo-path">
            <span className="repo-icon">📁</span>
            <h2 className="repo-name-display">{repoName}</h2>
            <span className="visibility-label">Public</span>
          </div>
        </div> 

        {/* This is for upload files Options */}
        <div className="repo-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
          <div className="dropdown">
            <button className="add-file-btn">
              Add file <span style={{ fontSize: '10px' }}>▼</span>
            </button>
            <div className="dropdown-content">
              <label htmlFor="file-upload" className="dropdown-item" style={{ cursor: 'pointer' }}>
                Upload files
              </label>
              <input 
                id="file-upload" 
                type="file" 
                multiple 
                style={{ display: 'none' }} 
                onChange={(e) => handleBrowserUpload(e.target.files)} 
              />
            </div>
          </div>
        </div>


        <div className="file-explorer-card">
          <div className="explorer-header">
            <div className="col-name">Name</div>
            <div className="col-date">Last Modified</div>
            <div className="col-size">Size</div>
          </div>

          <div className="explorer-body">
            {loading ? (
              <div className="loading-state">Fetching from AWS S3...</div>
            ) : files.length > 0 ? (
              files.map((file, index) => (
                <div key={index} className="file-row">
                  <div className="col-name file-info">
                    {/* UPDATED: Change icon based on whether it's in a folder */}
                    <span className="file-icon">
                      {file.displayPath.includes("/") ? "📁" : "📄"}
                    </span>
                    
                    <span 
                      className="file-text clickable-file" 
                      onClick={() => handleFileClick(file.name)}
                    >
                      {/* UPDATED: Show the path (e.g. models/model.txt) */}
                      {file.displayPath}
                    </span>
                  </div>
                  <div className="col-date">
                    {new Date(file.lastModified).toLocaleDateString()}
                  </div>
                  <div className="col-size">
                    {(file.size / 1024).toFixed(2)} KB
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-repo-state">
                <div className="setup-guide">
                  <h3>Quick setup — if you’ve done this kind of thing before</h3>
                  <p>Get started by pushing your local files to this repository.</p>
    
                  <div className="command-box">
                    <p className="command-comment"># Initialize your local directory</p>
                    <code>cv init</code>
      
                    <p className="command-comment"># Stage all your files</p>
                    <code>cv add .</code>
      
                    <p className="command-comment"># Commit your changes</p>
                    <code>cv commit "Initial upload"</code>
      
                    <p className="command-comment"># Push to the cloud</p>
                    <code className="highlight-command">cv push</code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* {isModalOpen && (
        <div className="file-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="file-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <span className="file-icon">📄</span>
                <h3>{selectedFileName}</h3>
              </div>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              {selectedFileContent ? (
                  <pre className="file-code-block">{selectedFileContent}</pre>
              ) : (
                  <div className="loading-content">Reading file data...</div>
              )}
            </div>
          </div>
        </div>
      )} */}

      {/* Modal and Overlay logic stays exactly as you provided  for upload files option*/}
      {isModalOpen && (
        <div className="file-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="file-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <span className="file-icon">📄</span>
                <h3>{selectedFileName}</h3>
              </div>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              {selectedFileContent ? (
                  <pre className="file-code-block">{selectedFileContent}</pre>
              ) : (
                  <div className="loading-content">Reading file data...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {fetchingContent && (
        <div className="fetching-overlay">
          <div className="loader-text">Loading file content...</div>
        </div>
      )}
    </div>
  );
};

export default RepoView;


