import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({
                        id: decoded.id,
                        username: decoded.username,
                        role: decoded.role,
                    });
                } else {
                    // Token is expired
                    sessionStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                sessionStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        }
        setIsLoading(false);
    }, [token]);

    const login = async (username, password) => {
        const response = await authService.login(username, password);
        const newToken = response.data.token;
        sessionStorage.setItem('token', newToken);
        setToken(newToken);
        const decoded = jwtDecode(newToken);
        setUser({
            id: decoded.id,
            username: decoded.username,
            role: decoded.role,
        });
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 