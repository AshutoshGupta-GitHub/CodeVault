import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; 
import "./createRepo.css";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const owner = localStorage.getItem("userId");
    try {
      const response = await axios.post("http://localhost:3000/repo/create", {
        name, description, owner, visibility: true
      });
      if (response.status === 201) {
        alert("✨ Repository Created Successfully!");
        navigate("/"); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create repository");
    }
  };

  return (
    <div className="create-repo-wrapper">
      <Navbar />
      <div className="main-content-area">
        <div className="compact-form-card">
          <div className="form-header-compact">
            <h1>Create a new repository</h1>
            <p>Launch your project on the cloud.</p>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="input-row-compact">
              <div className="input-block">
                <label>Owner</label>
                <div className="user-pill-small">👤 You</div>
              </div>
              <span className="slash-text-small">/</span>
              <div className="input-block grow">
                <label>Repository name <span>*</span></label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="e.g. my-new-app"
                />
              </div>
            </div>

            <div className="input-block">
              <label>Description <span>(optional)</span></label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="What is this project about?"
                rows="3"
              />
            </div>

            <div className="status-box-compact">
              <span className="icon">🌐</span>
              <div className="text">
                <strong>Public</strong>
                <p>Anyone can see this repository.</p>
              </div>
            </div>

            {error && <div className="error-msg-small">{error}</div>}

            <div className="footer-action-compact">
              <button type="submit" className="create-btn-small">Create Repository</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRepo;



// //Gemini code to create a repository for the logged-in user

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "./Navbar"; 
// import "./createRepo.css";

// const CreateRepo = () => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const owner = localStorage.getItem("userId");
//     try {
//       const response = await axios.post("http://localhost:3000/repo/create", {
//         name, description, owner, visibility: true
//       });
//       if (response.status === 201) {
//         alert("✨ Repository Created Successfully!");
//         navigate("/"); 
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to create repository");
//     }
//   };

//   return (
//     <div className="create-repo-wrapper">
//       <Navbar />
//       <div className="main-content-area">
//         <div className="central-form-card">
//           <div className="form-header">
//             <h1>Create a new repository</h1>
//             <p>Launch your project on the cloud.</p>
//           </div>

//           <form onSubmit={handleSubmit} className="modern-form">
//             <div className="input-row">
//               <div className="input-block">
//                 <label>Owner</label>
//                 <div className="user-pill">👤 You</div>
//               </div>
//               <span className="slash-text">/</span>
//               <div className="input-block grow">
//                 <label>Repository name <span>*</span></label>
//                 <input 
//                   type="text" 
//                   value={name} 
//                   onChange={(e) => setName(e.target.value)} 
//                   required 
//                   placeholder="e.g. my-new-app"
//                 />
//               </div>
//             </div>

//             <div className="input-block">
//               <label>Description <span>(optional)</span></label>
//               <textarea 
//                 value={description} 
//                 onChange={(e) => setDescription(e.target.value)} 
//                 placeholder="What is this project about?"
//               />
//             </div>

//             <div className="status-box">
//               <span className="icon">🌐</span>
//               <div className="text">
//                 <strong>Public</strong>
//                 <p>Anyone can see this repository.</p>
//               </div>
//             </div>

//             {error && <div className="error-msg">{error}</div>}

//             <div className="footer-action">
//               <button type="submit" className="create-btn">Create Repository</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateRepo;


//Gemini code to create a repository for the logged-in user


// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "./Navbar"; // Adjust path if needed
// import "./createRepo.css";

// const CreateRepo = () => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const owner = localStorage.getItem("userId"); // Get logged-in user ID

//     try {
//       const response = await axios.post("http://localhost:3000/repo/create", {
//         name,
//         description,
//         owner,
//         visibility: true, // Defaulting to public
//         content: [],
//         issues: []
//       });

//       if (response.status === 201) {
//         alert("Repository Created Successfully!");
//         navigate("/"); // Redirect back to Dashboard
//       }
//     } catch (err) {
//       console.error("Error creating repository:", err);
//       setError(err.response?.data?.message || "Failed to create repository");
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="create-repo-container">
//         <div className="create-repo-box">
//           <h2>Create a new repository</h2>
//           <p className="subtitle">A repository contains all project files, including the revision history.</p>
//           <hr />
          
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Repository name <span>*</span></label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 placeholder="e.g. my-awesome-project"
//               />
//               <p className="input-info">Great repository names are short and memorable.</p>
//             </div>

//             <div className="form-group">
//               <label>Description <span>(optional)</span></label>
//               <input
//                 type="text"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Briefly describe your project"
//               />
//             </div>

//             {error && <p className="error-msg">{error}</p>}
            
//             <hr />
//             <button type="submit" className="create-btn">
//               Create repository
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CreateRepo;