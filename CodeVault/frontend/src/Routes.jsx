// Gemini code to fix Create Repository page and routing or fetch data from S3 bucket and display it on the dashboard.

import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom"; 

// Importing components
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Profile from "./components/user/Profile.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import CreateRepo from "./components/CreateRepo.jsx"; 
// ✅ ADDED: Import the RepoView component
import RepoView from "./components/RepoView.jsx"; 

// Importing auth context
import { useAuth } from "./authContext.jsx";


// ✅ ADDED: Import the new component (we will create this next)
import OtherUserProfile from "./components/user/OtherUserProfile.jsx";  // By Gemini, this is the page that will show other users' profiles when we search for them in the navbar.

const ProjectRoutes = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const navigate = useNavigate(); 

    useEffect(() => {
        const userIdFromStorage = localStorage.getItem('userId');

        if (userIdFromStorage && !currentUser) {
            setCurrentUser(userIdFromStorage);
        }

        // Protected routes check
        if (!userIdFromStorage && !["/auth", "/signup", "/auth/", "/signup/"].includes(window.location.pathname)) {
            navigate('/auth');
        }

        if (userIdFromStorage && window.location.pathname === "/auth") {
            navigate('/');
        }

    }, [currentUser, navigate, setCurrentUser]);

    let elements = useRoutes([
        {
            path: "/",
            element: <Dashboard />,
        },
        {
            path: "/profile",
            element: <Profile />,
        },

        // ✅ ADDED: Route for searching other users
        {
            path: "/profile/:username",
            element: <OtherUserProfile />,      // By Gemini, this is the page that will show other users' profiles when we search for them in the navbar. It uses the same Profile component but fetches data based on username instead of current logged in user.
        },


        {
            path: "/auth",
            element: <Login />,
        },
        {
            path: "/signup",
            element: <Signup />,
        },
        {
            path: "/create",
            element: <CreateRepo />,
        },
        // ✅ ADDED: Route for the Repository Explorer View
        // The ":repoName" allows us to use the same page for any repository clicked
        {
            path: "/repo/:repoName",
            element: <RepoView />,
        },
    ]);

    return elements;
}

export default ProjectRoutes;


//******/




//Gemini code to fix Create Repository page and routing


// import React, { useEffect } from "react";
// import { useNavigate, useRoutes } from "react-router-dom"; 

// // Importing components
// import Dashboard from "./components/dashboard/dashboard.jsx";
// import Profile from "./components/user/Profile.jsx";
// import Login from "./components/auth/Login.jsx";
// import Signup from "./components/auth/Signup.jsx";
// // ✅ ADDED: Import the CreateRepo component here
// import CreateRepo from "./components/CreateRepo.jsx"; 

// // Importing auth context
// import { useAuth } from "./authContext.jsx";

// const ProjectRoutes = () => {
//     const { currentUser, setCurrentUser } = useAuth();
//     const navigate = useNavigate(); 

//     useEffect(() => {
//         const userIdFromStorage = localStorage.getItem('userId');

//         if (userIdFromStorage && !currentUser) {
//             setCurrentUser(userIdFromStorage);
//         }

//         // Added "/create" to the protected list. 
//         // If a user isn't logged in, they shouldn't be able to go to /create either.
//         if (!userIdFromStorage && !["/auth", "/signup", "/auth/", "/signup/"].includes(window.location.pathname)) {
//             navigate('/auth');
//         }

//         if (userIdFromStorage && window.location.pathname === "/auth") {
//             navigate('/');
//         }

//     }, [currentUser, navigate, setCurrentUser]);

//     let elements = useRoutes([
//         {
//             path: "/",
//             element: <Dashboard />,
//         },
//         {
//             path: "/profile",
//             element: <Profile />,
//         },
//         {
//             path: "/auth",
//             element: <Login />,
//         },
//         {
//             path: "/signup",
//             element: <Signup />,
//         },
//         // ✅ ADDED: New route object for Create Repository
//         {
//             path: "/create",
//             element: <CreateRepo />,
//         },
//     ]);

