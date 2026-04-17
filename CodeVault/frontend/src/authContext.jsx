import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const useId = localStorage.getItem('userId');
        if (useId) {
            setCurrentUser({ id: useId });
        }
    }, []);
    const value = {
        currentUser, setCurrentUser
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}