//     return elements;
// }

// export default ProjectRoutes;


//Gemini code

// import React, { useEffect } from "react";
// import { useNavigate, useRoutes } from "react-router-dom"; // ✅ Import hooks

// // Importing components
// import Dashboard from "./components/dashboard/dashboard.jsx";
// import Profile from "./components/user/Profile.jsx";
// import Login from "./components/auth/Login.jsx";
// import Signup from "./components/auth/Signup.jsx";

// // Importing auth context
// import { useAuth } from "./authContext.jsx";

// const ProjectRoutes = () => {
//     const { currentUser, setCurrentUser } = useAuth();
//     const navigate = useNavigate(); // ✅ FIX: Define navigate here!

//     useEffect(() => {
//         const userIdFromStorage = localStorage.getItem('userId');

//         if (userIdFromStorage && !currentUser) {
//             setCurrentUser(userIdFromStorage);
//         }

//         // ✅ FIX 1: Allow both "/auth" and "/auth/" (with trailing slash)
//         // We added "/auth/" and "/signup/" to this list so the code doesn't get confused.
//         if (!userIdFromStorage && !["/auth", "/signup", "/auth/", "/signup/"].includes(window.location.pathname)) {
//             navigate('/auth');
//         }

//         // ✅ FIX 2: If logged in, redirect to Dashboard
//         if (userIdFromStorage && window.location.pathname === "/auth") {
//             navigate('/');
//         }

//     }, [currentUser, navigate, setCurrentUser]);

    
//     // useEffect(() => {
//     //     const userIdFromStorage = localStorage.getItem('userId');

//     //     if (userIdFromStorage && !currentUser) {
//     //         setCurrentUser(userIdFromStorage); // (Make sure this matches how your context expects the ID)
//     //     }

//     //     if (!userIdFromSstorage && !["/auth", "/signup"].includes(window.location.pathname)) {
//     //         navigate('/auth');
//     //     }

//     //     if (userIdFromStorage && window.location.pathname === "/auth") {
//     //         navigate('/');
//     //     }

//     // }, [currentUser, navigate, setCurrentUser]);

//     let elements = useRoutes([
//         {
//             path: "/",
//             element: <Dashboard />,
//         },
//         {
//             path: "/profile",
//             element: <Profile />,
//         },
//         {
//             path: "/auth",
//             element: <Login />,
//         },
//         {
//             path: "/signup",
//             element: <Signup />,
//         },
//     ]);

//     return elements;
// }

// export default ProjectRoutes;



//Real code from Video

// import React,{ useEffect } from "react";
// import {useNavigate, useRoutes} from "react-router-dom";

// // Importing components
// import Dashboard from "./components/dashboard/dashboard.jsx";
// import Profile from "./components/user/Profile.jsx";
// import Login from "./components/auth/Login.jsx";
// import Signup from "./components/auth/Signup.jsx";


// // Importing auth context
// import { useAuth } from "./authContext.jsx";

// const ProjectRoutes = () => {
//     const {currentUser, setCurrentUser} = useAuth();

//     useEffect(() => {
//         const userIdFromStorage = localStorage.getItem('userId');

//         if (userIdFromStorage && !currentUser) {
//             setCurrentUser({ id: userIdFromStorage });
//         }

//         if (!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname)) {
//             navigate('/auth');
//         }

//         if(userIdFromStorage && window.location.pathname === "/auth") {
//             navigate('/');
//         }

//     }, [currentUser, navigate, setCurrentUser]);

//     let elements = useRoutes([
//         {
//             path:"/",
//             element:<Dashboard/>,
//         },
//         {
//             path:"/profile",
//             element:<Profile/>,
//         },
//         {
//             path:"/auth",
//             element:<Login/>,
//         },
//         {
//             path:"/signup",
//             element:<Signup/>,
//         },

//     ]);
//     return elements;
// }

// export default ProjectRoutes;